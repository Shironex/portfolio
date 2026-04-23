'use client'

import { type ReactNode, useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

export interface MenuDropdownItem {
  label: string
  kbd?: string
  icon?: ReactNode
  onClick: () => void
  disabled?: boolean
}

export interface MenuDropdownSection {
  items: MenuDropdownItem[]
  /** Render a divider BEFORE this section's items */
  divider?: boolean
}

interface MenuDropdownProps {
  label: string
  sections: MenuDropdownSection[]
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}

/**
 * Menubar dropdown — button that toggles an anchored popover of grouped items.
 * Closes on click-outside and Escape. Rendered in-place under the button; the
 * menubar is z-100, so the popover gets z-[150].
 */
export function MenuDropdown({
  label,
  sections,
  isOpen,
  onToggle,
  onClose,
}: MenuDropdownProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function handlePointer(event: MouseEvent) {
      const root = rootRef.current
      if (!root) return
      if (!root.contains(event.target as Node)) {
        onClose()
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, onClose])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={cn(
          'focus-ring font-body text-ink-2 hover:bg-surf-0 hover:text-ink rounded-md px-2 py-1 text-sm transition-colors',
          isOpen && 'bg-surf-0 text-ink'
        )}
      >
        {label}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label={label}
          className="animate-cp-in border-rule-2 bg-surf-solid shadow-elev-3 absolute top-full left-0 z-[150] mt-1 min-w-[200px] rounded-lg border py-1 motion-reduce:animate-none"
        >
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.divider && (
                <div role="separator" className="bg-rule my-1 h-px" />
              )}
              {section.items.map((item, itemIndex) => (
                <button
                  key={`${sectionIndex}-${itemIndex}-${item.label}`}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick()
                    onClose()
                  }}
                  className="focus-ring text-ink hover:bg-surf-soft flex w-full items-center gap-3 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {item.icon && (
                    <span aria-hidden className="text-ink-3 size-4">
                      {item.icon}
                    </span>
                  )}
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.kbd && (
                    <kbd className="text-ink-3 font-mono text-[11px]">
                      {item.kbd}
                    </kbd>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
