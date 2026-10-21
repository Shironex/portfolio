import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface KbdProps {
  children: ReactNode
  /**
   * `default`: cream on the keycap, for chrome, palette and cards.
   * `accent`: lamp on the keycap, for a hint on a filled accent button.
   */
  tone?: 'default' | 'accent'
  className?: string
}

/**
 * The one keyboard hint of the shell: a keycap (the `keycap` 9-slice, with
 * its 3 art px bottom shadow) in Departure Mono. The keycap is night chrome
 * in both Lamp modes, so it is an `os-night` subtree and its text resolves
 * the night tokens.
 */
export function Kbd({ children, tone = 'default', className }: KbdProps) {
  return (
    <kbd
      className={cn(
        'os-night px-keycap text-label inline-block px-2 whitespace-nowrap',
        tone === 'default' ? 'text-(--ink)' : 'text-(--lamp)',
        className
      )}
    >
      {children}
    </kbd>
  )
}
