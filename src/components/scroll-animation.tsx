'use client'

import { type ReactNode, useEffect, useMemo, useState } from 'react'

import { type Variants, motion, useAnimation } from 'motion/react'
import { useInView } from 'react-intersection-observer'

import { scrollFadeUp } from '@/lib/utils/animations'

interface ScrollAnimationProps {
  children: ReactNode
  variants?: Variants
  className?: string
  delay?: number
  threshold?: number
  once?: boolean
}

/**
 * Wraps content in a motion-enabled div that animates when scrolled into view.
 *
 * Uses the provided `variants` or a default fade-up variant that applies the `delay`
 * to its show transition. The `threshold` controls the intersection ratio required
 * to trigger the animation. When `once` is true, the animation runs only the first
 * time the element becomes visible; when false, it will reset to the hidden state
 * after leaving the viewport and animate again on re-entry.
 *
 * @param variants - Optional Framer Motion variants to override the default animation.
 * @param className - Optional CSS class to apply to the container element.
 * @param delay - Delay, in seconds, added to the show transition of the default variants.
 * @param threshold - Intersection ratio (0–1) required to consider the element "in view."
 * @param once - If true, animate only the first time the element enters the viewport.
 * @returns A motion.div element that animates its children based on scroll visibility.
 */
export function ScrollAnimation({
  children,
  variants,
  className,
  delay = 0,
  threshold = 0.1,
  once = true,
}: ScrollAnimationProps) {
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold, triggerOnce: once })
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (inView && !hasAnimated) {
      controls.start('show')
      if (once) setHasAnimated(true)
    } else if (!inView && !once && hasAnimated) {
      controls.start('hidden')
    }
  }, [controls, inView, hasAnimated, once])

  const defaultVariants: Variants = useMemo(
    () => ({
      ...scrollFadeUp,
      show: {
        ...scrollFadeUp.show,
        transition: {
          ...(scrollFadeUp.show as { transition: Record<string, unknown> })
            .transition,
          delay,
        },
      },
    }),
    [delay]
  )

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants || defaultVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}
