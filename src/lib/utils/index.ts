import type { MouseEvent } from 'react'

import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge only knows Tailwind's default scale. Every token added in
 * `globals.css` is listed here under its group, or a conflict goes unresolved:
 * `text-label` would count as a text colour, and a caller's `text-(--meta)`
 * would then delete it.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['label', 'body', 'prose', 'title', 'heading', 'display'],
      animate: [
        'blink',
        'win-open',
        'win-close',
        'sheet-up',
        'cp-in',
        'menu-in',
        'boot-out',
        'boot-open',
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
