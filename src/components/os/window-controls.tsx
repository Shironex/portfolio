'use client'

import type { MouseEvent } from 'react'

import { Link } from 'lucide-react'

import { COPY_LINK_LABEL } from './constants'

interface WindowControlsProps {
  onCopyLink: () => void
  onMinimize: () => void
  onMaximize: () => void
  onClose: () => void
}

/**
 * Windows 11 style title-bar controls (copy link, minimize, maximize, close).
 * Each button stops mousedown propagation so the window drag handler
 * does not begin when a control is pressed. The title bar ignores
 * double-clicks that land on a button, so they never toggle maximize.
 */
export function WindowControls({
  onCopyLink,
  onMinimize,
  onMaximize,
  onClose,
}: WindowControlsProps) {
  const stopMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
  }

  return (
    <div className="flex items-center">
      <button
        type="button"
        aria-label={COPY_LINK_LABEL}
        onMouseDown={stopMouseDown}
        onClick={onCopyLink}
        className="focus-ring text-ink-2 hover:bg-rule hover:text-ink flex h-8 w-10 items-center justify-center text-xs transition-colors pointer-coarse:h-11 pointer-coarse:w-12"
      >
        <Link aria-hidden size={13} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-label="Minimize window"
        onMouseDown={stopMouseDown}
        onClick={onMinimize}
        className="focus-ring text-ink-2 hover:bg-rule hover:text-ink flex h-8 w-10 items-center justify-center text-xs transition-colors pointer-coarse:h-11 pointer-coarse:w-12"
      >
        <span aria-hidden>⎯</span>
      </button>
      <button
        type="button"
        aria-label="Toggle maximize window"
        onMouseDown={stopMouseDown}
        onClick={onMaximize}
        className="focus-ring text-ink-2 hover:bg-rule hover:text-ink flex h-8 w-10 items-center justify-center text-xs transition-colors pointer-coarse:h-11 pointer-coarse:w-12"
      >
        <span aria-hidden>▢</span>
      </button>
      <button
        type="button"
        aria-label="Close window"
        onMouseDown={stopMouseDown}
        onClick={onClose}
        className="focus-ring text-ink-2 hover:bg-danger hover:text-cloud flex h-8 w-10 items-center justify-center text-xs transition-colors pointer-coarse:h-11 pointer-coarse:w-12"
      >
        <span aria-hidden>✕</span>
      </button>
    </div>
  )
}
