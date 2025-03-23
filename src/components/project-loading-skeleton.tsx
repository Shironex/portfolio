'use client'

import { motion } from 'motion/react'

import { LoadingSpinner } from './loading-spinner'

export function ProjectLoadingSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Hero Section Skeleton with Loading Text */}
      <section className="relative pt-24 md:pt-32">
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
          <div className="flex flex-col items-center text-center">
            {/* Back button skeleton */}
            <div className="mb-8 h-6 w-32 animate-pulse rounded-md bg-secondary/50" />

            {/* Loading Message */}
            <motion.div
              className="mb-8 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="mb-2 bg-gradient-to-r from-purple-400 to-primary bg-clip-text text-3xl font-bold text-transparent">
                Loading Project Details
              </h1>
              <p className="max-w-md text-center text-muted-foreground">
                We're preparing an amazing showcase of this project for you.
                Just a moment while we gather all the details...
              </p>
            </motion.div>

            {/* Title skeleton */}
            <div className="mb-6 h-16 w-3/4 animate-pulse rounded-lg bg-secondary/50" />

            {/* Summary skeleton */}
            <div className="mb-8 w-full max-w-2xl">
              <div className="mb-3 h-6 animate-pulse rounded-md bg-secondary/50" />
              <div className="mb-3 h-6 animate-pulse rounded-md bg-secondary/50" />
              <div className="h-6 w-2/3 animate-pulse rounded-md bg-secondary/50" />
            </div>

            {/* Tags skeleton */}
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-8 w-20 animate-pulse rounded-full bg-secondary/50"
                />
              ))}
            </div>

            {/* Metadata skeleton */}
            <div className="mb-8 flex flex-wrap justify-center gap-8">
              <div className="h-6 w-32 animate-pulse rounded-md bg-secondary/50" />
              <div className="h-6 w-32 animate-pulse rounded-md bg-secondary/50" />
            </div>

            {/* Buttons skeleton */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="h-10 w-40 animate-pulse rounded-md bg-primary/30" />
              <div className="h-10 w-40 animate-pulse rounded-md bg-secondary/50" />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Skeleton */}
      <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
        <div className="aspect-video w-full animate-pulse rounded-xl bg-secondary/50" />
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Loading project gallery...
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
        <div className="mx-auto max-w-4xl">
          {/* Section title */}
          <div className="mb-6 h-10 w-48 animate-pulse rounded-md bg-secondary/50" />

          {/* Content paragraphs */}
          <div className="mb-12">
            <div className="mb-3 h-6 animate-pulse rounded-md bg-secondary/50" />
            <div className="mb-3 h-6 animate-pulse rounded-md bg-secondary/50" />
            <div className="mb-3 h-6 animate-pulse rounded-md bg-secondary/50" />
            <div className="mb-3 h-6 w-3/4 animate-pulse rounded-md bg-secondary/50" />
          </div>

          {/* Loading indicator in the center with detailed text */}
          <div className="my-16 flex justify-center px-4">
            <div className="flex max-w-md flex-col items-center text-center">
              <LoadingSpinner size={60} />
              <h3 className="mt-6 text-xl font-medium">
                Preparing Project Details
              </h3>
              <p className="mt-2 text-muted-foreground">
                We're gathering information about technologies used, key
                features, and project outcomes.
              </p>
              <div className="mt-4 flex items-center justify-center space-x-1.5">
                <span className="text-sm text-muted-foreground">Loading</span>
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="font-bold text-primary"
                    animate={{
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: 'easeInOut',
                    }}
                  >
                    .
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* Features section title */}
          <div className="mb-6 h-10 w-48 animate-pulse rounded-md bg-secondary/50" />
          <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-md bg-secondary/50"
              />
            ))}
          </div>

          {/* Technical details section with text */}
          <div className="mb-6 h-10 w-56 animate-pulse rounded-md bg-secondary/50" />
          <div className="mb-4 text-center text-sm italic text-muted-foreground">
            Loading technical specifications and implementation details...
          </div>
          <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-md bg-secondary/50"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Related projects section with text */}
      <section className="bg-secondary/20 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <div className="mb-6 inline-block h-10 w-64 animate-pulse rounded-md bg-secondary/50" />
            <p className="text-muted-foreground">
              Discovering related projects you might be interested in...
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-xl bg-secondary/50"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pulsing dots at the bottom with text */}
      <div className="flex flex-col items-center justify-center py-16">
        <p className="mb-4 text-muted-foreground">
          Almost there! Finalizing project details...
        </p>
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-3 w-3 rounded-full bg-primary"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
