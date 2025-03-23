'use client'

import { motion } from 'motion/react'

interface LoadingSpinnerProps {
  size?: number
  thickness?: number
  color?: string
  secondaryColor?: string
  text?: string
  textClass?: string
}

export function LoadingSpinner({
  size = 40,
  thickness = 4,
  color = 'hsl(var(--primary))',
  secondaryColor = 'hsl(var(--primary) / 0.2)',
  text,
  textClass = 'text-sm text-muted-foreground mt-2',
}: LoadingSpinnerProps) {
  const spinTransition = {
    repeat: Number.POSITIVE_INFINITY,
    ease: 'linear',
    duration: 1.5,
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer circle */}
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{
            borderWidth: thickness,
            borderColor: `${secondaryColor} transparent ${secondaryColor} transparent`,
            width: size,
            height: size,
          }}
          animate={{ rotate: 360 }}
          transition={spinTransition}
        />

        {/* Inner circle */}
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{
            borderWidth: thickness,
            borderColor: `transparent ${color} transparent ${color}`,
            width: size * 0.7,
            height: size * 0.7,
            top: size * 0.15,
            left: size * 0.15,
          }}
          animate={{ rotate: -360 }}
          transition={{
            ...spinTransition,
            duration: 2,
          }}
        />

        {/* Center dot */}
        <motion.span
          className="absolute rounded-full"
          style={{
            backgroundColor: color,
            width: size * 0.2,
            height: size * 0.2,
            top: size * 0.4,
            left: size * 0.4,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
            ease: 'easeInOut',
          }}
        />
      </div>

      {text && <p className={textClass}>{text}</p>}
    </div>
  )
}
