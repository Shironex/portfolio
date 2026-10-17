'use client'

import type { PointerEvent } from 'react'

import { Link } from 'lucide-react'

import { cn } from '@/lib/utils'

import { COPY_LINK_LABEL } from './constants'

interface WindowControlsProps {
  onCopyLink: () => void
  onMinimize: () => void
  onMaximize: () => void
  onClose: () => void
}

/** Box of a control button; each adds its own hover colours. */
const CONTROL_CLASS =
  'focus-ring text-ink-2 flex h-16 w-20 items-center justify-center text-xs transition-colors pointer-coarse:h-(--target) pointer-coarse:w-24'

/**
 * Windows 11 style title-bar controls (copy link, minimize, maximize, close).
 * Each button stops pointerdown propagation so the window drag handler
 * does not begin when a control is pressed. The title bar counts its double
 * taps from that same handler, so two presses on a button never toggle
 * maximize.
 */
export function WindowControls({
  onCopyLink,
  onMinimize,
  onMaximize,
  onClose,
}: WindowControlsProps) {
  const stopPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation()
  }

  return (
    <div className="flex items-center">
      <button
        type="button"
        aria-label={COPY_LINK_LABEL}
        onPointerDown={stopPointerDown}
        onClick={onCopyLink}
        className={cn(CONTROL_CLASS, 'hover:bg-rule hover:text-ink')}
      >
        <Link aria-hidden size={13} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-label="Minimize window"
        aria-keyshortcuts="Control+M"
        onPointerDown={stopPointerDown}
        onClick={onMinimize}
        className={cn(CONTROL_CLASS, 'hover:bg-rule hover:text-ink')}
      >
        <span aria-hidden>⎯</span>
      </button>
      <button
        type="button"
        aria-label="Toggle maximize window"
        aria-keyshortcuts="Control+Shift+M"
        onPointerDown={stopPointerDown}
        onClick={onMaximize}
        className={cn(CONTROL_CLASS, 'hover:bg-rule hover:text-ink')}
      >
        <span aria-hidden>▢</span>
      </button>
      <button
        type="button"
        aria-label="Close window"
        aria-keyshortcuts="Control+W"
        onPointerDown={stopPointerDown}
        onClick={onClose}
        // The danger button fill and its cream glyph (8.09:1 in both Lamp
        // modes); Phase 2 draws the pixel control.
        className={cn(
          CONTROL_CLASS,
          'hover:bg-danger-fill hover:text-danger-fill-ink'
        )}
      >
        <span aria-hidden>✕</span>
      </button>
    </div>
  )
}
