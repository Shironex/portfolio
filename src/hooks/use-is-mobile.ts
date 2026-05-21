'use client'

import { useMediaQuery } from '@/hooks/use-media-query'

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
  return useMediaQuery(MOBILE_QUERY)
}
