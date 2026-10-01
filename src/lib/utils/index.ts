import type { MouseEvent } from 'react'

import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge only knows Tailwind's default scale. Every token added in
 * `globals.css` is listed here under its group, or a conflict goes unresolved:
 * `shadow-elev-1` would survive next to `shadow-none`, and count as a shadow
 * colour that a caller's `shadow-miku/20` then deletes.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      shadow: ['elev-1', 'elev-2', 'elev-3', 'elev-4'],
      tracking: ['eyebrow', 'label', 'display'],
      ease: ['out-quart', 'sheet'],
      animate: [
        'drift',
        'floaty',
        'blink',
        'win-open',
        'win-close',
        'sheet-up',
        'cp-in',
        'menu-in',
        'pulse-slow',
        'bob-note',
        'logo-pop',
        'boot-out',
        'term-in',
        'fade-in',
      ],
    },
    classGroups: {
      z: [
        {
          z: [
            'desktop',
            'windows',
            'chrome',
            'menu',
            'overlay',
            'palette',
            'boot',
            'noscript',
            'lightbox',
            'toast',
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Build a backdrop mouse handler that only fires `onDismiss` when the press
 * lands on the backdrop element itself (not a bubbled child press). Used by
 * overlay surfaces to close on click-outside.
 */
export function onBackdropDismiss(onDismiss: () => void) {
  return (event: MouseEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) onDismiss()
  }
}

/** Whether untyped input (parsed storage, a JSON body) is a plain object. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/**
 * Converts a hexadecimal string (e.g., a color code) to its decimal numeric value.
 *
 * @param hex - Hexadecimal string with or without a leading `#` (for example `#ff00aa` or `ff00aa`)
 * @returns The decimal number represented by the hex string
 */
export function hexToDecimal(hex: string) {
  return parseInt(hex.replace('#', ''), 16)
}
