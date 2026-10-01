'use client'

import { useCallback, useSyncExternalStore } from 'react'

const getServerSnapshot = () => false

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
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!window.matchMedia) return () => {}
      const mql = window.matchMedia(query)
      if (mql.addEventListener) mql.addEventListener('change', onChange)
      else mql.addListener(onChange)
      return () => {
        if (mql.removeEventListener) mql.removeEventListener('change', onChange)
        else mql.removeListener(onChange)
      }
    },
    [query]
  )
  const getSnapshot = useCallback(
    () => window.matchMedia?.(query).matches ?? false,
    [query]
  )
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
