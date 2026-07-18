'use client'

import type { KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { WindowControls } from '@/components/os/window-controls'

import { usePointerDrag } from '@/hooks/use-pointer-drag'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

import { windowIconFor } from './constants'
import type { WindowId, WindowState } from './types'

interface WindowProps {
  window: WindowState
  isFocused: boolean
  onClose: (id: WindowId) => void
  onFocus: (id: WindowId) => void
  onMove: (id: WindowId, x: number, y: number) => void
  onMinimize: (id: WindowId) => void
  onMaximize: (id: WindowId) => void
  onResize: (
    id: WindowId,
    patch: Partial<{ x: number; y: number; w: number; h: number }>
  ) => void
  children: ReactNode
}

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const KEYBOARD_MOVE_STEP = 20
const KEYBOARD_RESIZE_STEP = 24
/** Duration of the close/minimize exit animation (matches animate-win-close). */
const EXIT_ANIMATION_MS = 140

/**
 * Draggable OS window with keyboard parity.
 * - Mouse: drag via title bar, resize via 8 edge/corner handles, control buttons.
 * - Keyboard: title bar is a focusable toolbar. Arrow keys nudge the window,
 *   Shift+Arrow resizes from the bottom-right, Ctrl+W closes, Ctrl+M minimizes,
 *   Ctrl+Shift+M maximizes.
 * - Renders `null` when minimized; the taskbar surfaces minimized windows.
 */
export function Window({
  window: win,
  isFocused,
  onClose,
  onFocus,
  onMove,
  onMinimize,
  onMaximize,
  onResize,
  children,
}: WindowProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  // Per-gesture move handler set at mousedown; the shared pointer-drag hook
  // dispatches every mousemove through it and clears it on mouseup.
  const onGestureMove = useRef<((event: globalThis.MouseEvent) => void) | null>(
    null
  )
  const reducedMotion = useReducedMotion()
  // Close/minimize play a short exit animation before the state change lands.
  const [leaving, setLeaving] = useState(false)

  const startPointer = usePointerDrag({
    onMove: useCallback((event: globalThis.MouseEvent) => {
      onGestureMove.current?.(event)
    }, []),
    onEnd: useCallback(() => {
      onGestureMove.current = null
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
    const dx = e.clientX - rect.left
    const dy = e.clientY - rect.top

    onGestureMove.current = (event) => {
      onMove(win.id, event.clientX - dx, event.clientY - dy)
    }
    startPointer()
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

    onGestureMove.current = (event) => {
      const dx = event.clientX - start.mouseX
      const dy = event.clientY - start.mouseY
      const patch: Partial<{
        x: number
        y: number
        w: number
        h: number
      }> = {}
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

  const handleTitleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const ctrlish = event.ctrlKey || event.metaKey
    if (ctrlish && event.key.toLowerCase() === 'w') {
      event.preventDefault()
      requestClose()
      return
    }
    if (ctrlish && event.key.toLowerCase() === 'm') {
      event.preventDefault()
      if (event.shiftKey) onMaximize(win.id)
      else requestMinimize()
      return
    }
    if (
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight'
    ) {
      event.preventDefault()
      onFocus(win.id)
      const step = event.shiftKey ? KEYBOARD_RESIZE_STEP : KEYBOARD_MOVE_STEP
      if (event.shiftKey) {
        const patch: Partial<{ w: number; h: number }> = {}
        if (event.key === 'ArrowRight') patch.w = win.w + step
        if (event.key === 'ArrowLeft') patch.w = Math.max(1, win.w - step)
        if (event.key === 'ArrowDown') patch.h = win.h + step
        if (event.key === 'ArrowUp') patch.h = Math.max(1, win.h - step)
        onResize(win.id, patch)
      } else {
        let nx = win.x
        let ny = win.y
        if (event.key === 'ArrowRight') nx += step
        if (event.key === 'ArrowLeft') nx -= step
        if (event.key === 'ArrowDown') ny += step
        if (event.key === 'ArrowUp') ny -= step
        onMove(win.id, nx, ny)
      }
    }
  }

  const showHandles = !win.maximized
  const TitleIcon = windowIconFor(win.id)

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label={win.title}
      aria-modal={false}
      onMouseDown={() => onFocus(win.id)}
      style={{
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        zIndex: win.z,
      }}
      className={[
        'border-rule-2 bg-surf-2 absolute flex flex-col overflow-hidden rounded-xl border backdrop-blur-xl',
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
        aria-label={`${win.title} window controls. Arrow keys move, Shift+Arrow resizes, Ctrl+W closes, Ctrl+M minimizes, Ctrl+Shift+M toggles maximize.`}
        onMouseDown={startDrag}
        onKeyDown={handleTitleKey}
        className="focus-ring border-rule bg-surf-1 flex h-9 cursor-grab items-center justify-between gap-3 border-b px-3 select-none active:cursor-grabbing pointer-coarse:h-11"
      >
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className={isFocused ? 'text-miku-2' : 'text-ink-4'}
          >
            <TitleIcon size={14} strokeWidth={1.75} />
          </span>
          <span
            className={`font-mono text-xs ${isFocused ? 'text-ink-2' : 'text-ink-4'}`}
          >
            {win.title}
          </span>
        </div>
        <WindowControls
          onMinimize={requestMinimize}
          onMaximize={() => onMaximize(win.id)}
          onClose={requestClose}
        />
      </div>
      <div className="font-body text-ink flex-1 overflow-auto p-6">
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
            className="hover:bg-miku/20 absolute top-0 right-0 z-10 size-3 cursor-ne-resize"
          />
          <div
            aria-hidden
            onMouseDown={startResize('nw')}
            className="hover:bg-miku/20 absolute top-0 left-0 z-10 size-3 cursor-nw-resize"
          />
          <div
            aria-hidden
            onMouseDown={startResize('se')}
            className="hover:bg-miku/20 absolute right-0 bottom-0 z-10 size-3 cursor-se-resize"
          />
          <div
            aria-hidden
            onMouseDown={startResize('sw')}
            className="hover:bg-miku/20 absolute bottom-0 left-0 z-10 size-3 cursor-sw-resize"
          />
        </>
      )}
    </div>
  )
}
