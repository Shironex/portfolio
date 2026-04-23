'use client'

import { useEffect, useState } from 'react'

const MOBILE_QUERY = '(max-width: 767px)'

/**
 * SSR-safe matchMedia hook for the mobile breakpoint (< 768px).
 *
 * Returns `false` on the server and on the initial client render to avoid
 * hydration mismatches, then flips to the actual value after mount. This
 * means mobile viewports may briefly render the desktop layout on first
 * paint — the boot splash overlay covers that, so it's invisible in practice.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia(MOBILE_QUERY)
    const update = () => setIsMobile(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  return isMobile
}
