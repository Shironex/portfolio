'use client'

import { motion } from 'motion/react'

import { useAnimationVisibility } from '@/lib/utils/use-animation-visibility'

interface AnimatedGradientProps {
  className?: string
}

/**
 * Renders a background gradient that animates its position only while the element is visible.
 *
 * When visible, the gradient's backgroundPosition cycles from `0% 50%` → `100% 50%` → `0% 50%` in a continuous 15s linear loop. When not visible, the backgroundPosition stays at `0% 50%` and the animation does not repeat.
 *
 * @param className - Optional CSS class name applied to the outer element
 * @returns The rendered motion.div element containing the animated gradient
 */
export function AnimatedGradient({ className }: AnimatedGradientProps) {
  const [ref, isVisible] = useAnimationVisibility()

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ backgroundPosition: '0% 50%' }}
      animate={
        isVisible
          ? { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }
          : { backgroundPosition: '0% 50%' }
      }
      transition={{
        repeat: isVisible ? Number.POSITIVE_INFINITY : 0,
        duration: 15,
        ease: 'linear',
      }}
    />
  )
}
