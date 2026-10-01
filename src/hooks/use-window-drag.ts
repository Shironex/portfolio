'use client'

import type { PointerEvent, RefObject } from 'react'
import { useLayoutEffect, useRef, useState } from 'react'

import { flushSync } from 'react-dom'

import type { WindowId, WindowState } from '@/components/os/types'

import { markGesture, measureDesktopArea } from '@/lib/os/dom'
import {
  DRAG_SLOP,
  type Point,
  type Rect,
  type SnapZone,
  clampWindowRect,
  clampWindowToViewport,
  distance,
  dockZoneOf,
  rectOf,
  sameRect,
  snapZoneAt,
  undockRect,
  viewportSize,
} from '@/lib/os/geometry'

import { isPrimaryPress, pointOf, usePointerDrag } from './use-pointer-drag'

export type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

/** Longest gap between two taps, and how far apart they may land. */
const DOUBLE_TAP_MS = 500
const DOUBLE_TAP_SLOP = 30

interface WindowDragOptions {
  win: WindowState
  /** The window element: the gesture writes its geometry straight to it. */
  rootRef: RefObject<HTMLDivElement | null>
  onFocus: (id: WindowId) => void
  onMove: (id: WindowId, x: number, y: number) => void
  onResize: (id: WindowId, patch: Partial<Rect>) => void
  onSnap: (id: WindowId, zone: SnapZone, restoreTo?: Rect) => void
  onRestore: (id: WindowId, rect?: Rect) => void
  onMaximize: (id: WindowId) => void
}

/** Write `rect` to the element, or only what differs from the `shown` rect. */
function writeRect(el: HTMLElement, rect: Rect, shown?: Rect) {
  if (rect.x !== shown?.x) el.style.left = `${rect.x}px`
  if (rect.y !== shown?.y) el.style.top = `${rect.y}px`
  if (rect.w !== shown?.w) el.style.width = `${rect.w}px`
  if (rect.h !== shown?.h) el.style.height = `${rect.h}px`
}

/**
 * Pointer gestures of a window: dragging by the title bar and resizing by the
 * edge and corner handles, for mouse, pen and touch.
 *
 * A gesture never goes through React while it runs. A drag moves the window
 * with a `transform` written once per animation frame, a resize writes the
 * part of the rect its handle changes, and the result is committed to window
 * state once, on release. So a gesture re-renders nothing, the session is
 * written once when it settles, and a cancelled gesture leaves the window
 * where it was. Before that commit the element is put back to the rect React
 * last rendered, so React patches a DOM it knows.
 *
 * A gesture measures the window when it starts. When the window's rect or
 * dock state changes under it (an arrow key, a viewport resize that re-docks
 * it) the gesture is cancelled, and so is one whose window is on its way out:
 * call `cancelGesture` for that.
 *
 * A press that travels less than `DRAG_SLOP` is a tap: it moves, snaps and
 * undocks nothing. Dragging to the left or right edge of the desktop snaps
 * the window to that half and the top edge maximizes it (`snapZone` drives
 * the preview); dragging a snapped or maximized window away gives it its old
 * size back under the pointer. Two taps on the title bar toggle maximize,
 * whatever the pointer: `dblclick` is not dependable on touch.
 *
 * While a gesture moves the window the document is marked (`markGesture`),
 * which holds the decorative loops still.
 */
export function useWindowDrag({
  win,
  rootRef,
  onFocus,
  onMove,
  onResize,
  onSnap,
  onRestore,
  onMaximize,
}: WindowDragOptions) {
  const { start: startPointer, cancel: cancelGesture } = usePointerDrag()
  // Zone the dragged window would snap to if released now; drives the preview.
  const [snapZone, setSnapZone] = useState<SnapZone | null>(null)
  const lastTap = useRef<{ at: number; point: Point } | null>(null)
  // The rect React last rendered: what a gesture puts the element back to.
  const rendered = useRef<Rect>(rectOf(win))

  const { x, y, w, h, maximized, snapped } = win
  useLayoutEffect(() => {
    rendered.current = { x, y, w, h }
    // A gesture in flight measured the window as it was. Its own commit lands
    // after it has ended, so this only ever stops a gesture the window
    // changed under.
    cancelGesture()
  }, [x, y, w, h, maximized, snapped, cancelGesture])

  /** Whether this tap is the second of a pair; remembers it when it is not. */
  const isDoubleTap = (point: Point): boolean => {
    const previous = lastTap.current
    const now = performance.now()
    const second =
      previous !== null &&
      now - previous.at < DOUBLE_TAP_MS &&
      distance(previous.point, point) < DOUBLE_TAP_SLOP
    lastTap.current = second ? null : { at: now, point }
    return second
  }

  const startDrag = (e: PointerEvent<HTMLDivElement>) => {
    const el = rootRef.current
    if (!el || !isPrimaryPress(e)) return
    const start = pointOf(e)
    const current = rectOf(win)
    // Rect the window goes back to if this drag ends in a snap zone.
    const home = win.prevGeometry ?? current
    const area = measureDesktopArea()
    const viewport = viewportSize()
    let dx = start.x - current.x
    const dy = start.y - current.y
    let docked = dockZoneOf(win) !== null
    // Rect the element shows under the transform: `current`, or the one a
    // docked window was pulled loose to.
    let base = current
    let loose: Rect | null = null
    let position: Point | null = null
    let zone: SnapZone | null = null
    let dragging = false

    startPointer(e, e.currentTarget, {
      onFrame: (point) => {
        if (!dragging) {
          // A click or a shaky double tap is not a drag: it must not move
          // the window, pull it loose or drop it on a snap zone.
          if (distance(point, start) < DRAG_SLOP) return
          dragging = true
          el.style.willChange = 'transform'
          markGesture(true)
        }
        if (docked) {
          loose = undockRect(home, current, point)
          dx = point.x - loose.x
          docked = false
          base = loose
          writeRect(el, loose)
        }
        position = clampWindowToViewport(point.x - dx, point.y - dy, viewport)
        el.style.transform = `translate3d(${position.x - base.x}px, ${position.y - base.y}px, 0)`
        const next = snapZoneAt(point, area)
        if (next === zone) return
        zone = next
        setSnapZone(next)
      },
      onEnd: (cancelled) => {
        if (dragging) {
          el.style.willChange = ''
          el.style.transform = ''
          markGesture(false)
        }
        if (loose) writeRect(el, rendered.current)
        const to = position
        const commit = () => {
          setSnapZone(null)
          if (cancelled || !to) return
          if (zone) {
            onSnap(win.id, zone, home)
            return
          }
          if (loose) onRestore(win.id, loose)
          // A drag that ended where it began leaves the stack as it is.
          if (loose || to.x !== current.x || to.y !== current.y) {
            onMove(win.id, to.x, to.y)
          }
        }
        if (cancelled) {
          commit()
          return
        }
        // Synchronous, so the frame that drops the transform already has the
        // committed rect under it.
        flushSync(commit)
        if (!dragging && isDoubleTap(start)) onMaximize(win.id)
      },
    })
  }

  const startResize = (dir: ResizeDir) => (e: PointerEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const el = rootRef.current
    if (!el || !isPrimaryPress(e)) return
    onFocus(win.id)
    const start = pointOf(e)
    const current = rectOf(win)
    const viewport = viewportSize()
    let patch: Partial<Rect> | null = null
    // Rect the element shows now: only what a frame changes is written.
    let shown = current

    startPointer(e, e.currentTarget, {
      onFrame: (point) => {
        if (!patch) markGesture(true)
        const dx = point.x - start.x
        const dy = point.y - start.y
        patch = {}
        if (dir.includes('e')) patch.w = current.w + dx
        if (dir.includes('s')) patch.h = current.h + dy
        if (dir.includes('w')) {
          patch.x = current.x + dx
          patch.w = current.w - dx
        }
        if (dir.includes('n')) {
          patch.y = current.y + dy
          patch.h = current.h - dy
        }
        // The same clamp the commit applies, so release changes nothing.
        const next = clampWindowRect(win, current, patch, viewport)
        writeRect(el, next, shown)
        shown = next
      },
      onEnd: (cancelled) => {
        const to = patch
        // A press on a handle that went nowhere is not a resize: it must not
        // undock a snapped window.
        if (!to) return
        markGesture(false)
        writeRect(el, rendered.current, shown)
        if (cancelled) return
        if (sameRect(clampWindowRect(win, current, to, viewport), current)) {
          return
        }
        flushSync(() => onResize(win.id, to))
      },
    })
  }

  return { snapZone, startDrag, startResize, cancelGesture }
}
