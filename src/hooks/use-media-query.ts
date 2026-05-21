'use client'

import { useEffect, useState } from 'react'

/**
 * SSR-safe `matchMedia` subscription.
 *
 * Returns `false` on the server and on the initial client render to avoid
 * hydration mismatches, then flips to the actual match after mount and stays
 * subscribed to changes. Falls back to the legacy `addListener`/`removeListener`
 * API when the modern event-target methods are unavailable.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia(query)
    const update = () => setMatches(mql.matches)
    update()
    if (mql.addEventListener) mql.addEventListener('change', update)
    else mql.addListener(update)
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', update)
      else mql.removeListener(update)
    }
  }, [query])

  return matches
}
