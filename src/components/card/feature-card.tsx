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
        className="border-border bg-card rounded-xl border p-6 transition-all hover:shadow-lg"
        whileHover={{ y: -5 }}
      >
        <motion.div
          className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
          whileHover={{
            rotate: [0, 10, -10, 0],
            transition: { duration: 0.5 },
          }}
        >
          {icon}
        </motion.div>
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        {children}
      </motion.div>
    </ScrollAnimation>
  )
}
