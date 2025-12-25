'use client'

import { useEffect, useState, useRef } from 'react'

interface UseAnimationVisibilityOptions {
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

/**
 * Hook that tracks element visibility in viewport to control animations
 * Returns true when element is visible, false otherwise
 * Used to pause infinite animations when elements are off-screen for performance
 */
export function useAnimationVisibility({
  threshold = 0.1,
  rootMargin = '50px',
  enabled = true,
}: UseAnimationVisibilityOptions = {}): [
  React.RefObject<HTMLDivElement>,
  boolean,
] {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!enabled) {
      setIsVisible(true)
      return
    }

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, enabled])

  return [ref, isVisible]
}
