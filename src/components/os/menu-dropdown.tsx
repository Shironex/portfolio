'use client'

import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
} from 'react'

import { cn } from '@/lib/utils'

import { useEscapeLayer } from '@/hooks/use-escape-layer'

export interface MenuDropdownItem {
  label: string
  kbd?: string
  /** `aria-keyshortcuts` value for the shortcut `kbd` shows. */
  keyShortcuts?: string
  icon?: ReactNode
  onClick: () => void
  disabled?: boolean
}

export interface MenuDropdownSection {
  items?: MenuDropdownItem[]
  /** Render a divider BEFORE this section's items */
  divider?: boolean
  /**
   * Arbitrary content rendered instead of `items`. Anything in it that should
   * be a stop for Up/Down needs a menu item role (see `PalettePicker`).
   */
  node?: ReactNode
}

/** Which item takes focus when the menu opens. */
export type MenuFocusEdge = 'first' | 'last'

/** Direction of a move between menus: to the next one or the previous. */
export type MenuStep = 1 | -1

/**
 * The handlers take the menu's `id` back, so the bar can hand every dropdown
 * the same stable functions instead of a closure per menu per render.
 */
interface MenuDropdownProps<Id extends string> {
  id: Id
  label: string
  sections: MenuDropdownSection[]
  isOpen: boolean
  /** Item focused on open: the last one when opened with ArrowUp. */
  focusEdge: MenuFocusEdge
  /** Roving tabindex of the menubar: one trigger is the tab stop. */
  tabIndex: 0 | -1
  onOpen: (id: Id, edge: MenuFocusEdge) => void
  onClose: (id: Id) => void
  /** Move to the neighbouring menu (Left/Right), opening it when `open`. */
  onStep: (id: Id, step: MenuStep, open: boolean) => void
  onTriggerFocus: (id: Id) => void
}

/** Marks a top-level menubar trigger, so the bar can move focus between them. */
export const MENU_TRIGGER_ATTRIBUTE = 'data-menu-trigger'

/** Role of a radio item inside a menu (a palette swatch). */
export const MENU_RADIO_ROLE = 'menuitemradio'

/** Role of the element that groups the radio items of one choice. */
export const MENU_RADIO_GROUP_ROLE = 'group'

/**
 * Stops of a menu for Up/Down: every enabled item, and for a radio group only
 * its checked item (Left/Right move inside the group).
 */
const MENU_STOP_SELECTOR = `[role="menuitem"]:not(:disabled), [role="${MENU_RADIO_ROLE}"][aria-checked="true"]`

/** The step a Left/Right key asks for, or `null` for any other key. */
function stepFromKey(key: string): MenuStep | null {
  if (key === 'ArrowRight') return 1
  if (key === 'ArrowLeft') return -1
  return null
}

function menuStops(menu: HTMLElement | null): HTMLElement[] {
  return Array.from(
    menu?.querySelectorAll<HTMLElement>(MENU_STOP_SELECTOR) ?? []
  )
}

/**
 * Menubar dropdown: a `menuitem` trigger and its anchored `menu`.
 *
 * Keyboard, following the ARIA menubar pattern:
 * - Trigger: Enter, Space or ArrowDown open on the first item, ArrowUp on the
 *   last; Left/Right go to the neighbouring menu.
 * - Menu: Up/Down wrap through the items, Home/End jump, a letter jumps to the
 *   next item starting with it, Left/Right open the neighbouring menu,
 *   Enter/Space activate.
 * - Escape closes and puts focus back on the trigger. Tab, a press outside,
 *   or focus leaving any other way closes it too.
 *
 * Rendered in place under the trigger; `z-menu` only has to clear the bar.
 */
export function MenuDropdown<Id extends string>({
  id,
  label,
  sections,
  isOpen,
  focusEdge,
  tabIndex,
  onOpen,
  onClose,
  onStep,
  onTriggerFocus,
}: MenuDropdownProps<Id>) {
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const close = useCallback(() => onClose(id), [onClose, id])
  const closeToTrigger = useCallback(() => {
    triggerRef.current?.focus()
    close()
  }, [close])

  useEscapeLayer('menu', closeToTrigger, isOpen)

  // Opening moves focus into the menu.
  useEffect(() => {
    if (!isOpen) return
    const items = menuStops(menuRef.current)
    items[focusEdge === 'first' ? 0 : items.length - 1]?.focus()
  }, [isOpen, focusEdge])

  useEffect(() => {
    if (!isOpen) return

    function handlePointer(event: MouseEvent) {
      const root = rootRef.current
      if (!root) return
      if (!root.contains(event.target as Node)) {
        close()
      }
    }

    document.addEventListener('mousedown', handlePointer)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
    }
  }, [isOpen, close])

  /** Handles Left/Right; says whether the key was one of them. */
  const stepOnKey = (event: KeyboardEvent<HTMLElement>): boolean => {
    const step = stepFromKey(event.key)
    if (step === null) return false
    event.preventDefault()
    onStep(id, step, isOpen)
    return true
  }

  const handleTriggerKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (stepOnKey(event)) return
    if (
      event.key === 'ArrowDown' ||
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault()
      onOpen(id, 'first')
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      onOpen(id, 'last')
    }
  }

  const handleMenuKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (stepOnKey(event)) return
    const items = menuStops(menuRef.current)
    // A swatch that is not the checked one still belongs to its group's stop.
    const group = (event.target as HTMLElement).closest(
      `[role="${MENU_RADIO_GROUP_ROLE}"]`
    )
    const current = items.findIndex(
      (item) => item === event.target || (group?.contains(item) ?? false)
    )
    const last = items.length - 1
    const focusItem = (index: number) => {
      event.preventDefault()
      items[index]?.focus()
    }

    if (event.key === 'ArrowDown') {
      focusItem(current === last ? 0 : current + 1)
    } else if (event.key === 'ArrowUp') {
      focusItem(current <= 0 ? last : current - 1)
    } else if (event.key === 'Home') {
      focusItem(0)
    } else if (event.key === 'End') {
      focusItem(last)
    } else if (event.key === 'Tab') {
      // Not prevented: Tab carries on from the trigger, out of the menubar.
      closeToTrigger()
    } else if (
      event.key.length === 1 &&
      event.key !== ' ' &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      const letter = event.key.toLowerCase()
      const match = [
        ...items.slice(current + 1),
        ...items.slice(0, current + 1),
      ].find((item) =>
        (item.textContent ?? '').trim().toLowerCase().startsWith(letter)
      )
      match?.focus()
    }
  }

  return (
    <div
      ref={rootRef}
      role="none"
      className="relative"
      onBlur={(event) => {
        if (isOpen && !event.currentTarget.contains(event.relatedTarget)) {
          close()
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        role="menuitem"
        tabIndex={tabIndex}
        {...{ [MENU_TRIGGER_ATTRIBUTE]: '' }}
        onClick={() => (isOpen ? close() : onOpen(id, 'first'))}
        onKeyDown={handleTriggerKey}
        onFocus={() => onTriggerFocus(id)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        className={cn(
          'focus-ring font-body text-ink-2 hover:bg-surf-0 hover:text-ink rounded-md px-2 py-1 text-sm transition-colors',
          isOpen && 'bg-surf-0 text-ink'
        )}
      >
        {label}
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={handleMenuKey}
          className="animate-cp-in border-rule-2 bg-surf-solid shadow-elev-3 z-menu absolute top-full left-0 mt-1 min-w-[200px] rounded-lg border py-1 motion-reduce:animate-none"
        >
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} role="none">
              {section.divider && (
                <div role="separator" className="bg-rule my-1 h-px" />
              )}
              {section.node && (
                <div role="none" className="px-3 py-1.5">
                  {section.node}
                </div>
              )}
              {!section.node &&
                section.items?.map((item, itemIndex) => (
                  <button
                    key={`${sectionIndex}-${itemIndex}-${item.label}`}
                    type="button"
                    role="menuitem"
                    tabIndex={-1}
                    disabled={item.disabled}
                    aria-keyshortcuts={item.keyShortcuts}
                    onClick={() => {
                      // Trigger first: whatever the item opens records it as
                      // the place focus returns to.
                      triggerRef.current?.focus()
                      item.onClick()
                      close()
                    }}
                    className="focus-ring text-ink hover:bg-surf-soft focus-visible:bg-surf-soft flex w-full items-center gap-3 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
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
