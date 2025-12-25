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

export function hexToDecimal(hex: string) {
  return parseInt(hex.replace('#', ''), 16)
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds
 * @param func The function to throttle
 * @param wait The number of milliseconds to throttle invocations to
 * @returns The throttled function
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
