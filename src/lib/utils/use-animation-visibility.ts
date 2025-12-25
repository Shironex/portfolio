'use client'

import { useEffect, useRef, useState } from 'react'

interface UseAnimationVisibilityOptions {
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

/**
 * Track whether an element is visible in the viewport to control animations.
 *
 * @param threshold - IntersectionObserver threshold at which the element is considered intersecting (default: 0.1)
 * @param rootMargin - Margin around the root bounding box used by the observer (default: '50px')
 * @param enabled - When false, visibility tracking is disabled and the hook reports the element as visible (default: true)
 * @returns A tuple containing a ref to attach to the observed div and a boolean that is `true` when the element is visible, `false` otherwise
 */
export function useAnimationVisibility({
  threshold = 0.1,
  rootMargin = '50px',
  enabled = true,
}: UseAnimationVisibilityOptions = {}): [
  React.RefObject<HTMLDivElement | null>,
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