import type { ReactNode } from 'react'

import { TINT } from '@/lib/os/palettes.generated'
import { cn } from '@/lib/utils'

interface KbdProps {
  children: ReactNode
  /**
   * `default`: bordered chip for neutral surfaces (taskbar, palette, cards).
   * `accent`: shaded chip for use on filled accent buttons.
   */
  tone?: 'default' | 'accent'
  className?: string
}

/**
 * Single keyboard-hint chip used across all ShiroOS chrome. Every surface
 * previously hand-rolled a slightly different <kbd>; this is the one style.
 */
export function Kbd({ children, tone = 'default', className }: KbdProps) {
  return (
    <kbd
      className={cn(
        'rounded px-1.5 py-0.5 font-mono text-[11px]',
        tone === 'default' && 'border-rule bg-surf-solid/70 text-ink-3 border',
        // Ink over the fill moves it away from `cloud` in both modes, so the
        // chip stays readable on the resting and on the pressed accent.
        tone === 'accent' && 'text-cloud',
        className
      )}
      style={
        tone === 'accent'
          ? {
              backgroundColor: `color-mix(in oklab, var(--color-ink) ${TINT.kbd}%, transparent)`,
            }
          : undefined
      }
    >
      {children}
    </kbd>
  )
}
