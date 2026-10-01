'use client'

import type { RefObject } from 'react'
import { useEffect } from 'react'

import { AMBIENT_ATTRIBUTE, AMBIENT_PAUSED } from '@/lib/os/dom'

import { useLayerOpenAbove } from '@/hooks/use-escape-layer'

interface AmbientPauseProps {
  /** The shell root: the element the pause is marked on. */
  rootRef: RefObject<HTMLElement | null>
  /** Whether a maximized window covers the desktop. */
  covered: boolean
}

/**
 * Holds the decorative loops still while nobody can see them: under a
 * maximized window and under any open layer (menu, start menu, palette,
 * lightbox, boot splash). See `ambient-loop` in globals.css.
 *
 * A leaf that renders nothing. It subscribes to the open layers itself and
 * writes the attribute straight to the shell root, so a menu, the palette or
 * a lightbox opening re-renders this and not the shell.
 */
export function AmbientPause({ rootRef, covered }: AmbientPauseProps) {
  const layerOpen = useLayerOpenAbove('window')
  const paused = covered || layerOpen

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (paused) root.setAttribute(AMBIENT_ATTRIBUTE, AMBIENT_PAUSED)
    else root.removeAttribute(AMBIENT_ATTRIBUTE)
  }, [rootRef, paused])

  return null
}
