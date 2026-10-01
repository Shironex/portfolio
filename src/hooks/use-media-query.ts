'use client'

import { useCallback, useSyncExternalStore } from 'react'

const getServerSnapshot = () => false

interface SharedQuery {
  mql: MediaQueryList
  subscribers: Set<() => void>
  notify: () => void
}

/** One `MediaQueryList` and one listener per query, however many read it. */
const sharedQueries = new Map<string, SharedQuery>()

function listen(mql: MediaQueryList, notify: () => void) {
  if (mql.addEventListener) mql.addEventListener('change', notify)
  else mql.addListener(notify)
}

function unlisten(mql: MediaQueryList, notify: () => void) {
  if (mql.removeEventListener) mql.removeEventListener('change', notify)
  else mql.removeListener(notify)
}

function subscribeTo(query: string, onChange: () => void) {
  if (!window.matchMedia) return () => {}
  let shared = sharedQueries.get(query)
  if (!shared) {
    const subscribers = new Set<() => void>()
    const created: SharedQuery = {
      mql: window.matchMedia(query),
      subscribers,
      notify: () => {
        for (const subscriber of subscribers) subscriber()
      },
    }
    listen(created.mql, created.notify)
    sharedQueries.set(query, created)
    shared = created
  }
  const { mql, subscribers, notify } = shared
  subscribers.add(onChange)
  return () => {
    subscribers.delete(onChange)
    if (subscribers.size > 0) return
    unlisten(mql, notify)
    sharedQueries.delete(query)
  }
}

/**
 * SSR-safe `matchMedia` subscription.
 *
 * Returns `false` on the server and while the server HTML hydrates, so the
 * markup matches. The real value lands in a re-render right after hydration
 * and stays subscribed to changes. The browser may paint the server HTML
 * before that re-render, so layout that depends on the query should be gated
 * in CSS as well. A component that only ever renders on the client gets the
 * real value on its first render. Falls back to the legacy `addListener`/`removeListener` API
 * when the modern event-target methods are unavailable.
 *
 * Every component reading the same query shares one listener: a desktop full
 * of windows asks for the motion preference once, not once per window.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => subscribeTo(query, onChange),
    [query]
  )
  const getSnapshot = useCallback(
    () =>
      sharedQueries.get(query)?.mql.matches ??
      window.matchMedia?.(query).matches ??
      false,
    [query]
  )
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
