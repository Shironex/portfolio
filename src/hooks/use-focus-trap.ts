'use client'

import { type RefObject, useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter(
    (el) =>
      !el.hasAttribute('data-focus-trap-ignore') && el.offsetParent !== null
  )
}

/**
 * Trap focus inside `containerRef` while `active` is true. Returns focus to
 * the element that was focused when the trap was activated once it's released.
 * Tab / Shift+Tab cycle within the container.
 */
export function useFocusTrap<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  active: boolean
) {
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return
    const container = containerRef.current
    if (!container) return

    previouslyFocused.current = document.activeElement as HTMLElement | null

    const focusables = getFocusable(container)
    if (focusables.length > 0) {
      focusables[0].focus()
    } else {
      container.setAttribute('tabindex', '-1')
      container.focus()
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const current = getFocusable(container)
      if (current.length === 0) {
        event.preventDefault()
        return
      }
      const first = current[0]
      const last = current[current.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (event.shiftKey) {
        if (active === first || !container.contains(active)) {
          event.preventDefault()
          last.focus()
        }
      } else {
        if (active === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      const returnTarget = previouslyFocused.current
      if (returnTarget && typeof returnTarget.focus === 'function') {
        returnTarget.focus()
      }
    }
  }, [active, containerRef])
}
