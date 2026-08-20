'use client'

import { PALETTES, type PaletteId } from '@/lib/os/appearance'
import { cn } from '@/lib/utils'

interface PalettePickerProps {
  value: PaletteId
  onSelect: (id: PaletteId) => void
}

/**
 * Row of palette swatches.
 *
 * Each button carries its own `data-palette`, so the attribute-scoped tokens
 * in palettes.css paint it in the palette it offers rather than the one
 * currently active — the swatch previews the choice instead of restating a
 * colour that would stop tracking the table in `scripts/gen-palettes.mjs`.
 */
export function PalettePicker({ value, onSelect }: PalettePickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Colour palette"
      className="flex items-center gap-1.5"
    >
      {PALETTES.map((p) => (
        <button
          key={p.id}
          type="button"
          role="radio"
          aria-checked={value === p.id}
          aria-label={p.name}
          title={p.name}
          data-palette={p.id}
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
