'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  type Appearance,
  DEFAULT_APPEARANCE,
  type Mode,
  type PaletteId,
  applyAppearance,
  readStoredAppearance,
  writeStoredAppearance,
} from '@/lib/os/appearance'

export type Theme = Mode
export type { PaletteId }

/**
 * Flip the appearance inside a View Transition so the palette cross-fades
 * instead of hard-swapping. Falls back to an instant swap when the API is
 * missing or the user prefers reduced motion. Only used for user-initiated
 * changes — the boot script has already applied the stored appearance before
 * first paint, so mount never animates.
 */
function applyAnimated(next: Appearance) {
  if (typeof document === 'undefined') return
  const doc = document as Document & {
    startViewTransition?: (callback: () => void) => unknown
  }
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches
  if (doc.startViewTransition && !reducedMotion) {
    doc.startViewTransition(() => applyAppearance(next))
  } else {
    applyAppearance(next)
  }
}

/**
 * Owns both appearance axes: light/dark mode and the colour palette.
 *
 * The boot script has normally applied the stored appearance before paint, so
 * mount is just a sync. It re-applies anyway rather than trusting that: the
 * apply is idempotent, and it is the difference between a dropped boot script
 * degrading into a stale-looking page and it converging on the next tick.
 */
export function useTheme() {
  const [appearance, setAppearance] = useState<Appearance>(DEFAULT_APPEARANCE)

  useEffect(() => {
    const stored = readStoredAppearance()
    setAppearance(stored)
    applyAppearance(stored)
  }, [])

  const commit = useCallback((next: Appearance) => {
    setAppearance(next)
    applyAnimated(next)
    writeStoredAppearance(next)
  }, [])

  /*
   * The next value comes from React state, not from storage. Reading storage
   * back means a browser where setItem throws (private mode, blocked cookies)
   * sees the same value forever, so the toggle only ever moves one way.
   */
  const setTheme = useCallback(
    (mode: Mode) => commit({ ...appearance, mode }),
    [appearance, commit]
  )

  const toggleTheme = useCallback(
    () =>
      commit({
        ...appearance,
        mode: appearance.mode === 'dark' ? 'light' : 'dark',
      }),
    [appearance, commit]
  )

  const setPalette = useCallback(
    (palette: PaletteId) => commit({ ...appearance, palette }),
    [appearance, commit]
  )

  return {
    theme: appearance.mode,
    palette: appearance.palette,
    setTheme,
    toggleTheme,
    setPalette,
  }
}
