'use client'

import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

import { useFocusTrap } from '@/hooks/use-focus-trap'
import { useScrollLock } from '@/hooks/use-scroll-lock'

interface MobileSheetProps {
  title: string
  icon?: string
  onClose: () => void
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
  zIndex = 400,
  children,
}: MobileSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useScrollLock(true)
  useFocusTrap(panelRef, true)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 flex flex-col bg-surf-solid text-ink animate-sheet-up motion-reduce:animate-none"
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-rule bg-surf-1 px-4">
        <div className="flex items-center gap-2">
          {icon && (
            <span aria-hidden className="text-sm text-miku-2">
              {icon}
            </span>
          )}
          <span className="font-mono text-xs text-ink-2">{title}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="focus-ring -mr-1 flex size-11 items-center justify-center rounded-md text-ink-3 transition-colors hover:bg-surf-0 hover:text-ink"
        >
          <X aria-hidden size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-5 font-body text-ink">
        {children}
      </div>
    </div>
  )
}
