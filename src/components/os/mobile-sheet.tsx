'use client'

import { type ReactNode, useCallback, useRef } from 'react'

import { PixelIcon } from '@/components/pixel/pixel-icon.generated'

import { isEditable } from '@/lib/os/dom'
import { cn } from '@/lib/utils'

import { type EscapeLayer, useEscapeLayer } from '@/hooks/use-escape-layer'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import { useScrollLock } from '@/hooks/use-scroll-lock'
import '@/styles/mobile-chrome.css'

import { COPY_LINK_LABEL } from './constants'

/**
 * A glyph button of the title bar: a 22 art px target (44 css), the glyph
 * one art px down while pressed, as in a window's controls. Night tokens:
 * the bar is night chrome in both Lamp modes.
 */
const BAR_BUTTON_CLASS =
  'focus-ring flex size-(--target) flex-none items-center justify-center text-(--ink) active:[&>svg]:translate-y-1'

interface MobileSheetProps {
  title: string
  /** Accessible name of the dialog; the title when not given. */
  label?: string
  /** Name of the close button. */
  closeLabel?: string
  /** The 16x16 icon at the start of the title bar. */
  icon?: ReactNode
  onClose: () => void
  /** Shows a copy-link button beside close when provided. */
  onCopyLink?: () => void
  /** What Escape counts this sheet as; the launcher sits above a window. */
  layer?: Extract<EscapeLayer, 'sheet' | 'launcher'>
  children: ReactNode
}

/**
 * Full-screen slide-up sheet: the phone's window, and the app launcher. In
 * pixels (SPEC 1.2): a 24 art px title bar like a focused window's, with its
 * grip, icon and title and 22 art px glyph buttons, over a body that follows
 * the Lamp like a window body. It comes up in four held steps.
 *
 * A modal layer: it traps focus, makes the page behind inert, locks body
 * scroll via a ref-counted helper so stacked sheets don't fight over
 * `overflow`, and closes on Esc (unless focus is in a field, as with a
 * window). It always sits on the one overlay layer, under the command
 * palette; a later sheet in the DOM covers an earlier one.
 */
export function MobileSheet({
  title,
  label = title,
  closeLabel = 'Close',
  icon,
  onClose,
  onCopyLink,
  layer = 'sheet',
  children,
}: MobileSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useScrollLock(true)
  useFocusTrap(panelRef, true)
  const closeOnEscape = useCallback(() => {
    // Escape in a field means "leave the field alone", not "close the sheet".
    if (isEditable(document.activeElement)) return
    onClose()
  }, [onClose])
  useEscapeLayer(layer, closeOnEscape)

  return (
    <div
      ref={panelRef}
      // The panel takes focus itself when a deep link opens it; it fills the
      // screen, so an outline around it says nothing. The ground shows only
      // in the safe areas, round the bar and body.
      className="animate-sheet-up z-overlay fixed inset-0 flex flex-col bg-(--ground) pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)] outline-none motion-reduce:animate-none"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div className="os-night px-titlebar-sheet flex h-24 shrink-0 items-center gap-3">
        {icon && (
          <span aria-hidden className="flex flex-none">
            {icon}
          </span>
        )}
        {/* Clipped across only, as in a window: a vertical clip would cut
            the descenders of the title face. */}
        <h2 className="text-title min-w-0 flex-1 overflow-x-clip text-ellipsis whitespace-nowrap text-(--ink-hi)">
          {title}
        </h2>
        <div className="flex flex-none items-center">
          {onCopyLink && (
            <button
              type="button"
              onClick={onCopyLink}
              aria-label={COPY_LINK_LABEL}
              className={cn(BAR_BUTTON_CLASS, 'hover:bg-(--select)')}
            >
              <PixelIcon name="link" />
            </button>
          )}
          {/* The cream glyph on the danger red is 4.18:1, as on a window. */}
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className={cn(BAR_BUTTON_CLASS, 'hover:bg-(--danger)')}
          >
            <PixelIcon name="close" />
          </button>
        </div>
      </div>
      {/* Opaque, in the window body's colour, as a window's scroller is.
          The sheet already clears the side insets. */}
      <div className="font-body text-ink bg-surf-solid min-h-0 flex-1 overflow-y-auto px-8 pt-10 pb-[calc(12*var(--px)+env(safe-area-inset-bottom))]">
        {children}
      </div>
    </div>
  )
}
