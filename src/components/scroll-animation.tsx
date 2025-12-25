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
