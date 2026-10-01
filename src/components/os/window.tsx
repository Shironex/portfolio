'use client'

import type { AnimationEvent, KeyboardEvent, PointerEvent } from 'react'
import { memo, useId, useLayoutEffect, useRef, useState } from 'react'

import { WindowControls } from '@/components/os/window-controls'

import {
  WINDOW_ID_ATTRIBUTE,
  WINDOW_TITLE_BAR_ATTRIBUTE,
  focusedElement,
  measureDesktopArea,
} from '@/lib/os/dom'
import { type Rect, type SnapZone, snapBounds } from '@/lib/os/geometry'
import { windowKeyAction } from '@/lib/os/window-keys'

import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { type ResizeDir, useWindowDrag } from '@/hooks/use-window-drag'
import type { Project } from '@/types'

import { useAnnounce } from './announcer'
import { AppBody } from './app-registry'
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
  onOpenProject: (project: Project) => void
}

/** Keyframes of `animate-win-close` in globals.css. */
const EXIT_ANIMATION_NAME = 'winClose'

const SNAP_ANNOUNCEMENT: Record<SnapZone, string> = {
  left: 'snapped left',
  right: 'snapped right',
  top: 'maximized',
}
const RESTORE_ANNOUNCEMENT = 'restored'

const SHORTCUT_HINT =
  'Arrow keys move, Shift+Arrow resizes, Ctrl+Alt+Left or Right snaps to that half, Ctrl+Alt+Up maximizes, Ctrl+Alt+Down restores, Ctrl+W closes, Ctrl+M minimizes, Ctrl+Shift+M toggles maximize.'

/**
 * Edge and corner resize handles. A fine pointer gets a 4px edge and a 12px
 * corner inside the window. A coarse one gets a 16px strip along each side
 * and a 24px square off each corner, all outside the window box (the offsets
 * count from inside its 1px border): a handle over the box would take presses
 * meant for the title bar controls, and (handles are `touch-action: none`)
 * scrolling meant for the app body.
 */
const RESIZE_HANDLES: ReadonlyArray<{ dir: ResizeDir; className: string }> = [
  {
    dir: 'n',
    className:
      'top-0 right-2 left-2 h-1 cursor-n-resize pointer-coarse:inset-x-0 pointer-coarse:-top-[17px] pointer-coarse:h-4',
  },
  {
    dir: 's',
    className:
      'right-2 bottom-0 left-2 h-1 cursor-s-resize pointer-coarse:inset-x-0 pointer-coarse:-bottom-[17px] pointer-coarse:h-4',
  },
  {
    dir: 'e',
    className:
      'top-2 right-0 bottom-2 w-1 cursor-e-resize pointer-coarse:inset-y-0 pointer-coarse:-right-[17px] pointer-coarse:w-4',
  },
  {
    dir: 'w',
    className:
      'top-2 bottom-2 left-0 w-1 cursor-w-resize pointer-coarse:inset-y-0 pointer-coarse:-left-[17px] pointer-coarse:w-4',
  },
  {
    dir: 'ne',
    className:
      'top-0 right-0 size-3 cursor-ne-resize rounded-tr-xl pointer-coarse:-top-[25px] pointer-coarse:-right-[25px] pointer-coarse:size-6',
  },
  {
    dir: 'nw',
    className:
      'top-0 left-0 size-3 cursor-nw-resize rounded-tl-xl pointer-coarse:-top-[25px] pointer-coarse:-left-[25px] pointer-coarse:size-6',
  },
  {
    dir: 'se',
    className:
      'right-0 bottom-0 size-3 cursor-se-resize rounded-br-xl pointer-coarse:-right-[25px] pointer-coarse:-bottom-[25px] pointer-coarse:size-6',
  },
  {
    dir: 'sw',
    className:
      'bottom-0 left-0 size-3 cursor-sw-resize rounded-bl-xl pointer-coarse:-bottom-[25px] pointer-coarse:-left-[25px] pointer-coarse:size-6',
  },
]

/**
 * Draggable OS window with keyboard parity.
 * - Pointer (mouse, pen, touch): drag via title bar, resize via 8 edge/corner
 *   handles, control buttons. Dragging to the left or right edge of the
 *   desktop snaps the window to that half, the top edge maximizes it, and
 *   dragging a snapped or maximized window away gives it its old size back.
 *   Two clicks or taps on the title bar toggle maximize. The gestures live in
 *   `useWindowDrag`.
 * - Keyboard: title bar is a focusable toolbar. Arrow keys nudge the window,
 *   Shift+Arrow resizes from the bottom-right, Ctrl+Alt+Left/Right snaps to a
 *   half, Ctrl+Alt+Up maximizes, Ctrl+Alt+Down restores, Ctrl+W closes,
 *   Ctrl+M minimizes, Ctrl+Shift+M toggles maximize (`windowKeyAction`).
 * - Renders `null` when minimized, once its exit animation has played; the
 *   taskbar surfaces minimized windows.
 * - Its z-index is its rank in the windows layer of `OsShell`, never a page
 *   level value. `useWindowFocus` moves keyboard focus to the title bar when
 *   the user opens the window.
 *
 * Memoized, and it renders its own app body: with the stable callbacks
 * `OsShell` hands in, a window re-renders only when its own state changes,
 * and its body only when the window is a different app or project.
 */
function WindowImpl({
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
  onOpenProject,
}: WindowProps) {
  const shortcutHintId = useId()
  const say = useAnnounce()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const reducedMotion = useReducedMotion()
  // Close plays the exit animation first and lands in the stack when it ends.
  const [closing, setClosing] = useState(false)
  // A minimize is in the stack right away, wherever it came from (title bar,
  // taskbar, keyboard); the window stays up until its exit animation ends.
  const [exited, setExited] = useState(win.minimized)
  if (!win.minimized && exited) setExited(false)
  // With reduced motion no animation runs, so there is no end to wait for;
  // and the window counts as gone, so a later change of the preference does
  // not play its exit from nowhere.
  if (win.minimized && reducedMotion && !exited) setExited(true)
  const leaving = closing || win.minimized

  const { snapZone, startDrag, startResize, cancelGesture } = useWindowDrag({
    win,
    rootRef,
    onFocus,
    onMove,
    onResize,
    onSnap,
    onRestore,
    onMaximize,
  })

  // A window on its way out gives focus up before `useWindowFocus` looks for
  // it, so focus moves on with the stack instead of going down with the DOM.
  // A gesture still in flight ends here too: its title bar or handle is about
  // to leave the DOM, and the exit animation needs the window's transform.
  useLayoutEffect(() => {
    if (!leaving) return
    cancelGesture()
    const active = focusedElement()
    if (active && rootRef.current?.contains(active)) active.blur()
  }, [leaving, cancelGesture])

  if (win.minimized && exited) return null

  const requestClose = () => {
    if (reducedMotion) onClose(win.id)
    else setClosing(true)
  }
  const requestMinimize = () => onMinimize(win.id)

  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    // Animations inside the window bubble up to here too.
    if (event.target !== event.currentTarget) return
    if (event.animationName !== EXIT_ANIMATION_NAME) return
    if (closing) onClose(win.id)
    else if (win.minimized) setExited(true)
  }

  // Keyboard snaps have no pointer feedback, so they are said out loud.
  const announce = (change: string) => say(`${windowNameFor(win)} ${change}`)

  const handleTitleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const action = windowKeyAction(event, win)
    if (!action) return
    event.preventDefault()
    switch (action.type) {
      case 'close':
        requestClose()
        return
      case 'minimize':
        requestMinimize()
        return
      case 'toggle-maximize':
        onMaximize(win.id)
        announce(
          win.maximized && win.prevGeometry
            ? RESTORE_ANNOUNCEMENT
            : SNAP_ANNOUNCEMENT.top
        )
        return
      case 'snap':
        onSnap(win.id, action.zone)
        announce(SNAP_ANNOUNCEMENT[action.zone])
        return
      case 'restore':
        onRestore(win.id)
        announce(RESTORE_ANNOUNCEMENT)
        return
      case 'resize':
        onFocus(win.id)
        onResize(win.id, action.patch)
        return
      case 'move':
        onFocus(win.id)
        if (action.undockTo) onRestore(win.id, action.undockTo)
        onMove(win.id, action.x, action.y)
        return
      case 'none':
        return
    }
  }

  // Mouse only: keeps a press on a handle from moving focus or selecting.
  const preventDefault = (event: { preventDefault: () => void }) =>
    event.preventDefault()
  const focusWindow = (event: PointerEvent<HTMLDivElement>) => {
    if (event.isPrimary) onFocus(win.id)
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
          className="border-miku/50 bg-miku/15 animate-fade-in pointer-events-none absolute rounded-xl border motion-reduce:animate-none"
        />
      )}
      <div
        ref={rootRef}
        role="dialog"
        aria-label={win.title}
        aria-modal={false}
        inert={leaving}
        {...{ [WINDOW_ID_ATTRIBUTE]: win.id }}
        onPointerDown={focusWindow}
        onAnimationEnd={handleAnimationEnd}
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
        // The focused window carries the deeper shadow and the others recede,
        // so the stack reads at a glance (`window-shadow` in globals.css).
        data-focused={isFocused ? '' : undefined}
        className={`border-rule-2 bg-surf-solid window-shadow absolute flex flex-col rounded-xl border motion-reduce:animate-none ${
          leaving ? 'animate-win-close' : 'animate-win-open'
        }`}
      >
        <div
          role="toolbar"
          tabIndex={0}
          {...{ [WINDOW_TITLE_BAR_ATTRIBUTE]: '' }}
          aria-label={`${win.title} window controls`}
          aria-describedby={shortcutHintId}
          onPointerDown={startDrag}
          onKeyDown={handleTitleKey}
          // `touch-none`: a finger on the title bar drags the window, it does
          // not scroll or zoom the page.
          className="focus-ring border-rule bg-surf-1 flex h-9 cursor-grab touch-none items-center justify-between gap-3 rounded-t-xl border-b px-3 select-none active:cursor-grabbing pointer-coarse:h-11"
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
          corners inside the window's rounded bottom edge. Contained: layout
          and paint inside an app never reach past the scroller, which clips
          at the same box anyway (the lightbox and toasts are portals). */}
        <div className="font-body text-ink bg-surf-solid mb-3 flex-1 overflow-auto px-6 pt-6 pb-3 contain-layout contain-paint contain-style">
          <AppBody
            id={win.id}
            project={win.project}
            onOpenProject={onOpenProject}
          />
        </div>

        {showHandles &&
          RESIZE_HANDLES.map(({ dir, className }) => (
            <div
              key={dir}
              aria-hidden
              data-resize-handle={dir}
              onPointerDown={startResize(dir)}
              onMouseDown={preventDefault}
              // The tint is for a pointer that hovers; under a finger it
              // would stick after the touch.
              className={`pointer-fine:hover:bg-miku/20 absolute z-10 touch-none ${className}`}
            />
          ))}
      </div>
    </>
  )
}

export const Window = memo(WindowImpl)
