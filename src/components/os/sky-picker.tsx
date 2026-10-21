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

/**
 * A sky's 12x8 art px thumbnail in a 1 art px navy frame (14x10 in all),
 * with an outer 1 art px ring from `--swatch-ring` when one is set. The
 * frame and the ring are box shadows, not borders or outlines: those widths
 * are snapped to whole px and would not stay one art px.
 */
export function SkySwatch({
  swatch,
  className,
}: {
  swatch: string
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn('block h-10 w-14 flex-none p-1', className)}
      style={{
        backgroundImage: swatch,
        backgroundOrigin: 'content-box',
        backgroundClip: 'content-box',
        boxShadow:
          'inset 0 0 0 var(--px) var(--ground), var(--swatch-ring, 0 0 #0000)',
      }}
    />
  )
}

const NEXT_KEYS = ['ArrowRight', 'ArrowDown']
const PREV_KEYS = ['ArrowLeft', 'ArrowUp']

/**
 * Row of sky swatches: Night, Dusk, Dawn, Day and Live. A sky only changes
 * the wallpaper. Each swatch is a 12x8 art px thumbnail of its sky's bands
 * (`swatch` in `tokens.generated.ts`) in a 1 art px navy frame; Live
 * previews the four parts of the day. The checked one is framed in lamp
 * with a lamp pip under it, so it is not told by colour alone.
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
      className="flex items-center gap-2"
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
          className="focus-ring group relative flex h-14 w-18 items-center justify-center pointer-coarse:size-(--target)"
        >
          {/* The checked sky is ringed in lamp, a hovered one in teal. */}
          <SkySwatch
            swatch={sky.swatch}
            className={
              value === sky.id
                ? '[--swatch-ring:0_0_0_var(--px)_var(--lamp)]'
                : 'group-hover:[--swatch-ring:0_0_0_var(--px)_var(--frame)]'
            }
          />
          {value === sky.id && (
            <span
              aria-hidden
              className="absolute bottom-0 left-1/2 -ml-1 h-1 w-2 bg-(--lamp)"
            />
          )}
        </button>
      ))}
    </div>
  )
}
