'use client'

import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

interface MobileSheetProps {
  title: string
  icon?: string
  onClose: () => void
  zIndex?: number
  children: ReactNode
}

/**
 * Full-screen slide-up sheet — the mobile replacement for the desktop
 * `<Window>`. No drag, no resize, no min/max; just a title bar with a close
 * button and a scrollable body.
 *
 * Multiple sheets can be stacked by `zIndex` (derived from the owning
 * window's z-order), which keeps the existing `useOsWindows` state model
 * working without changes.
 */
export function MobileSheet({
  title,
  icon,
  onClose,
  zIndex = 400,
  children,
}: MobileSheetProps) {
  // Prevent the page behind the sheet from scrolling while it's open.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  return (
    <div
      className="fixed inset-0 flex flex-col bg-surf-solid text-ink animate-sheet-up"
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
          className="-mr-1 rounded-md p-2 text-ink-3 transition-colors hover:bg-surf-0 hover:text-ink"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-5 font-body text-ink">
        {children}
      </div>
    </div>
  )
}
