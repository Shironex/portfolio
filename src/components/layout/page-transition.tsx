'use client'

import type { ReactNode } from 'react'

import { motion } from 'motion/react'

import { pageVariants } from '@/lib/utils/animations'

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  )
}
