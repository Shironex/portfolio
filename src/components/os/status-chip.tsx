import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import {
  FEATURED_LABEL,
  STATUS_LABEL,
  STATUS_SHORT_LABEL,
} from '@/lib/utils/project-meta'

import { type AccentRole, accentInk, accentTintLayer } from './accent-map'
import { LABEL_CLASS } from './constants'

type ChipTone = 'featured' | 'in-progress' | 'archived' | 'neutral'
type ChipSize = 'sm' | 'md'

interface StatusChipProps {
  /** What the chip says; `neutral` is a plain tag and takes its own text. */
  tone: ChipTone
  /** `sm` in a list row, with the short label; `md` in a detail header. */
  size?: ChipSize
  /**
   * Lays the tint over the opaque card colour. For a chip a glow can reach
   * under: a tint over a glow is not a ground its text was made for.
   */
  opaque?: boolean
  /** Paints the chip in an accent role instead of the colours of its tone. */
  accent?: AccentRole
  /** Replaces the label of the tone. */
  children?: ReactNode
  className?: string
}

/**
 * The tint is a background image in every tone, so `opaque` only has to put a
 * colour under it. Text of an accent sits on at most `TINT.text` of it.
 */
const TONE_CLASS: Record<ChipTone, string> = {
  featured: 'from-miku/15 to-miku/15 text-miku-ink',
  'in-progress': 'from-peach/20 to-peach/20 text-peach-ink',
  archived: 'from-surf-0 to-surf-0 text-ink-3',
  neutral: 'from-surf-0 to-surf-0 text-ink-3',
}

const SIZE_CLASS: Record<ChipSize, string> = {
  sm: 'px-1.5 py-0.5 font-mono text-[11px] uppercase',
  md: cn(LABEL_CLASS, 'px-2 py-0.5'),
}

const LABEL: Record<ChipSize, Record<ChipTone, string | undefined>> = {
  sm: {
    featured: FEATURED_LABEL,
    'in-progress': STATUS_SHORT_LABEL['in-progress'],
    archived: STATUS_SHORT_LABEL.archived,
    neutral: undefined,
  },
  md: {
    featured: FEATURED_LABEL,
    'in-progress': STATUS_LABEL['in-progress'],
    archived: STATUS_LABEL.archived,
    neutral: undefined,
  },
}

/** Tint a chip in an accent role lays behind its text, in percent. */
const ACCENT_TINT = 13

/**
 * The one small tag of the shell: featured, in progress, archived, and the
 * plain kind tag of a project.
 */
export function StatusChip({
  tone,
  size = 'sm',
  opaque,
  accent,
  children,
  className,
}: StatusChipProps) {
  return (
    <span
      className={cn(
        'shrink-0 rounded bg-linear-to-r',
        SIZE_CLASS[size],
        TONE_CLASS[tone],
        opaque && 'bg-surf-soft',
        className
      )}
      style={
        accent && {
          backgroundImage: accentTintLayer(accent, ACCENT_TINT),
          color: accentInk(accent),
        }
      }
    >
      {children ?? LABEL[size][tone]}
    </span>
  )
}
