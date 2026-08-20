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
 * Owns both appearance axes: light/dark mode and the colour palette. The
 * document is already correct on arrival — the boot script in the document
 * head runs before paint, so mount only syncs React state to what is on <html>.
 */
export function useTheme() {
  const [appearance, setAppearance] = useState<Appearance>(DEFAULT_APPEARANCE)

  useEffect(() => {
    setAppearance(readStoredAppearance())
  }, [])

  const commit = useCallback((next: Appearance) => {
    setAppearance(next)
    applyAnimated(next)
    writeStoredAppearance(next)
  }, [])

  const setTheme = useCallback(
    (mode: Mode) => commit({ ...readStoredAppearance(), mode }),
    [commit]
  )

  const toggleTheme = useCallback(() => {
    const current = readStoredAppearance()
    commit({ ...current, mode: current.mode === 'dark' ? 'light' : 'dark' })
  }, [commit])

  const setPalette = useCallback(
    (palette: PaletteId) => commit({ ...readStoredAppearance(), palette }),
    [commit]
  )

  return {
    theme: appearance.mode,
    palette: appearance.palette,
    setTheme,
    toggleTheme,
    setPalette,
  }
}
