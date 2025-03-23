'use client'

import { motion } from 'motion/react'

interface AnimatedGradientProps {
  className?: string
}

export function AnimatedGradient({ className }: AnimatedGradientProps) {
  return (
    <motion.div
      className={className}
      initial={{ backgroundPosition: '0% 50%' }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration: 15,
        ease: 'linear',
      }}
    />
  )
}
