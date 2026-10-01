'use client'

import { useEffect, useState } from 'react'

import type { z } from 'zod'

const FEED_TIMEOUT_MS = 15_000

export type ApiFeedState<T> =
  | { kind: 'loading' }
  | { kind: 'ready'; data: T }
  | { kind: 'unconfigured' }
  | { kind: 'error' }

/** How a request that got an answer ends; failures reject instead. */
type FeedResult<T> = Extract<
  ApiFeedState<T>,
  { kind: 'ready' | 'unconfigured' }
>

interface FeedRequest<T> {
  promise: Promise<FeedResult<T>>
  controller: AbortController
  /** Mounted hooks waiting on (or showing) this request. */
  readers: number
  /** Set once the request has landed, so a remount can render it right away. */
  result?: FeedResult<T>
}

/**
 * One request per path for the life of the page. Closing and reopening a
 * window (or minimizing and restoring it) remounts its app, and the remount
 * reads the parsed body from here instead of hitting the route again.
 * Failed requests are dropped, so the next mount retries.
 */
const requests = new Map<string, FeedRequest<unknown>>()

function drop(path: string, request: FeedRequest<unknown>) {
  if (requests.get(path) === request) requests.delete(path)
}

function requestFeed<T>(path: string, schema: z.ZodType<T>): FeedRequest<T> {
  const existing = requests.get(path)
  if (existing) return existing as FeedRequest<T>

  const controller = new AbortController()
  const land = (result: FeedResult<T>) => {
    request.result = result
    return result
  }
  const request: FeedRequest<T> = {
    controller,
    readers: 0,
    // eslint-disable-next-line noctcore-security/no-user-controlled-fetch-url -- root-relative API route named by the calling component, not request input
    promise: fetch(path, {
      signal: AbortSignal.any([
        controller.signal,
        AbortSignal.timeout(FEED_TIMEOUT_MS),
      ]),
    }).then(async (r) => {
      if (r.status === 501) return land({ kind: 'unconfigured' })
      if (!r.ok) throw new Error(`${path} returned ${r.status}`)
      return land({ kind: 'ready', data: schema.parse(await r.json()) })
    }),
  }
  requests.set(path, request)
  request.promise.catch(() => drop(path, request))
  return request
}

function cachedState<T>(path: string): ApiFeedState<T> {
  const request = requests.get(path) as FeedRequest<T> | undefined
  return request?.result ?? { kind: 'loading' }
}

/**
 * Fetch an API route once and parse the body with `schema`. A 501 (the route's
 * way of saying a token or similar is not set) maps to `unconfigured`; any
 * other failure (network, timeout, bad shape) maps to `error`.
 *
 * The request is aborted if the last component reading it unmounts before it
 * lands.
 *
 * Pass a module-level schema: a new schema identity re-subscribes.
 */
export function useApiFeed<T>(
  path: string,
  schema: z.ZodType<T>
): ApiFeedState<T> {
  const [state, setState] = useState<ApiFeedState<T>>(() => cachedState(path))

  useEffect(() => {
    const request = requestFeed(path, schema)
    request.readers++
    let cancelled = false
    request.promise.then(
      (result) => {
        if (!cancelled) setState(result)
      },
      () => {
        if (!cancelled) setState({ kind: 'error' })
      }
    )
    return () => {
      cancelled = true
      request.readers--
      if (request.readers > 0 || request.result) return
      drop(path, request as FeedRequest<unknown>)
      request.controller.abort()
    }
  }, [path, schema])

  return state
}
