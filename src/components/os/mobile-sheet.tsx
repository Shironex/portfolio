'use client'

import { type ReactNode, useCallback, useRef } from 'react'

import { Link, X } from 'lucide-react'

import { isEditable } from '@/lib/os/dom'
import { cn } from '@/lib/utils'

import { type EscapeLayer, useEscapeLayer } from '@/hooks/use-escape-layer'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import { useScrollLock } from '@/hooks/use-scroll-lock'

import {
  COPY_LINK_LABEL,
  MOBILE_BAR_CLASS,
  MOBILE_GUTTER_CLASS,
} from './constants'

const HEADER_BUTTON_CLASS =
  'focus-ring text-ink-3 hover:bg-surf-0 hover:text-ink flex size-11 items-center justify-center rounded-md transition-colors'

interface MobileSheetProps {
  title: string
  /** Accessible name of the dialog; the title when not given. */
  label?: string
  /** Name of the close button. */
  closeLabel?: string
  /** Rendered in the header, typically a lucide icon element. */
  icon?: ReactNode
  onClose: () => void
  /** Shows a copy-link button beside close when provided. */
  onCopyLink?: () => void
  /** What Escape counts this sheet as; the launcher sits above a window. */
  layer?: Extract<EscapeLayer, 'sheet' | 'launcher'>
  children: ReactNode
}

/**
 * Full-screen slide-up sheet: the mobile replacement for the desktop
 * `<Window>`, and the app launcher. A modal layer: it traps focus, makes the
 * page behind inert, locks body scroll via a ref-counted helper so stacked
 * sheets don't fight over `overflow`, and closes on Esc (unless focus is in
 * a field, as with a window). It always sits on the one overlay layer, under
 * the command palette; a later sheet in the DOM covers an earlier one.
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
      // screen, so an outline around it says nothing.
      className="bg-surf-solid text-ink animate-sheet-up z-overlay fixed inset-0 flex flex-col outline-none motion-reduce:animate-none"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div
        className={cn(
          'border-rule bg-surf-1 flex shrink-0 items-center justify-between gap-3 border-b',
          MOBILE_BAR_CLASS,
          MOBILE_GUTTER_CLASS
        )}
      >
        <div className="flex items-center gap-2">
          {icon && (
            <span aria-hidden className="text-miku-2-icon">
              {icon}
            </span>
          )}
          <h2 className="text-ink-2 font-mono text-xs font-normal tracking-normal">
            {title}
          </h2>
        </div>
        <div className="-mr-1 flex items-center">
          {onCopyLink && (
            <button
              type="button"
              onClick={onCopyLink}
              aria-label={COPY_LINK_LABEL}
              className={HEADER_BUTTON_CLASS}
            >
              <Link aria-hidden size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className={HEADER_BUTTON_CLASS}
          >
            <X aria-hidden size={18} />
          </button>
        </div>
      </div>
      <div
        className={cn(
          'font-body text-ink flex-1 overflow-y-auto pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]',
          MOBILE_GUTTER_CLASS
        )}
      >
        {children}
      </div>
    </div>
  )
}
