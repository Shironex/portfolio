'use client'

import Link from 'next/link'

import { motion } from 'motion/react'

import { LoadingSpinner } from './loading-spinner'
import { Button } from './ui/button'

interface LoadingStateProps {
  title?: string
  message?: string
  additionalInfo?: string
  buttonText?: string
  buttonHref?: string
}

export function LoadingState({
  title = 'Loading...',
  message = 'Please wait while we fetch the data.',
  additionalInfo,
  buttonText,
  buttonHref,
}: LoadingStateProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoadingSpinner size={60} />

        <motion.h1
          className="mb-4 mt-8 bg-linear-to-r from-purple-400 to-primary bg-clip-text text-3xl font-bold text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="mx-auto max-w-md text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {message}
        </motion.p>

        {additionalInfo && (
          <motion.p
            className="mt-4 text-sm italic text-muted-foreground/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {additionalInfo}
          </motion.p>
        )}

        <motion.div
          className="mt-6 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="flex items-center space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-primary"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
      {buttonText && buttonHref && (
        <Link href={buttonHref} className="mt-6">
          <Button variant="secondary" size="sm">
            {buttonText}
          </Button>
        </Link>
      )}
    </div>
  )
}
