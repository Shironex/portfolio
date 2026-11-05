import { cacheLife } from 'next/cache'

import 'server-only'

import { STATUS_URL } from '@/lib/constants'
import { UPSTREAM_USER_AGENT } from '@/lib/feed-cache'

import { PUBLIC_CHECKS, type PublicCheck, STATUS_GROUPS } from './services'
import {
  type CheckTick,
  type GatusEndpoint,
  GatusStatusesSchema,
  type GroupStatus,
  type ServiceStatus,
  type StatusReport,
} from './status-schema'

export type * from './status-schema'

/**
 * How many recent checks each row shows, one a minute: 48 on a wide list,
 * the newest half on a narrow one.
 */
export const HISTORY_LENGTH = 48

/** Seconds the page keeps a reading: Gatus checks once a minute. */
export const STATUS_REFRESH_SECONDS = 60

const GATUS_TIMEOUT_MS = 8_000
/** Largest statuses body accepted; the real one is about 60 kB. */
const MAX_STATUSES_BYTES = 2_000_000
const NANOS_PER_MS = 1_000_000

const API = `${STATUS_URL}/api/v1/endpoints`

async function gatusGet(path: string, accept: string): Promise<Response> {
  // eslint-disable-next-line noctcore-security/no-user-controlled-fetch-url -- fixed origin from the STATUS_URL constant; the path is built from the allowlist
  const res = await fetch(`${API}${path}`, {
    headers: { Accept: accept, 'User-Agent': UPSTREAM_USER_AGENT },
    signal: AbortSignal.timeout(GATUS_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`Gatus ${path} returned ${res.status}`)
  return res
}

async function fetchStatuses(): Promise<Map<string, GatusEndpoint>> {
  const res = await gatusGet(
    `/statuses?page=1&pageSize=${HISTORY_LENGTH}`,
    'application/json'
  )
  if (Number(res.headers.get('content-length')) > MAX_STATUSES_BYTES) {
    throw new Error('Gatus statuses are too large')
  }
  const text = await res.text()
  if (text.length > MAX_STATUSES_BYTES) {
    throw new Error('Gatus statuses are too large')
  }
  const endpoints = GatusStatusesSchema.parse(JSON.parse(text))
  return new Map(endpoints.map((endpoint) => [endpoint.key, endpoint]))
}

/** 30 day uptime as 0 to 1; Gatus answers it as plain text (`0.999300`). */
async function fetchUptime(key: string): Promise<number | null> {
  try {
    const res = await gatusGet(
      `/${encodeURIComponent(key)}/uptimes/30d`,
      'text/plain'
    )
    const value = Number.parseFloat(await res.text())
    return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : null
  } catch {
    // One missing uptime leaves its cell empty, not the page.
    return null
  }
}

function toService(
  check: PublicCheck,
  endpoint: GatusEndpoint | undefined,
  uptime30d: number | null
): ServiceStatus {
  const results = [...(endpoint?.results ?? [])]
    .filter((result) => !Number.isNaN(Date.parse(result.timestamp)))
    .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))
    .slice(-HISTORY_LENGTH)
  const history: CheckTick[] = results.map((result) => ({
    ok: result.success,
    at: result.timestamp,
  }))
  const durations = results.flatMap((result) =>
    result.duration !== undefined && result.duration > 0
      ? [result.duration]
      : []
  )
  const last = history.at(-1)
  return {
    key: check.key,
    name: check.name,
    href: check.href,
    state: last ? (last.ok ? 'up' : 'down') : 'unknown',
    uptime30d,
    avgMs:
      durations.length > 0
        ? Math.round(
            durations.reduce((sum, duration) => sum + duration, 0) /
              durations.length /
              NANOS_PER_MS
          )
        : null,
    history,
  }
}

async function readReport(): Promise<StatusReport> {
  const fetchedAt = new Date().toISOString()
  const [endpoints, uptimes] = await Promise.all([
    fetchStatuses(),
    Promise.all(PUBLIC_CHECKS.map((check) => fetchUptime(check.key))),
  ])

  const services = PUBLIC_CHECKS.map((check, i) =>
    toService(check, endpoints.get(check.key), uptimes[i])
  )
  const groups: GroupStatus[] = STATUS_GROUPS.map((group) => ({
    ...group,
    services: services.filter((_, i) => PUBLIC_CHECKS[i].group === group.id),
  })).filter((group) => group.services.length > 0)

  const newest = services
    .map((service) => service.history.at(-1)?.at)
    .filter((at) => at !== undefined)
    .sort()
    .at(-1)

  return { reachable: true, groups, checkedAt: newest ?? null, fetchedAt }
}

/**
 * The status report, kept for a minute and refreshed in the background
 * (`stale` and `revalidate` of 60 s), at most five minutes old. A failure is
 * kept too, as the unreachable report, so a down monitor is asked again a
 * minute later instead of on every request.
 */
export async function getStatusReport(): Promise<StatusReport> {
  'use cache'
  cacheLife({
    stale: STATUS_REFRESH_SECONDS,
    revalidate: STATUS_REFRESH_SECONDS,
    expire: 5 * STATUS_REFRESH_SECONDS,
  })
  try {
    return await readReport()
  } catch (error) {
    console.error('Status report failed', error)
    return { reachable: false, fetchedAt: new Date().toISOString() }
  }
}
