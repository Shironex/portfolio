'use client'

import { useEffect, useState } from 'react'

/**
 * Wall clock, ticking every `intervalMs`. Returns `null` until mounted: the
 * server's clock and locale differ from the browser's, so any timestamp baked
 * into the SSR HTML is a guaranteed hydration mismatch. Callers render a
 * placeholder while this is null.
 */
export function useClock(intervalMs = 30_000) {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(t)
  }, [intervalMs])
  return now
}
