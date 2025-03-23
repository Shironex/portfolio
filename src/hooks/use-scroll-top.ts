'use client'

import type React from 'react'
import { useEffect } from 'react'

interface UseScrollTopOptions {
  /**
   * The element to scroll to. If not provided, scrolls to the top of the page.
   */
  element?: React.RefObject<HTMLElement>

  /**
   * Whether to enable the scroll behavior
   */
  enabled?: boolean

  /**
   * Delay in milliseconds before scrolling
   */
  delay?: number

  /**
   * Behavior of the scroll
   */
  behavior?: ScrollBehavior

  /**
   * Dependencies array to trigger scroll
   */
  deps?: any[]
}

/**
 * Hook to scroll to the top of the page or a specific element
 */
export function useScrollTop({
  element,
  enabled = true,
  delay = 100,
  behavior = 'smooth',
  deps = [],
}: UseScrollTopOptions = {}) {
  useEffect(() => {
    if (!enabled) return

    const scrollTimeout = setTimeout(() => {
      if (element && element.current) {
        element.current.scrollIntoView({
          behavior,
          block: 'start',
        })
      } else {
        window.scrollTo({
          top: 0,
          behavior,
        })
      }
    }, delay)

    return () => clearTimeout(scrollTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, delay, behavior, ...deps])
}
