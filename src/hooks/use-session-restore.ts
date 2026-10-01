'use client'

import { useCallback, useEffect, useRef } from 'react'

import {
  readStoredSession,
  serializeSession,
  writeStoredSession,
} from '@/lib/os/session'

import { MOBILE_QUERY } from './use-is-mobile'
import type { OsWindowsApi } from './use-os-windows'

/** Quiet time after the last window change before the session is written. */
const WRITE_DEBOUNCE_MS = 250

/** Read at call time: `useIsMobile` only settles after the mount effects. */
function isMobileViewport(): boolean {
  return window.matchMedia?.(MOBILE_QUERY).matches ?? false
}

/**
 * Keeps the desktop's open windows in `sessionStorage`, so a reload in the
 * same tab comes back to the same desktop.
 *
 * Reading happens in a mount effect, like the other storage reads, so the
 * server and first client render agree on an empty desktop. A deep link wins:
 * `useDeepLink` runs right after and opens its window on top, raising the
 * restored copy when the session already had one.
 *
 * Writes are debounced, so a drag or resize costs one write when it settles,
 * and flushed on `pagehide` so a reload right after a change keeps it. A stack
 * that serializes to what was last written is not written again.
 *
 * Desktop only. The mobile shell shows the top window as a full-screen sheet,
 * and a reload there should land on the feed, not on a sheet.
 */
export function useSessionRestore(
  os: Pick<OsWindowsApi, 'windows' | 'hydrate'>
) {
  const { windows, hydrate } = os
  // Survives the StrictMode double-invoke, so the session is read exactly once.
  const restored = useRef(false)
  const latest = useRef(windows)
  // What storage is known to hold. Starts as the empty stack, so a fresh
  // desktop writes nothing; `null` once a stored session has been put back.
  const written = useRef<string | null>(serializeSession([]))

  const save = useCallback(() => {
    if (!restored.current || isMobileViewport()) return
    const serialized = serializeSession(latest.current)
    if (serialized === written.current) return
    written.current = serialized
    writeStoredSession(serialized)
  }, [])

  useEffect(() => {
    if (restored.current) return
    restored.current = true
    if (isMobileViewport()) return
    const stored = readStoredSession()
    if (stored.length === 0) return
    written.current = null
    hydrate(stored)
  }, [hydrate])

  useEffect(() => {
    latest.current = windows
    const timer = window.setTimeout(save, WRITE_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [windows, save])

  useEffect(() => {
    window.addEventListener('pagehide', save)
    return () => window.removeEventListener('pagehide', save)
  }, [save])
}
