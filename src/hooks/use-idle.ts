'use client'

import { useEffect, useState } from 'react'

/** The longest the browser may hold an idle callback back, in ms. */
const IDLE_TIMEOUT = 2000

/** Where there is no `requestIdleCallback` (Safari): a plain delay. */
const FALLBACK_DELAY = 1500

/**
 * `false` until `enabled` has been true and the browser has been idle once
 * after that, then `true` for good. For work that should wait out the first
 * load: a late chunk (the desktop pet) asks for this before it mounts.
 */
export function useIdle(enabled: boolean): boolean {
  const [idle, setIdle] = useState(false)
  useEffect(() => {
    if (!enabled || idle) return
    const done = () => setIdle(true)
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(done, { timeout: IDLE_TIMEOUT })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(done, FALLBACK_DELAY)
    return () => window.clearTimeout(id)
  }, [enabled, idle])
  return idle
}
