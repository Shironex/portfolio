import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  return new Date(`${dateString}T00:00:00Z`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
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

/**
 * Creates a wrapper that limits how often `func` can be invoked to at most once per `wait` milliseconds.
 *
 * The wrapper preserves the original `this` binding and arguments. If called again before `wait`
 * milliseconds have elapsed since the last execution, a single trailing invocation is scheduled
 * to run after the remaining wait time; only one pending trailing invocation is kept.
 *
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to throttle invocations to
 * @returns A throttled version of `func` that enforces the specified wait interval and preserves `this` and arguments
 */
export function throttle<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  let lastRun = 0

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now()

    if (!lastRun || now - lastRun >= wait) {
      func.apply(this, args)
      lastRun = now
    } else {
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(
        () => {
          func.apply(this, args)
          lastRun = Date.now()
        },
        wait - (now - lastRun)
      )
    }
  }
}
