'use client'

import type { ReactNode } from 'react'
import type { JSX } from 'react'

import { motion } from 'motion/react'

interface GradientHeadingProps {
  children: ReactNode
  className?: string
  delay?: number
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

export function GradientHeading({
  children,
  className = '',
  delay = 0,
  level = 1,
}: GradientHeadingProps) {
  const baseClasses =
    'bg-gradient-to-r from-foreground via-primary to-purple-500 bg-clip-text text-transparent'
  const combinedClasses = `${baseClasses} ${className}`

  const variants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(8px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay,
      },
    },
  }

  const Heading = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      <Heading className={combinedClasses}>{children}</Heading>
    </motion.div>
  )
}
