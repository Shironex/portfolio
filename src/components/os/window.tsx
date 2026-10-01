'use client'

import type { KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'

import { WindowControls } from '@/components/os/window-controls'

import {
  WINDOW_ID_ATTRIBUTE,
  WINDOW_TITLE_BAR_ATTRIBUTE,
  measureDesktopArea,
} from '@/lib/os/dom'
import {
  type Point,
  type Rect,
  type SnapZone,
  UNDOCK_DRAG_THRESHOLD,
  dockZoneOf,
  rectOf,
  snapBounds,
  snapZoneAt,
  undockRect,
} from '@/lib/os/geometry'

import { usePointerDrag } from '@/hooks/use-pointer-drag'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

import { useAnnounce } from './announcer'
import { windowIconFor, windowNameFor } from './constants'
import type { WindowId, WindowState } from './types'

interface WindowProps {
  window: WindowState
  isFocused: boolean
  onClose: (id: WindowId) => void
  onFocus: (id: WindowId) => void
  onMove: (id: WindowId, x: number, y: number) => void
  onMinimize: (id: WindowId) => void
  onMaximize: (id: WindowId) => void
  onSnap: (id: WindowId, zone: SnapZone, restoreTo?: Rect) => void
  onRestore: (id: WindowId, rect?: Rect) => void
  onResize: (id: WindowId, patch: Partial<Rect>) => void
  onCopyLink: (id: WindowId) => void
  children: ReactNode
}

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const KEYBOARD_MOVE_STEP = 20
const KEYBOARD_RESIZE_STEP = 24
/** Duration of the close/minimize exit animation (matches animate-win-close). */
const EXIT_ANIMATION_MS = 140

const ARROW_SNAP_ZONES: Partial<Record<string, SnapZone>> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'top',
}

const SNAP_ANNOUNCEMENT: Record<SnapZone, string> = {
  left: 'snapped left',
  right: 'snapped right',
  top: 'maximized',
}
const RESTORE_ANNOUNCEMENT = 'restored'

const SHORTCUT_HINT =
  'Arrow keys move, Shift+Arrow resizes, Ctrl+Alt+Left or Right snaps to that half, Ctrl+Alt+Up maximizes, Ctrl+Alt+Down restores, Ctrl+W closes, Ctrl+M minimizes, Ctrl+Shift+M toggles maximize.'

/** The one place a gesture reads its input event; everything after is points. */
function pointOf(event: globalThis.MouseEvent): Point {
  return { x: event.clientX, y: event.clientY }
}

/**
 * Draggable OS window with keyboard parity.
 * - Mouse: drag via title bar, resize via 8 edge/corner handles, control buttons.
 *   Dragging the pointer to the left or right edge of the desktop snaps the
 *   window to that half, the top edge maximizes it, and dragging a snapped or
 *   maximized window away gives it its old size back. Double-clicking the
 *   title bar toggles maximize.
 * - Keyboard: title bar is a focusable toolbar. Arrow keys nudge the window,
 *   Shift+Arrow resizes from the bottom-right, Ctrl+Alt+Left/Right snaps to a
 *   half, Ctrl+Alt+Up maximizes, Ctrl+Alt+Down restores, Ctrl+W closes,
 *   Ctrl+M minimizes, Ctrl+Shift+M toggles maximize.
 * - Renders `null` when minimized; the taskbar surfaces minimized windows.
 * - Its z-index is its rank in the windows layer of `OsShell`, never a page
 *   level value. `useWindowFocus` moves keyboard focus to the title bar when
 *   the user opens the window.
 */
export function Window({
  window: win,
  isFocused,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onMaximize,
  onSnap,
  onRestore,
  onResize,
  onCopyLink,
  children,
}: WindowProps) {
  const shortcutHintId = useId()
  const say = useAnnounce()
  const rootRef = useRef<HTMLDivElement | null>(null)
  // Per-gesture handlers set at mousedown; the shared pointer-drag hook
  // dispatches every move through `onGestureMove` and clears both on release.
  const onGestureMove = useRef<((point: Point) => void) | null>(null)
  const onGestureEnd = useRef<(() => void) | null>(null)
  // Zone the dragged window would snap to if released now; drives the preview.
  const [snapZone, setSnapZone] = useState<SnapZone | null>(null)
  const reducedMotion = useReducedMotion()
  // Close/minimize play a short exit animation before the state change lands.
  const [leaving, setLeaving] = useState(false)

  const startPointer = usePointerDrag({
    onMove: useCallback((event: globalThis.MouseEvent) => {
      onGestureMove.current?.(pointOf(event))
    }, []),
    onEnd: useCallback(() => {
      onGestureEnd.current?.()
      onGestureMove.current = null
      onGestureEnd.current = null
    }, []),
  })

  // The component stays mounted while minimized (it renders null), so the
  // leaving flag must clear on restore or the exit animation would replay.
  useEffect(() => {
    if (!win.minimized) setLeaving(false)
  }, [win.minimized])

  if (win.minimized) return null

  const exitThen = (commit: () => void) => {
    if (reducedMotion || leaving) {
      commit()
      return
    }
    setLeaving(true)
    globalThis.setTimeout(commit, EXIT_ANIMATION_MS)
  }
  const requestClose = () => exitThen(() => onClose(win.id))
  const requestMinimize = () => exitThen(() => onMinimize(win.id))

  const startDrag = (e: MouseEvent<HTMLDivElement>) => {
    onFocus(win.id)
    const el = rootRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const start = pointOf(e.nativeEvent)
    let dx = start.x - rect.left
    const dy = start.y - rect.top
    const current = rectOf(win)
    // Rect the window goes back to if this drag ends in a snap zone.
    const home = win.prevGeometry ?? current
    const area = measureDesktopArea()
    let docked = dockZoneOf(win) !== null
    let zone: SnapZone | null = null

    onGestureMove.current = (point) => {
      if (docked) {
        // A click or a shaky double-click must not pull the window loose.
        const travel = Math.hypot(point.x - start.x, point.y - start.y)
        if (travel < UNDOCK_DRAG_THRESHOLD) return
        const loose = undockRect(home, current, point)
        dx = point.x - loose.x
        docked = false
        onRestore(win.id, loose)
      }
      onMove(win.id, point.x - dx, point.y - dy)
      zone = snapZoneAt(point, area)
      setSnapZone(zone)
    }
    onGestureEnd.current = () => {
      if (!zone) return
      setSnapZone(null)
      onSnap(win.id, zone, home)
    }
    startPointer()
  }

  const handleTitleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest('button')) return
    onMaximize(win.id)
  }

  const startResize = (dir: ResizeDir) => (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    onFocus(win.id)

    const start = {
      x: win.x,
      y: win.y,
      w: win.w,
      h: win.h,
      mouseX: e.clientX,
      mouseY: e.clientY,
    }

    onGestureMove.current = (point) => {
      const dx = point.x - start.mouseX
      const dy = point.y - start.mouseY
      const patch: Partial<Rect> = {}
      if (dir.includes('e')) patch.w = start.w + dx
      if (dir.includes('s')) patch.h = start.h + dy
      if (dir.includes('w')) {
        patch.x = start.x + dx
        patch.w = start.w - dx
      }
      if (dir.includes('n')) {
        patch.y = start.y + dy
        patch.h = start.h - dy
      }
      onResize(win.id, patch)
    }
    startPointer()
  }

  // Keyboard snaps have no pointer feedback, so they are said out loud.
  const announce = (change: string) => say(`${windowNameFor(win)} ${change}`)

  const handleTitleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const ctrlish = event.ctrlKey || event.metaKey
    const dockedOn = dockZoneOf(win)
    if (ctrlish && event.key.toLowerCase() === 'w') {
      event.preventDefault()
      requestClose()
      return
    }
    if (ctrlish && event.key.toLowerCase() === 'm') {
      event.preventDefault()
      if (event.shiftKey) {
        onMaximize(win.id)
        announce(
          win.maximized && win.prevGeometry
            ? RESTORE_ANNOUNCEMENT
            : SNAP_ANNOUNCEMENT.top
        )
      } else requestMinimize()
      return
    }
    if (
      event.key !== 'ArrowUp' &&
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowRight'
    ) {
      return
    }
    event.preventDefault()
    if (event.ctrlKey && event.altKey) {
      const zone = ARROW_SNAP_ZONES[event.key]
      if (zone) {
        onSnap(win.id, zone)
        announce(SNAP_ANNOUNCEMENT[zone])
      } else if (dockedOn !== null) {
        onRestore(win.id)
        announce(RESTORE_ANNOUNCEMENT)
      }
      return
    }
    onFocus(win.id)
    const step = event.shiftKey ? KEYBOARD_RESIZE_STEP : KEYBOARD_MOVE_STEP
    if (event.shiftKey) {
      const patch: Partial<Rect> = {}
      if (event.key === 'ArrowRight') patch.w = win.w + step
      if (event.key === 'ArrowLeft') patch.w = Math.max(1, win.w - step)
      if (event.key === 'ArrowDown') patch.h = win.h + step
      if (event.key === 'ArrowUp') patch.h = Math.max(1, win.h - step)
      onResize(win.id, patch)
      return
    }
    let nx = win.x
    let ny = win.y
    if (event.key === 'ArrowRight') nx += step
    if (event.key === 'ArrowLeft') nx -= step
    if (event.key === 'ArrowDown') ny += step
    if (event.key === 'ArrowUp') ny -= step
    // A docked window comes loose first, the way a drag pulls it loose: its
    // old size, with the corner it is being moved by left in place.
    if (dockedOn !== null) {
      const current = rectOf(win)
      onRestore(win.id, undockRect(win.prevGeometry ?? current, current, win))
    }
    onMove(win.id, nx, ny)
  }

  const showHandles = !win.maximized
  const TitleIcon = windowIconFor(win.id)

  const preview = snapZone
    ? snapBounds(snapZone, measureDesktopArea(), win.minW)
    : null

  return (
    <>
      {preview && (
        // Same z as the window and earlier in the DOM: under the dragged
        // window, over every other one.
        <div
          aria-hidden
          data-snap-preview={snapZone}
          style={{
            left: preview.x,
            top: preview.y,
            width: preview.w,
            height: preview.h,
            zIndex: win.z,
          }}
          className="border-miku/50 bg-miku/15 pointer-events-none absolute animate-[fadeIn_0.15s_ease] rounded-xl border motion-reduce:animate-none"
        />
      )}
      <div
        ref={rootRef}
        role="dialog"
        aria-label={win.title}
        aria-modal={false}
        {...{ [WINDOW_ID_ATTRIBUTE]: win.id }}
        onMouseDown={() => onFocus(win.id)}
        style={{
          left: win.x,
          top: win.y,
          width: win.w,
          height: win.h,
          zIndex: win.z,
        }}
        // No `overflow-hidden` here: a rounded clip around the scroller below
        // makes Chrome hit-test and scroll it on the main thread, so the title
        // bar rounds its own corners and the scroller stops short of the bottom
        // radius instead.
        className={[
          'border-rule-2 bg-surf-solid absolute flex flex-col rounded-xl border',
          'transition-shadow duration-200 motion-reduce:animate-none',
          leaving ? 'animate-win-close' : 'animate-win-open',
          // Focused window carries the deeper shadow + accent ring; unfocused
          // windows recede so the stack reads at a glance.
          isFocused ? 'shadow-elev-3 ring-miku/30 ring-1' : 'shadow-elev-2',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div
          role="toolbar"
          tabIndex={0}
          {...{ [WINDOW_TITLE_BAR_ATTRIBUTE]: '' }}
          aria-label={`${win.title} window controls`}
          aria-describedby={shortcutHintId}
          onMouseDown={startDrag}
          onDoubleClick={handleTitleDoubleClick}
          onKeyDown={handleTitleKey}
          className="focus-ring border-rule bg-surf-1 flex h-9 cursor-grab items-center justify-between gap-3 rounded-t-xl border-b px-3 select-none active:cursor-grabbing pointer-coarse:h-11"
        >
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className={isFocused ? 'text-miku-2' : 'text-ink-4'}
            >
              <TitleIcon size={14} strokeWidth={1.75} />
            </span>
            <h2
              className={`font-mono text-xs font-normal tracking-normal ${isFocused ? 'text-ink-2' : 'text-ink-4'}`}
            >
              {win.title}
            </h2>
          </div>
          <WindowControls
            onCopyLink={() => onCopyLink(win.id)}
            onMinimize={requestMinimize}
            onMaximize={() => onMaximize(win.id)}
            onClose={requestClose}
          />
          {/* `hidden` keeps it out of the reading order; it still describes
              the toolbar. */}
          <span id={shortcutHintId} hidden>
            {SHORTCUT_HINT}
          </span>
        </div>
        {/* Opaque and square so Chrome composites it (threaded scrolling keeps
          LCD text only on an opaque scroller at DPR 1); `mb-3` keeps its
          corners inside the window's rounded bottom edge. */}
        <div className="font-body text-ink bg-surf-solid mb-3 flex-1 overflow-auto px-6 pt-6 pb-3">
          {children}
        </div>

        {showHandles && (
          <>
            <div
              aria-hidden
              onMouseDown={startResize('n')}
              className="hover:bg-miku/20 absolute top-0 right-2 left-2 z-10 h-1 cursor-n-resize"
            />
            <div
              aria-hidden
              onMouseDown={startResize('s')}
              className="hover:bg-miku/20 absolute right-2 bottom-0 left-2 z-10 h-1 cursor-s-resize"
            />
            <div
              aria-hidden
              onMouseDown={startResize('e')}
              className="hover:bg-miku/20 absolute top-2 right-0 bottom-2 z-10 w-1 cursor-e-resize"
            />
            <div
              aria-hidden
              onMouseDown={startResize('w')}
              className="hover:bg-miku/20 absolute top-2 bottom-2 left-0 z-10 w-1 cursor-w-resize"
            />
            <div
              aria-hidden
              onMouseDown={startResize('ne')}
              className="hover:bg-miku/20 absolute top-0 right-0 z-10 size-3 cursor-ne-resize rounded-tr-xl"
            />
            <div
              aria-hidden
              onMouseDown={startResize('nw')}
              className="hover:bg-miku/20 absolute top-0 left-0 z-10 size-3 cursor-nw-resize rounded-tl-xl"
            />
            <div
              aria-hidden
              onMouseDown={startResize('se')}
              className="hover:bg-miku/20 absolute right-0 bottom-0 z-10 size-3 cursor-se-resize rounded-br-xl"
            />
            <div
              aria-hidden
              onMouseDown={startResize('sw')}
              className="hover:bg-miku/20 absolute bottom-0 left-0 z-10 size-3 cursor-sw-resize rounded-bl-xl"
            />
          </>
        )}
      </div>
    </>
  )
}
