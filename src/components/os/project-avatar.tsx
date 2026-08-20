import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { type AccentRole, accentColor, accentTint } from './accent-map'

type AvatarSize = 10 | 8

interface ProjectAvatarProps {
  /** Accent role (e.g. from `accentFor(slug)`). */
  accent: AccentRole
  /** Tile dimension — maps to Tailwind `size-10` / `size-8`. */
  size?: AvatarSize
  /** Opacity of the accent behind the glyph, as a percentage. */
  tint?: number
  /** Tile contents — typically the project's first letter. */
  children: ReactNode
  /** Hide from the accessibility tree (the parent button labels itself). */
  hidden?: boolean
  /** Extra classes (e.g. `shrink-0`) layered onto the variant base. */
  className?: string
}

const SIZE_CLASS: Record<AvatarSize, string> = {
  10: 'size-10 text-lg',
  8: 'size-8 text-sm',
}

/**
 * Accent-tinted square tile used across the OS surfaces to represent a
 * project (projects grid, featured panel, start-menu recents). Size and
 * tint are variant props so each call site keeps its exact pixels.
 */
export function ProjectAvatar({
  accent,
  size = 10,
  tint = 15,
  children,
  hidden,
  className,
}: ProjectAvatarProps) {
  return (
    <span
      aria-hidden={hidden || undefined}
      className={cn(
        'font-display flex items-center justify-center rounded-lg font-bold',
        SIZE_CLASS[size],
        className
      )}
      style={{
        backgroundColor: accentTint(accent, tint),
        color: accentColor(accent),
      }}
    >
      {children}
    </span>
  )
}
