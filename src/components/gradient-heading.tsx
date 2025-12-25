'use client'

import type { ReactNode } from 'react'
import type { JSX } from 'react'
import { useMemo } from 'react'

import { type Variants, motion } from 'motion/react'

import { gradientHeadingVariants } from '@/lib/utils/animations'

interface GradientHeadingProps {
  children: ReactNode
  className?: string
  delay?: number
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

/**
 * Render a heading element (h1–h6) with gradient text styling and a configurable show animation delay.
 *
 * @param children - Content to render inside the heading
 * @param className - Additional CSS classes to apply to the heading
 * @param delay - Delay in seconds applied to the animation's `show` transition
 * @param level - Heading level (1–6) to render (`h1`..`h6`)
 * @returns A motion-wrapped heading element with gradient text and the configured animation variants
 */
export function GradientHeading({
  children,
  className = '',
  delay = 0,
  level = 1,
}: GradientHeadingProps) {
  const baseClasses =
    'bg-linear-to-r from-foreground via-primary to-purple-500 bg-clip-text text-transparent'
  const combinedClasses = `${baseClasses} ${className}`

  const variants: Variants = useMemo(
    () => ({
      ...gradientHeadingVariants,
      show: {
        ...gradientHeadingVariants.show,
        transition: {
          ...(
            gradientHeadingVariants.show as {
              transition: Record<string, unknown>
            }
          ).transition,
          delay,
        },
      },
    }),
    [delay]
  )

  const Heading = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <motion.div initial="hidden" animate="show" variants={variants}>
      <Heading className={combinedClasses}>{children}</Heading>
    </motion.div>
  )
}
