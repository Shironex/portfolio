'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

import { X } from 'lucide-react'

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
      className="bg-surf-solid text-ink animate-sheet-up fixed inset-0 flex flex-col motion-reduce:animate-none"
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="border-rule bg-surf-1 flex h-12 shrink-0 items-center justify-between gap-3 border-b px-4">
        <div className="flex items-center gap-2">
          {icon && (
            <span aria-hidden className="text-miku-2 text-sm">
              {icon}
            </span>
          )}
          <span className="text-ink-2 font-mono text-xs">{title}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="focus-ring text-ink-3 hover:bg-surf-0 hover:text-ink -mr-1 flex size-11 items-center justify-center rounded-md transition-colors"
        >
          <X aria-hidden size={18} />
        </button>
      </div>
      <div className="font-body text-ink flex-1 overflow-y-auto px-4 py-5">
        {children}
      </div>
    </div>
  )
}
