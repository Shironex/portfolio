'use client'

import { type RefObject, useEffect } from 'react'

import { canTakeFocus, focusedElement, isLiveRegion } from '@/lib/os/dom'
import { inertOthers } from '@/lib/os/modal-layer'

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
      // A negative tabindex takes a control out of the tab order (options of
      // a listbox, the unchecked radios of a group).
      el.tabIndex >= 0 &&
      !el.hasAttribute('data-focus-trap-ignore') &&
      el.offsetParent !== null
  )
}

interface Trap {
  container: HTMLElement
  /** What had focus when the layer opened. */
  returnTo: HTMLElement | null
  /** The trap `returnTo` sat in: the layer this one was opened from. */
  parent: Trap | null
}

/** The active traps, bottom to top. Only the top one acts. */
const traps: Trap[] = []

function focusEdge(container: HTMLElement, edge: 'first' | 'last') {
  const focusables = getFocusable(container)
  const target =
    edge === 'first' ? focusables[0] : focusables[focusables.length - 1]
  ;(target ?? container).focus()
}

/**
 * Where focus goes when `trap` lets go: what had it before, or, when that is
 * gone with the layer it sat in, what that layer would have returned to.
 */
function returnTarget(trap: Trap): HTMLElement | null {
  for (let from: Trap | null = trap; from; from = from.parent) {
    if (canTakeFocus(from.returnTo)) return from.returnTo
  }
  return null
}

/**
 * Make `containerRef` a modal layer while `active` is true.
 *
 * - Focus moves into the container (onto its first control, or onto the
 *   container when nothing had focus before) and Tab / Shift+Tab cycle
 *   inside it.
 * - Focus that ends up anywhere else is pulled back in: the container itself
 *   is focusable, so a press on its own padding stays inside, and a Tab from
 *   the page (after a press on the backdrop) re-enters it.
 * - Everything outside the container is `inert` (see `inertOthers`), so the
 *   page behind is out of the tab order and the accessibility tree.
 * - On release, focus returns to the element that had it when the layer
 *   opened. When that element went away with the layer it sat in (the palette
 *   opened from a sheet, then replaced that sheet), focus goes to what that
 *   layer would have returned to, and failing that into the layer left on
 *   top, so it never falls to the page while something can take it.
 *
 * Traps stack: with the palette open over a mobile sheet only the palette
 * traps, and the sheet takes over again when the palette closes.
 */
export function useFocusTrap<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  active: boolean
) {
  useEffect(() => {
    if (!active) return
    const container = containerRef.current
    if (!container) return

    const returnTo = focusedElement()
    const trap: Trap = {
      container,
      returnTo,
      parent: traps.find((open) => open.container.contains(returnTo)) ?? null,
    }
    const ownTabIndex = container.getAttribute('tabindex')
    if (ownTabIndex === null) container.setAttribute('tabindex', '-1')

    traps.push(trap)
    const releaseInert = inertOthers(container)
    const isTop = () => traps[traps.length - 1] === trap

    // With nothing focused before (a sheet a deep link opens on load), focus
    // rests on the layer itself: no control shows a ring nobody asked for,
    // and Tab moves on to the first one.
    if (returnTo) focusEdge(container, 'first')
    else container.focus()

    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !isTop()) return
      const focusables = getFocusable(container)
      const current = document.activeElement
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const outside = !container.contains(current) || current === container
      if (focusables.length === 0) {
        event.preventDefault()
        container.focus()
      } else if (event.shiftKey && (outside || current === first)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (outside || current === last)) {
        event.preventDefault()
        first.focus()
      }
    }

    const handleFocusIn = (event: FocusEvent) => {
      if (!isTop()) return
      const target = event.target
      if (!(target instanceof Element)) return
      if (container.contains(target) || isLiveRegion(target)) return
      focusEdge(container, 'first')
    }

    document.addEventListener('keydown', handleKey)
    document.addEventListener('focusin', handleFocusIn)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.removeEventListener('focusin', handleFocusIn)
      const index = traps.indexOf(trap)
      if (index !== -1) traps.splice(index, 1)
      // Before the focus call: an inert element cannot take focus.
      releaseInert()
      if (ownTabIndex === null) container.removeAttribute('tabindex')
      const target = returnTarget(trap)
      const top = traps[traps.length - 1]
      if (target) target.focus()
      else if (top && !top.container.contains(document.activeElement)) {
        focusEdge(top.container, 'first')
      }
    }
  }, [active, containerRef])
}
