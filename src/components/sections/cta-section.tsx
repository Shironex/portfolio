import Link from 'next/link'

import { ArrowRight, Github } from 'lucide-react'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'

import { APP_ROUTES, GITHUB_URL } from '@/lib/constants'

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
  return (
    <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
      <ScrollAnimation>
        <motion.div
          className="rounded-xl border border-border bg-card p-8 md:p-12"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="flex flex-col items-center text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              {title}
            </h2>
            <p className="mb-8 max-w-2xl text-muted-foreground">
              {description}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href={APP_ROUTES.toContact}>
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={{
                    hover: { scale: 1.05 },
                    tap: { scale: 0.98 },
                  }}
                >
                  <Button size="lg" className="gap-2">
                    Get in Touch
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

              {showGitHubButton && (
                <Link
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={{
                      hover: { scale: 1.05 },
                      tap: { scale: 0.98 },
                    }}
                  >
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
