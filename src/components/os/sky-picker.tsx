'use client'

import type { KeyboardEvent } from 'react'

import { SKIES, type SkyId } from '@/lib/os/appearance'
import { cn } from '@/lib/utils'

import { MENU_RADIO_GROUP_ROLE, MENU_RADIO_ROLE } from './menu-dropdown'

interface SkyPickerProps {
  value: SkyId
  onSelect: (id: SkyId) => void
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
 * Row of sky swatches: Night, Dusk, Dawn, Day and Live. A sky only changes
 * the wallpaper. Each swatch previews its sky's bands (`swatch` in
 * `tokens.generated.ts`); Live previews the four parts of the day.
 *
 * On its own it is a radiogroup: one tab stop (the checked swatch), arrow
 * keys move and select, wrapping at both ends, Home and End jump.
 */
export function SkyPicker({ value, onSelect, inMenu }: SkyPickerProps) {
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
    if (!inMenu) onSelect(SKIES[next].id)
  }

  return (
    <div
      role={inMenu ? MENU_RADIO_GROUP_ROLE : 'radiogroup'}
      aria-label="Sky"
      onKeyDown={handleKey}
      className="flex items-center gap-3"
    >
      {SKIES.map((sky) => (
        <button
          key={sky.id}
          type="button"
          role={inMenu ? MENU_RADIO_ROLE : 'radio'}
          aria-checked={value === sky.id}
          aria-label={sky.name}
          title={sky.name}
          // Roving: the checked swatch is the one stop. Inside a menu nothing
          // is tabbable and the menu moves focus itself.
          tabIndex={!inMenu && value === sky.id ? 0 : -1}
          onClick={() => onSelect(sky.id)}
          style={{ backgroundImage: sky.swatch }}
          className={cn(
            'focus-ring size-12 rounded-full border transition-transform pointer-coarse:size-18',
            value === sky.id
              ? 'border-ink ring-ink/40 scale-110 ring-2'
              : 'border-rule-2 hover:scale-110'
          )}
        />
      ))}
    </div>
  )
}
