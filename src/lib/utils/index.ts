import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
