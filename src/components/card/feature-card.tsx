'use client'

import React from 'react'

import { motion } from 'motion/react'

import { ScrollAnimation } from '../scroll-animation'

interface FeatureCardProps {
  delay?: number
  title: string
  description: string | React.ReactNode
  icon: React.ReactNode
  children?: React.ReactNode
}

export const FeatureCard = ({
  delay = 0.1,
  title,
  description,
  icon,
  children,
}: FeatureCardProps) => {
  return (
    <ScrollAnimation delay={delay}>
      <motion.div
        className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg"
        whileHover={{ y: -5 }}
      >
        <motion.div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"
          whileHover={{
            rotate: [0, 10, -10, 0],
            transition: { duration: 0.5 },
          }}
        >
          {icon}
        </motion.div>
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p className="mb-4 text-muted-foreground">{description}</p>
        {children}
      </motion.div>
    </ScrollAnimation>
  )
}
