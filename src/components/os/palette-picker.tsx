'use client'

import type { KeyboardEvent } from 'react'

import { PALETTES, type PaletteId } from '@/lib/os/appearance'
import { cn } from '@/lib/utils'

import { MENU_RADIO_GROUP_ROLE, MENU_RADIO_ROLE } from './menu-dropdown'

interface PalettePickerProps {
  value: PaletteId
  onSelect: (id: PaletteId) => void
  /**
   * Set when the picker is a row of a `role="menu"`. The swatches become
   * `menuitemradio`s in a group and only Left/Right are handled here, moving
   * focus without selecting; Up/Down, Home and End are left to the menu.
   */
  inMenu?: boolean
}

const NEXT_KEYS = ['ArrowRight', 'ArrowDown']
const PREV_KEYS = ['ArrowLeft', 'ArrowUp']

/**
 * Row of palette swatches.
 *
 * Each button carries its own `data-palette`, so the attribute-scoped tokens
 * in palettes.css paint it in the palette it offers rather than the one
 * currently active — the swatch previews the choice instead of restating a
 * colour that would stop tracking the table in `scripts/gen-palettes.mjs`.
 *
 * On its own it is a radiogroup: one tab stop (the checked swatch), arrow
 * keys move and select, wrapping at both ends, Home and End jump.
 */
export function PalettePicker({ value, onSelect, inMenu }: PalettePickerProps) {
  const handleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const swatches = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('button')
    )
    const current = swatches.indexOf(event.target as HTMLButtonElement)
    if (current === -1) return
    const last = swatches.length - 1
    const vertical = event.key === 'ArrowUp' || event.key === 'ArrowDown'

    let next: number
    if (NEXT_KEYS.includes(event.key) && !(inMenu && vertical)) {
      next = current === last ? 0 : current + 1
    } else if (PREV_KEYS.includes(event.key) && !(inMenu && vertical)) {
      next = current === 0 ? last : current - 1
    } else if (!inMenu && event.key === 'Home') {
      next = 0
    } else if (!inMenu && event.key === 'End') {
      next = last
    } else {
      return
    }

    event.preventDefault()
    // The enclosing menu would otherwise switch to the neighbouring menu.
    event.stopPropagation()
    swatches[next].focus()
    if (!inMenu) onSelect(PALETTES[next].id)
  }

  return (
    <div
      role={inMenu ? MENU_RADIO_GROUP_ROLE : 'radiogroup'}
      aria-label="Colour palette"
      onKeyDown={handleKey}
      className="flex items-center gap-1.5"
    >
      {PALETTES.map((p) => (
        <button
          key={p.id}
          type="button"
          role={inMenu ? MENU_RADIO_ROLE : 'radio'}
          aria-checked={value === p.id}
          aria-label={p.name}
          title={p.name}
          data-palette={p.id}
          // Roving: the checked swatch is the one stop. Inside a menu nothing
          // is tabbable and the menu moves focus itself.
          tabIndex={!inMenu && value === p.id ? 0 : -1}
          onClick={() => onSelect(p.id)}
          style={{ background: 'var(--color-miku)' }}
          className={cn(
            'focus-ring size-6 rounded-full border transition-transform pointer-coarse:size-9',
            value === p.id
              ? 'border-ink ring-ink/40 scale-110 ring-2'
              : 'border-rule-2 hover:scale-110'
          )}
        />
      ))}
    </div>
  )
}
