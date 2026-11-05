import type { ServiceStatus, StatusReport } from './status-schema'

/**
 * The page's overall state: every shown check passing, some failing, no
 * fresh data yet, or the monitor itself out of reach.
 */
export type OverallState = 'up' | 'down' | 'unknown' | 'unreachable'

export interface StatusSummary {
  state: OverallState
  total: number
  up: number
  /** The failing services, in page order. */
  down: ServiceStatus[]
  /** Mean of the known 30 day uptimes, 0 to 1. */
  uptime30d: number | null
}

export function summarize(report: StatusReport): StatusSummary {
  if (!report.reachable) {
    return { state: 'unreachable', total: 0, up: 0, down: [], uptime30d: null }
  }
  const services = report.groups.flatMap((group) => group.services)
  const down = services.filter((service) => service.state === 'down')
  const up = services.filter((service) => service.state === 'up').length
  const uptimes = services
    .map((service) => service.uptime30d)
    .filter((uptime) => uptime !== null)
  const state: OverallState =
    down.length > 0 ? 'down' : up === 0 ? 'unknown' : 'up'
  return {
    state,
    total: services.length,
    up,
    down,
    uptime30d:
      uptimes.length > 0
        ? uptimes.reduce((sum, uptime) => sum + uptime, 0) / uptimes.length
        : null,
  }
}

/**
 * Uptime as a percentage, floored to two places so 99.996% never reads as
 * 100%: `100%`, `99.93%`, or `n/a` when Gatus had no answer.
 */
export function formatUptime(uptime: number | null): string {
  if (uptime === null) return 'n/a'
  if (uptime >= 1) return '100%'
  return `${(Math.floor(uptime * 10_000) / 100).toFixed(2)}%`
}

/** `10:41 UTC`: the same for every visitor and every render. */
export function formatCheckTime(iso: string): string {
  return `${new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(iso))} UTC`
}
