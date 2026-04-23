'use client'

import type { MouseEvent } from 'react'

interface WindowControlsProps {
  onMinimize: () => void
  onMaximize: () => void
  onClose: () => void
}

/**
 * Windows 11 style title-bar controls (minimize, maximize, close).
 * Each button stops mousedown propagation so the window drag handler
 * does not begin when a control is pressed.
 */
export function WindowControls({
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
        aria-label="Minimize"
        onMouseDown={stopMouseDown}
        onClick={onMinimize}
        className="flex h-6 w-8 items-center justify-center text-xs text-ink-2 transition-colors hover:bg-rule hover:text-ink"
      >
        <span aria-hidden>⎯</span>
      </button>
      <button
        type="button"
        aria-label="Maximize"
        onMouseDown={stopMouseDown}
        onClick={onMaximize}
        className="flex h-6 w-8 items-center justify-center text-xs text-ink-2 transition-colors hover:bg-rule hover:text-ink"
      >
        <span aria-hidden>▢</span>
      </button>
      <button
        type="button"
        aria-label="Close"
        onMouseDown={stopMouseDown}
        onClick={onClose}
        className="flex h-6 w-8 items-center justify-center text-xs text-ink-2 transition-colors hover:bg-danger hover:text-cloud"
      >
        <span aria-hidden>✕</span>
      </button>
    </div>
  )
}
