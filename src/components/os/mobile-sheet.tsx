'use client'

import { type ReactNode, useMemo, useRef } from 'react'

import { Link, X } from 'lucide-react'

import { useFocusTrap } from '@/hooks/use-focus-trap'
import { useHotkeys } from '@/hooks/use-hotkeys'
import { useScrollLock } from '@/hooks/use-scroll-lock'

import { COPY_LINK_LABEL } from './constants'

const HEADER_BUTTON_CLASS =
  'focus-ring text-ink-3 hover:bg-surf-0 hover:text-ink flex size-11 items-center justify-center rounded-md transition-colors'

interface MobileSheetProps {
  title: string
  /** Rendered in the header — typically a lucide icon element. */
  icon?: ReactNode
  onClose: () => void
  /** Shows a copy-link button beside close when provided. */
  onCopyLink?: () => void
  zIndex?: number
  children: ReactNode
}

/**
 * Full-screen slide-up sheet — the mobile replacement for the desktop
 * `<Window>`. Traps focus, locks body scroll via a ref-counted helper so
 * stacking multiple sheets doesn't fight over `overflow`, and closes on Esc.
 */
export function MobileSheet({
  title,
  icon,
  onClose,
  onCopyLink,
  zIndex = 400,
  children,
}: MobileSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useScrollLock(true)
  useFocusTrap(panelRef, true)

  useHotkeys(useMemo(() => ({ escape: onClose }), [onClose]))

  return (
    <div
      ref={panelRef}
      className="bg-surf-solid text-ink animate-sheet-up fixed inset-0 flex flex-col motion-reduce:animate-none"
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="border-rule bg-surf-1 flex h-12 shrink-0 items-center justify-between gap-3 border-b px-4">
        <div className="flex items-center gap-2">
          {icon && (
            <span aria-hidden className="text-miku-2">
              {icon}
            </span>
          )}
          <span className="text-ink-2 font-mono text-xs">{title}</span>
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
            aria-label="Close"
            className={HEADER_BUTTON_CLASS}
          >
            <X aria-hidden size={18} />
          </button>
        </div>
      </div>
      <div className="font-body text-ink flex-1 overflow-y-auto px-4 py-5">
        {children}
      </div>
    </div>
  )
}
