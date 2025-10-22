'use client'

import React from 'react'

import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/routing'
import { APP_ROUTES } from '@/lib/constants'
import { fadeUp } from '@/lib/utils/animations'
import { staggerContainer } from '@/lib/utils/animations'

import { env } from '@/env/client'

import { AnimatedGradient } from '../animated-gradient'
import { GradientHeading } from '../gradient-heading'
import { Button } from '../ui/button'

interface HeroSectionProps {
  title: string
  description: string
  showAvailableForNewProjects?: boolean
  showBottomButtons?: boolean
}

const HeroSection = ({
  title,
  description,
  showAvailableForNewProjects = false,
  showBottomButtons = false,
}: HeroSectionProps) => {
  return (
    <section className="relative pt-24 md:pt-32">
      <AnimatedGradient className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <motion.div
          className="flex flex-col items-center text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {showAvailableForNewProjects && <AvailableForNewProjects />}

          <GradientHeading
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            delay={0.1}
          >
            {title}
          </GradientHeading>

          <motion.p
            className="mb-8 max-w-2xl text-xl text-muted-foreground"
            variants={fadeUp}
          >
            {description}
          </motion.p>

          {showBottomButtons && <BottomButtons />}
        </motion.div>
      </div>
    </section>
  )
}

const AvailableForNewProjects = () => {
  const t = useTranslations('hero')

  return (
    <motion.div
      className="mb-6 inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-sm"
      variants={fadeUp}
    >
      <motion.span
        className={`mr-2 inline-block h-2 w-2 rounded-full ${
          env.NEXT_PUBLIC_AVAILABLE_FOR === 'true'
            ? 'bg-green-500'
            : 'bg-red-500'
        }`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />
      {env.NEXT_PUBLIC_AVAILABLE_FOR === 'true'
        ? t('availableForWork')
        : t('notAvailableForWork')}
    </motion.div>
  )
}

const BottomButtons = () => {
  const t = useTranslations('hero')

  return (
    <motion.div className="flex flex-col gap-4 sm:flex-row" variants={fadeUp}>
      <Link href={APP_ROUTES.toProjects}>
        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={{
            hover: { scale: 1.05 },
            tap: { scale: 0.98 },
          }}
        >
          <Button
            size="lg"
            className="gap-2"
            data-umami-event="Click Button View My Work"
          >
            {t('viewMyWork')}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'loop',
                ease: 'easeInOut',
                times: [0, 0.6, 1],
              }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </Button>
        </motion.div>
      </Link>
      <Link href={APP_ROUTES.toContact}>
        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={{
            hover: { scale: 1.05 },
            tap: { scale: 0.98 },
          }}
        >
          <Button
            size="lg"
            variant="outline"
            data-umami-event="Click Button Get in Touch"
          >
            {t('getInTouch')}
          </Button>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default HeroSection
