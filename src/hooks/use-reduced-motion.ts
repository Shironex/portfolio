'use client'

import { useMediaQuery } from '@/hooks/use-media-query'

/**
 * React to the user's motion preference. Returns `true` when the user has
 * requested reduced motion; components can gate decorative loops and delay
 * auto-dismiss timers accordingly.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
