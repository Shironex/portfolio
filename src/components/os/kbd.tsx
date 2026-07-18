import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface KbdProps {
  children: ReactNode
  /**
   * `default` — bordered chip for neutral surfaces (taskbar, palette, cards).
   * `accent` — translucent chip for use on filled teal buttons.
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
        tone === 'accent' && 'bg-cloud/20 text-cloud',
        className
      )}
    >
      {children}
    </kbd>
  )
}
