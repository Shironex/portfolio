'use client'

import type { KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { useEffect, useRef } from 'react'

import { WindowControls } from '@/components/os/window-controls'

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
  const dragRef = useRef<{ dx: number; dy: number } | null>(null)

  useEffect(() => {
    return () => {
      dragRef.current = null
    }
  }, [])

  if (win.minimized) return null

  const startDrag = (e: MouseEvent<HTMLDivElement>) => {
    onFocus(win.id)
    const el = rootRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    dragRef.current = {
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
    }

    const handleMove = (event: globalThis.MouseEvent) => {
      const drag = dragRef.current
      if (!drag) return
      onMove(win.id, event.clientX - drag.dx, event.clientY - drag.dy)
    }

    const handleUp = () => {
      dragRef.current = null
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
  }

  const startResize =
    (dir: ResizeDir) => (e: MouseEvent<HTMLDivElement>) => {
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

      const handleMove = (event: globalThis.MouseEvent) => {
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

      const handleUp = () => {
        window.removeEventListener('mousemove', handleMove)
        window.removeEventListener('mouseup', handleUp)
      }

      window.addEventListener('mousemove', handleMove)
      window.addEventListener('mouseup', handleUp)
    }

  const handleTitleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const ctrlish = event.ctrlKey || event.metaKey
    if (ctrlish && event.key.toLowerCase() === 'w') {
      event.preventDefault()
      onClose(win.id)
      return
    }
    if (ctrlish && event.key.toLowerCase() === 'm') {
      event.preventDefault()
      if (event.shiftKey) onMaximize(win.id)
      else onMinimize(win.id)
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
        'absolute flex flex-col overflow-hidden rounded-xl border border-rule-2 bg-surf-2 backdrop-blur-xl',
        'shadow-elev-3 animate-win-open motion-reduce:animate-none',
        isFocused ? 'ring-1 ring-miku/30' : '',
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
        className="focus-ring flex h-9 pointer-coarse:h-11 cursor-grab items-center justify-between gap-3 border-b border-rule bg-surf-1 px-3 select-none active:cursor-grabbing"
      >
        <div className="flex items-center gap-2">
          <span aria-hidden className="text-sm text-miku-2">
            {win.icon}
          </span>
          <span className="font-mono text-xs text-ink-2">{win.title}</span>
        </div>
        <WindowControls
          onMinimize={() => onMinimize(win.id)}
          onMaximize={() => onMaximize(win.id)}
          onClose={() => onClose(win.id)}
        />
      </div>
      <div className="flex-1 overflow-auto p-6 font-body text-ink">
        {children}
      </div>

      {showHandles && (
        <>
          <div
            aria-hidden
            onMouseDown={startResize('n')}
            className="absolute top-0 right-2 left-2 z-10 h-1 cursor-n-resize hover:bg-miku/20"
          />
          <div
            aria-hidden
            onMouseDown={startResize('s')}
            className="absolute right-2 bottom-0 left-2 z-10 h-1 cursor-s-resize hover:bg-miku/20"
          />
          <div
            aria-hidden
            onMouseDown={startResize('e')}
            className="absolute top-2 right-0 bottom-2 z-10 w-1 cursor-e-resize hover:bg-miku/20"
          />
          <div
            aria-hidden
            onMouseDown={startResize('w')}
            className="absolute top-2 bottom-2 left-0 z-10 w-1 cursor-w-resize hover:bg-miku/20"
          />
          <div
            aria-hidden
            onMouseDown={startResize('ne')}
            className="absolute top-0 right-0 z-10 size-3 cursor-ne-resize hover:bg-miku/20"
          />
          <div
            aria-hidden
            onMouseDown={startResize('nw')}
            className="absolute top-0 left-0 z-10 size-3 cursor-nw-resize hover:bg-miku/20"
          />
          <div
            aria-hidden
            onMouseDown={startResize('se')}
            className="absolute right-0 bottom-0 z-10 size-3 cursor-se-resize hover:bg-miku/20"
          />
          <div
            aria-hidden
            onMouseDown={startResize('sw')}
            className="absolute bottom-0 left-0 z-10 size-3 cursor-sw-resize hover:bg-miku/20"
          />
        </>
      )}
    </div>
  )
}
