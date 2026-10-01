'use client'

import { useCallback, useEffect, useRef } from 'react'

import type { Point } from '@/lib/os/geometry'
import { rafThrottle } from '@/lib/utils/raf-throttle'

export interface PointerGesture {
  /**
   * The latest pointer position, at most once per animation frame. This is
   * where a gesture writes to the DOM.
   */
  onFrame: (point: Point) => void
  /**
   * Called once when the gesture ends, after the last position has been
   * handed to `onFrame`. `cancelled` is true when the gesture did not end in
   * a release: the browser took the pointer away (`pointercancel`, lost
   * capture) or the caller called `cancel`.
   */
  onEnd: (cancelled: boolean) => void
}

/** The one place a gesture reads its input event; everything after is points. */
export function pointOf(event: { clientX: number; clientY: number }): Point {
  return { x: event.clientX, y: event.clientY }
}

/**
 * Whether a `pointerdown` starts a gesture: the primary pointer (first finger,
 * the pen, the mouse) with its primary button. Not with Ctrl held: on macOS
 * that press opens the context menu, and its release never arrives.
 */
export function isPrimaryPress(event: {
  isPrimary: boolean
  button: number
  ctrlKey: boolean
}): boolean {
  return event.isPrimary && event.button === 0 && !event.ctrlKey
}

/**
 * Owns the Pointer Events lifecycle of a single drag gesture, for mouse, pen
 * and touch alike. Call the returned `start` from a `pointerdown` handler: the
 * hook captures the pointer on `target`, so moves keep arriving when the
 * pointer leaves it, coalesces them to one `onFrame` per animation frame, and
 * ends the gesture on release, on `pointercancel` or when the capture is lost.
 * A mouse move with no button down ends it too: the release went to something
 * else (a context menu, another window). A gesture still in flight is
 * cancelled on unmount.
 *
 * `cancel` ends the gesture in flight, if any, as cancelled. Call it before
 * `target` leaves the DOM or what the gesture measured at its start stops
 * being true: the listeners live on `target`, and a detached node hears
 * nothing more.
 *
 * `target` needs `touch-action: none`, or a touch drag is taken over by the
 * browser as a scroll and cancelled.
 *
 * Window dragging and edge/corner resizing both run on this (see
 * `useWindowDrag`): the geometry lives in the caller's `onFrame`, the listener
 * and frame bookkeeping lives here.
 */
export function usePointerDrag() {
  const cancelRef = useRef<(() => void) | null>(null)

  const cancel = useCallback(() => cancelRef.current?.(), [])

  const start = useCallback(
    (
      event: { pointerId: number },
      target: HTMLElement,
      gesture: PointerGesture
    ) => {
      // Replace any gesture already in flight so listeners never leak.
      cancelRef.current?.()

      const { pointerId } = event
      const frame = rafThrottle(gesture.onFrame)

      const handleMove = (e: PointerEvent) => {
        if (e.pointerId !== pointerId) return
        if (e.pointerType === 'mouse' && e.buttons === 0) {
          // Released where no `pointerup` could reach: end where the window
          // was last drawn, not where the pointer has wandered since.
          finish(false)
          return
        }
        frame.schedule(pointOf(e))
      }
      const finish = (cancelled: boolean) => {
        target.removeEventListener('pointermove', handleMove)
        target.removeEventListener('pointerup', handleUp)
        target.removeEventListener('pointercancel', handleCancel)
        target.removeEventListener('lostpointercapture', handleCancel)
        cancelRef.current = null
        if (target.hasPointerCapture(pointerId)) {
          target.releasePointerCapture(pointerId)
        }
        // A release counts where the pointer was let go, not where the last
        // frame happened to draw it.
        if (cancelled) frame.cancel()
        else frame.flush()
        gesture.onEnd(cancelled)
      }
      const handleUp = (e: PointerEvent) => {
        if (e.pointerId !== pointerId) return
        frame.schedule(pointOf(e))
        finish(false)
      }
      const handleCancel = (e: PointerEvent) => {
        if (e.pointerId === pointerId) finish(true)
      }

      target.addEventListener('pointermove', handleMove)
      target.addEventListener('pointerup', handleUp)
      target.addEventListener('pointercancel', handleCancel)
      target.addEventListener('lostpointercapture', handleCancel)
      cancelRef.current = () => finish(true)
      try {
        target.setPointerCapture(pointerId)
      } catch {
        /* No such active pointer (a scripted event). The gesture still
           tracks it for as long as it stays over the target. */
      }
    },
    []
  )

  useEffect(() => cancel, [cancel])

  return { start, cancel }
}
