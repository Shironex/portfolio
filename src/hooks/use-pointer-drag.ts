'use client'

import { useCallback, useEffect, useRef } from 'react'

interface PointerDragHandlers {
  /** Called for every pointer move while a drag gesture is active. */
  onMove: (event: globalThis.MouseEvent) => void
  /** Called once when the gesture ends (mouseup), after listeners detach. */
  onEnd?: () => void
}

/**
 * Owns the window-level `mousemove` / `mouseup` listener lifecycle for a single
 * pointer-drag gesture. Call the returned `start` to begin tracking; the hook
 * attaches the listeners, forwards each move to `onMove`, and on mouseup detaches
 * them and fires `onEnd`. Any in-flight gesture is torn down on unmount.
 *
 * Both window dragging and edge/corner resizing in {@link Window} use this — the
 * delta math lives in the caller's `onMove`, the listener bookkeeping lives here.
 */
export function usePointerDrag({ onMove, onEnd }: PointerDragHandlers) {
  const cleanupRef = useRef<(() => void) | null>(null)

  const stop = useCallback(() => {
    cleanupRef.current?.()
    cleanupRef.current = null
  }, [])

  const start = useCallback(() => {
    // Replace any gesture already in flight so listeners never leak.
    stop()

    const handleMove = (event: globalThis.MouseEvent) => onMove(event)
    const handleUp = () => {
      stop()
      onEnd?.()
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)

    cleanupRef.current = () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [onMove, onEnd, stop])

  useEffect(() => stop, [stop])

  return start
}
