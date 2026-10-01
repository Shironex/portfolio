'use client'

import { useCallback, useEffect, useSyncExternalStore } from 'react'

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

/** Notified whenever a layer opens or closes. */
const listeners = new Set<() => void>()

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

function notify() {
  for (const listener of listeners) listener()
}

/**
 * Whether a layer ranked above `layer` is open. Something that would open
 * `layer` checks this first, so it never mounts under what covers it.
 */
export function isLayerOpenAbove(layer: EscapeLayer): boolean {
  const rank = ESCAPE_LAYERS.indexOf(layer)
  return entries.some((entry) => entry.rank > rank)
}

const noLayerOnServer = () => false

/**
 * {@link isLayerOpenAbove} as state: re-renders when a layer above `layer`
 * opens or the last one closes. `AmbientPause` holds the wallpaper
 * animations still on it while anything is open over the desktop.
 */
export function useLayerOpenAbove(layer: EscapeLayer): boolean {
  const getSnapshot = useCallback(() => isLayerOpenAbove(layer), [layer])
  return useSyncExternalStore(subscribe, getSnapshot, noLayerOnServer)
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
    notify()
    return () => {
      entries.splice(entries.indexOf(entry), 1)
      if (entries.length === 0) {
        window.removeEventListener('keydown', onKeyDown)
      }
      notify()
    }
  }, [layer, onEscape, active])
}
