'use client'

import React from 'react'

import { motion } from 'motion/react'

import { cn } from '@/lib/utils'

type Props = {
  className?: string
  children?: React.ReactNode
  words?: string
}

const Paragraph = ({ className, children, words }: Props) => {
  return (
    <p
      className={cn(
        'text-sm font-normal text-muted-foreground lg:text-base',
        className
      )}
    >
      {words
        ? words.split(' ').map((el, i) => (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.25,
                delay: i / 10,
              }}
              key={i}
            >
              {el}{' '}
            </motion.span>
          ))
        : children}
    </p>
  )
}

export default Paragraph
