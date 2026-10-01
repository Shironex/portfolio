'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * `false` on the server and while the server HTML is being hydrated, `true`
 * from the first client render after that. The flip lands in the same
 * re-render as `useMediaQuery`, right after hydration; a paint of the server
 * HTML can come first, so anything that must look right in that paint is
 * gated in CSS, not on this.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}
