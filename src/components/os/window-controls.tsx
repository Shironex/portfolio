'use client'

import type { PointerEvent } from 'react'

import {
  PixelIcon,
  type PixelIconName,
} from '@/components/pixel/pixel-icon.generated'

import { WINDOW_CONTROLS_ATTRIBUTE } from '@/lib/os/dom'
import { cn } from '@/lib/utils'

import { COPY_LINK_LABEL } from './constants'

interface WindowControlsProps {
  /** Shows the restore glyph on the maximize toggle. */
  maximized: boolean
  onCopyLink: () => void
  onMinimize: () => void
  onMaximize: () => void
  onClose: () => void
}

/**
 * A control cell (SPEC 2.4, Window controls): an 8x8 glyph in a 14x12 art px
 * cell, 22x22 under a coarse pointer, nudged 1 art px up into the title bar
 * so it spans its whole height. Pressed, the glyph moves down 1 art px. The
 * title bar is night chrome in both Lamp modes, so the colours are its
 * night tokens.
 */
const CONTROL_CLASS =
  'focus-ring flex h-12 w-14 flex-none items-center justify-center text-(--ink) active:[&>svg]:translate-y-1 pointer-coarse:-my-1 pointer-coarse:size-22'

/** Hover fills: the selection teal, and the danger red behind close. */
const HOVER_CLASS = 'hover:bg-(--select)'
const CLOSE_HOVER_CLASS = 'hover:bg-(--danger)'

interface ControlProps {
  label: string
  glyph: PixelIconName
  keyShortcuts?: string
  onClick: () => void
  className: string
}

/**
 * Each button stops pointerdown propagation so the window drag handler does
 * not begin when a control is pressed. The title bar counts its double taps
 * from that same handler, so two presses on a button never toggle maximize.
 */
function Control({
  label,
  glyph,
  keyShortcuts,
  onClick,
  className,
}: ControlProps) {
  const stopPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation()
  }
  return (
    <button
      type="button"
      aria-label={label}
      aria-keyshortcuts={keyShortcuts}
      onPointerDown={stopPointerDown}
      onClick={onClick}
      className={cn(CONTROL_CLASS, className)}
    >
      <PixelIcon name={glyph} />
    </button>
  )
}

/** Title bar controls: copy link, minimize, maximize or restore, close. */
export function WindowControls({
  maximized,
  onCopyLink,
  onMinimize,
  onMaximize,
  onClose,
}: WindowControlsProps) {
  return (
    <div
      {...{ [WINDOW_CONTROLS_ATTRIBUTE]: '' }}
      className="flex flex-none items-center"
    >
      <Control
        label={COPY_LINK_LABEL}
        glyph="link"
        onClick={onCopyLink}
        className={HOVER_CLASS}
      />
      <Control
        label="Minimize window"
        glyph="minimize"
        keyShortcuts="Control+M"
        onClick={onMinimize}
        className={HOVER_CLASS}
      />
      <Control
        label="Toggle maximize window"
        glyph={maximized ? 'restore' : 'maximize'}
        keyShortcuts="Control+Shift+M"
        onClick={onMaximize}
        className={HOVER_CLASS}
      />
      {/* The cream glyph on the danger red is 4.18:1, over the 3:1 a
          non-text control needs. */}
      <Control
        label="Close window"
        glyph="close"
        keyShortcuts="Control+W"
        onClick={onClose}
        className={CLOSE_HOVER_CLASS}
      />
    </div>
  )
}
