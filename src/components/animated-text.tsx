'use client'

import type { ReactNode } from 'react'

import { motion } from 'motion/react'

interface AnimatedTextProps {
  text: string | ReactNode
  className?: string
  delay?: number
}

export function AnimatedText({
  text,
  className,
  delay = 0,
}: AnimatedTextProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
    >
      {text}
    </motion.div>
  )
}
