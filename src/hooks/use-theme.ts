'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  type Appearance,
  DEFAULT_APPEARANCE,
  type Mode,
  type SkyId,
  applyAppearance,
  readStoredAppearance,
  writeStoredAppearance,
} from '@/lib/os/appearance'

export type Theme = Mode
export type { SkyId }

/**
 * Name of the Lamp toggle in every place it appears (menu bar, View menu,
 * mobile top bar, ⌘K): what pressing it does.
 */
export function lampLabel(theme: Theme): string {
  return theme === 'dark' ? 'Turn the lamp on' : 'Turn the lamp off'
}

/** How often a Live sky looks at the clock again, in ms. */
const LIVE_SKY_TICK_MS = 60_000

/**
 * Flip the appearance inside a View Transition so the swap cross-fades
 * instead of hard-swapping. Falls back to an instant swap when the API is
 * missing or the user prefers reduced motion. Only used for user-initiated
 * changes: the boot script has already applied the stored appearance before
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
 * Owns both appearance axes: the Lamp (night or paper bodies) and the sky.
 *
 * The boot script has normally applied the stored appearance before paint, so
 * mount is just a sync. It re-applies anyway rather than trusting that: the
 * apply is idempotent, and it is the difference between a dropped boot script
 * degrading into a stale-looking page and it converging on the next tick.
 * While the sky is Live it is re-resolved every minute, without a
 * transition, so the wallpaper follows the time of day in Warsaw.
 */
export function useTheme() {
  const [appearance, setAppearance] = useState<Appearance>(DEFAULT_APPEARANCE)

  useEffect(() => {
    const stored = readStoredAppearance()
    setAppearance(stored)
    applyAppearance(stored)
  }, [])

  useEffect(() => {
    if (appearance.sky !== 'live') return
    const id = window.setInterval(
      () => applyAppearance(appearance),
      LIVE_SKY_TICK_MS
    )
    return () => window.clearInterval(id)
  }, [appearance])

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

  const setSky = useCallback(
    (sky: SkyId) => commit({ ...appearance, sky }),
    [appearance, commit]
  )

  return {
    theme: appearance.mode,
    sky: appearance.sky,
    setTheme,
    toggleTheme,
    setSky,
  }
}
