'use client'

import { useMediaQuery } from '@/hooks/use-media-query'

/** Keep in step with the `md` breakpoint: the shells are gated on it in CSS. */
export const MOBILE_QUERY = '(max-width: 767px)'

/**
 * SSR-safe matchMedia hook for the mobile breakpoint (< 768px).
 *
 * Returns `false` on the server and while the server HTML hydrates, then the
 * real value in the re-render that follows. The server HTML carries both
 * shells and CSS shows the one that fits (see `OsShell`), so a phone never
 * paints the desktop layout while it waits.
 */
export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_QUERY)
}
