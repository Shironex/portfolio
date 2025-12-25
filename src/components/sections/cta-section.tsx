'use client'

import Link from 'next/link'

import { ArrowRight, Github } from 'lucide-react'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'

import { APP_ROUTES, GITHUB_URL } from '@/lib/constants'
import { arrowPulse, buttonScale } from '@/lib/utils/animations'
import { useAnimationVisibility } from '@/lib/utils/use-animation-visibility'

import { ScrollAnimation } from '../scroll-animation'

interface CTASectionProps {
  title: string
  description: string
  showGitHubButton?: boolean
}

const CTASection = ({
  title,
  description,
  showGitHubButton = false,
}: CTASectionProps) => {
  const [ref, isVisible] = useAnimationVisibility()

  return (
    <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <ScrollAnimation>
        <motion.div
          className="border-border bg-card rounded-xl border p-8 md:p-12"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="flex flex-col items-center text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              {title}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              {description}
            </p>

            <div ref={ref} className="flex flex-col gap-4 sm:flex-row">
              <Link href={APP_ROUTES.toContact}>
                <motion.div whileHover="hover" whileTap="tap" variants={buttonScale}>
                  <Button
                    size="lg"
                    className="gap-2"
                    data-umami-event="Click Button Get in Touch"
                  >
                    Get in Touch
                    <motion.div animate={isVisible ? arrowPulse : { x: 0 }}>
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>

              {showGitHubButton && (
                <Link
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.div whileHover="hover" whileTap="tap" variants={buttonScale}>
                    <Button size="lg" variant="outline" className="gap-2">
                      <Github className="h-4 w-4" />
                      Follow on GitHub
                    </Button>
                  </motion.div>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </ScrollAnimation>
    </section>
  )
}

export default CTASection
