'use client'

import type { PointerEvent } from 'react'

import { Link } from 'lucide-react'

import { COPY_LINK_LABEL } from './constants'

interface WindowControlsProps {
  onCopyLink: () => void
  onMinimize: () => void
  onMaximize: () => void
  onClose: () => void
}

/** Box of a control button; each adds its own hover colours. */
const CONTROL_CLASS =
  'focus-ring text-ink-2 flex h-8 w-10 items-center justify-center text-xs transition-colors pointer-coarse:h-11 pointer-coarse:w-12'

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
        className={`${CONTROL_CLASS} hover:bg-rule hover:text-ink`}
      >
        <Link aria-hidden size={13} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-label="Minimize window"
        aria-keyshortcuts="Control+M"
        onPointerDown={stopPointerDown}
        onClick={onMinimize}
        className={`${CONTROL_CLASS} hover:bg-rule hover:text-ink`}
      >
        <span aria-hidden>⎯</span>
      </button>
      <button
        type="button"
        aria-label="Toggle maximize window"
        aria-keyshortcuts="Control+Shift+M"
        onPointerDown={stopPointerDown}
        onClick={onMaximize}
        className={`${CONTROL_CLASS} hover:bg-rule hover:text-ink`}
      >
        <span aria-hidden>▢</span>
      </button>
      <button
        type="button"
        aria-label="Close window"
        aria-keyshortcuts="Control+W"
        onPointerDown={stopPointerDown}
        onClick={onClose}
        className={`${CONTROL_CLASS} hover:bg-danger hover:text-cloud`}
      >
        <span aria-hidden>✕</span>
      </button>
    </div>
  )
}
