'use client'

import { useEffect } from 'react'

/**
 * Everything Escape can close, bottom to top. One press closes only the
 * highest layer that is open.
 */
const ESCAPE_LAYERS = [
  'window',
  'sheet',
  'launcher',
  'start',
  'menu',
  'palette',
  'lightbox',
  'boot',
] as const

export type EscapeLayer = (typeof ESCAPE_LAYERS)[number]

type EscapeHandler = (event: KeyboardEvent) => void

interface Entry {
  rank: number
  handler: EscapeHandler
}

/** Open layers in the order they registered. */
const entries: Entry[] = []

/**
 * Whether a layer ranked above `layer` is open. Something that would open
 * `layer` checks this first, so it never mounts under what covers it.
 */
export function isLayerOpenAbove(layer: EscapeLayer): boolean {
  const rank = ESCAPE_LAYERS.indexOf(layer)
  return entries.some((entry) => entry.rank > rank)
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || event.defaultPrevented || event.isComposing) {
    return
  }
  // Highest rank wins; among equals, the one that opened last.
  const top = entries.reduce<Entry | null>(
    (best, entry) => (best && best.rank > entry.rank ? best : entry),
    null
  )
  top?.handler(event)
}

/**
 * The shell's one Escape listener. A layer registers while it is open and
 * `onEscape` runs only when nothing above it is: with a menu open over a
 * window, Escape closes the menu and leaves the window alone.
 *
 * Pass a stable `onEscape` (a `useCallback`), or the layer re-registers on
 * every render.
 */
export function useEscapeLayer(
  layer: EscapeLayer,
  onEscape: EscapeHandler,
  active = true
) {
  useEffect(() => {
    if (!active) return
    const entry: Entry = {
      rank: ESCAPE_LAYERS.indexOf(layer),
      handler: onEscape,
    }
    if (entries.length === 0) window.addEventListener('keydown', onKeyDown)
    entries.push(entry)
    return () => {
      entries.splice(entries.indexOf(entry), 1)
      if (entries.length === 0) {
        window.removeEventListener('keydown', onKeyDown)
      }
    }
  }, [layer, onEscape, active])
}
