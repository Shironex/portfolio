import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import {
  FEATURED_LABEL,
  STATUS_LABEL,
  STATUS_SHORT_LABEL,
} from '@/lib/utils/project-meta'

import { type AccentRole, accentInk } from './accent-map'

type ChipTone = 'featured' | 'in-progress' | 'archived' | 'neutral'
type ChipSize = 'sm' | 'md'

interface StatusChipProps {
  /** What the chip says; `neutral` is a plain tag and takes its own text. */
  tone: ChipTone
  /** `sm` in a list row, with the short label; `md` in a detail header. */
  size?: ChipSize
  /** Colours the text in an accent role instead of the ink of its tone. */
  accent?: AccentRole
  /** Replaces the label of the tone. */
  children?: ReactNode
  className?: string
}

/**
 * Each tone is a notched tag 9-slice (`chip` and its recoloured variants in
 * pixel-chrome.css) with its own ink. Night chrome in both Lamp modes, so
 * the chip is an `os-night` subtree and every ink is a night value on it:
 * link on the teal tag, lamp on the warm one, meta on the ground one.
 */
const TONE_CLASS: Record<ChipTone, string> = {
  featured: 'px-chip text-(--link)',
  'in-progress': 'px-chip-warm text-(--lamp)',
  archived: 'px-chip-ground text-(--meta)',
  neutral: 'px-chip text-(--ink)',
}

const SIZE_CLASS: Record<ChipSize, string> = {
  sm: 'px-2',
  md: 'px-3',
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

/**
 * The one small tag of the shell: featured, in progress, archived, and the
 * plain kind tag of a project. Departure Mono, uppercase.
 */
export function StatusChip({
  tone,
  size = 'sm',
  accent,
  children,
  className,
}: StatusChipProps) {
  return (
    <span
      className={cn(
        'os-night text-label inline-block shrink-0 whitespace-nowrap uppercase',
        SIZE_CLASS[size],
        TONE_CLASS[tone],
        className
      )}
      style={accent && { color: accentInk(accent) }}
    >
      {children ?? LABEL[size][tone]}
    </span>
  )
}
