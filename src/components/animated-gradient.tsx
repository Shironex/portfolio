'use client'

import { motion } from 'motion/react'

import { useAnimationVisibility } from '@/lib/utils/use-animation-visibility'

interface AnimatedGradientProps {
  className?: string
}

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
