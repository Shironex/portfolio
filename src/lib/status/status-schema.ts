import { z } from 'zod'

import type { StatusGroupId } from './services'

/**
 * Wire shape of Gatus `GET /api/v1/endpoints/statuses`, cut down to the
 * fields the page reads. Everything else in a result (hostname, status code,
 * errors, condition text) is dropped by the parse and never reaches a page.
 */
const GatusResultSchema = z.object({
  success: z.boolean(),
  timestamp: z.string(),
  /** Nanoseconds. */
  duration: z.number().optional(),
})

const GatusEndpointSchema = z.object({
  key: z.string(),
  results: z.array(GatusResultSchema).nullish(),
})

export const GatusStatusesSchema = z.array(GatusEndpointSchema)

export type GatusStatuses = z.infer<typeof GatusStatusesSchema>

export type GatusEndpoint = z.infer<typeof GatusEndpointSchema>

/** One check of a service: whether it passed, and when (ISO). */
export interface CheckTick {
  ok: boolean
  at: string
}

export type ServiceState = 'up' | 'down' | 'unknown'

export interface ServiceStatus {
  key: string
  name: string
  href?: string
  state: ServiceState
  /** Share of passing checks over 30 days, 0 to 1, or null when unknown. */
  uptime30d: number | null
  /** Mean response time of the recent checks, in ms. */
  avgMs: number | null
  /** The most recent checks, oldest first. */
  history: CheckTick[]
}

export interface GroupStatus {
  id: StatusGroupId
  title: string
  blurb: string
  services: ServiceStatus[]
}

/**
 * What the page renders: the allowed checks by group, or the fact that the
 * monitor could not be read. Plain data, so it can sit in the cache.
 */
export type StatusReport =
  | {
      reachable: true
      groups: GroupStatus[]
      /** Time of the newest check across every shown service (ISO). */
      checkedAt: string | null
      fetchedAt: string
    }
  | { reachable: false; fetchedAt: string }
