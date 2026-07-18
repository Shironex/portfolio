'use client'

import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'shiroos:theme'

function readStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null
  const v = window.localStorage.getItem(STORAGE_KEY)
  return v === 'light' || v === 'dark' ? v : null
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

/**
 * Flip the theme inside a View Transition so the palette cross-fades instead
 * of hard-swapping. Falls back to an instant swap when the API is missing or
 * the user prefers reduced motion. Only used for user-initiated toggles — the
 * initial mount applies the stored theme directly, without an animation.
 */
function applyThemeAnimated(theme: Theme) {
  if (typeof document === 'undefined') return
  const doc = document as Document & {
    startViewTransition?: (callback: () => void) => unknown
  }
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches
  if (doc.startViewTransition && !reducedMotion) {
    doc.startViewTransition(() => applyTheme(theme))
  } else {
    applyTheme(theme)
  }
}

/**
 * Simple theme hook — reads from localStorage on mount, applies `.dark` class
 * to <html>, persists on every change. Default is light.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => {
    const stored = readStoredTheme()
    if (stored) {
      setThemeState(stored)
      applyTheme(stored)
    }
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    applyThemeAnimated(next)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      applyThemeAnimated(next)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, next)
      }
      return next
    })
  }, [])

  return { theme, setTheme, toggleTheme }
}
