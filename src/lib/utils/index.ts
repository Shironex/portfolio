import type { MouseEvent } from 'react'

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

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

/**
 * Converts a hexadecimal string (e.g., a color code) to its decimal numeric value.
 *
 * @param hex - Hexadecimal string with or without a leading `#` (for example `#ff00aa` or `ff00aa`)
 * @returns The decimal number represented by the hex string
 */
export function hexToDecimal(hex: string) {
  return parseInt(hex.replace('#', ''), 16)
}
