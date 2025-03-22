'use client'

import Link from 'next/link'

import { Github } from 'lucide-react'
import { ArrowLeft, Calendar, Clock, ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { AnimatedGradient } from '@/components/animated-gradient'
import { GradientHeading } from '@/components/gradient-heading'

import { fadeUp, staggerContainer } from '@/lib/utils/animations'

import { Project } from '@/types'

interface HeroSectionProps {
  project: Project
}

const HeroSection = ({ project }: HeroSectionProps) => {
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
          <Link href="/projects">
            <motion.div
              className="mb-8 flex items-center text-sm text-muted-foreground hover:text-foreground"
              variants={fadeUp}
              whileHover={{ x: -5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </motion.div>
          </Link>

          <GradientHeading
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            delay={0.1}
          >
            {project.title}
          </GradientHeading>

          <motion.p
            className="mb-8 max-w-2xl text-xl text-muted-foreground"
            variants={fadeUp}
          >
            {project.summary}
          </motion.p>

          <motion.div
            className="mb-8 flex flex-wrap justify-center gap-2"
            variants={fadeUp}
          >
            {project.technologies.map((tech: string) => (
              <Badge key={tech} variant="secondary" className="text-sm">
                {tech}
              </Badge>
            ))}
          </motion.div>

          <motion.div
            className="mb-8 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground"
            variants={fadeUp}
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Completed: {project.completedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Duration: {project.duration}</span>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col gap-4 sm:flex-row"
            variants={fadeUp}
          >
            {project.demoUrl && (
              <Link
                href={project.demoUrl}
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
                  <Button className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View Live Demo
                  </Button>
                </motion.div>
              </Link>
            )}

            {project.githubUrl && (
              <Link
                href={project.githubUrl}
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
                  <Button variant="outline" className="gap-2">
                    <Github className="h-4 w-4" />
                    View Source Code
                  </Button>
                </motion.div>
              </Link>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
