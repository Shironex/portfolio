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
 * Render a heading element (h1–h6) with text styling where all words are white except the last word which is in the primary accent color.
 *
 * The component automatically splits the text content and applies different styles:
 * - All words except the last: white text (`text-white`)
 * - Last word: primary accent color (`text-primary`)
 *
 * @example
 * ```tsx
 * // Renders "Hello World" where "Hello" is white and "World" is primary color
 * <GradientHeading>Hello World</GradientHeading>
 *
 * // Single word gets the primary accent color
 * <GradientHeading>Projects</GradientHeading>
 * ```
 *
 * @param children - Content to render inside the heading (only string children are processed)
 * @param className - Additional CSS classes to apply to the heading element
 * @param delay - Delay in seconds applied to the animation's `show` transition (default: 0)
 * @param level - Heading level (1–6) to render (`h1`..`h6`) (default: 1)
 * @returns A motion-wrapped heading element with the last word highlighted in the primary accent color and the configured animation variants
 */
export function GradientHeading({
  children,
  className = '',
  delay = 0,
  level = 1,
}: GradientHeadingProps) {
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

  /**
   * Split the text content to highlight the last word separately.
   * Memoized to avoid recalculation on every render.
   *
   * Process:
   * 1. Extract string from children (non-string children become empty string)
   * 2. Split by spaces to get individual words
   * 3. Pop the last word for separate styling
   * 4. Join remaining words back together
   *
   * Example: "Hello there World" → restOfText: "Hello there", lastWord: "World"
   */
  const { restOfText, lastWord } = useMemo(() => {
    const text = typeof children === 'string' ? children : ''
    const words = text.trim().split(' ')
    const last = words.pop()
    return {
      restOfText: words.join(' '),
      lastWord: last,
    }
  }, [children])

  return (
    <motion.div initial="hidden" animate="show" variants={variants}>
      <Heading className={className}>
        {restOfText && <span className="text-white">{restOfText} </span>}
        {lastWord && <span className="text-primary">{lastWord}</span>}
      </Heading>
    </motion.div>
  )
}
