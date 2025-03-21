'use client'

import Image from 'next/image'
import Link from 'next/link'

import { ExternalLink, Github } from 'lucide-react'
import { motion } from 'motion/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { AnimatedGradient } from '@/components/animated-gradient'
import { GradientHeading } from '@/components/gradient-heading'
import { PageTransition } from '@/components/layout/page-transition'
import { ScrollAnimation } from '@/components/scroll-animation'

import { cardHover, fadeUp, staggerContainer } from '@/lib/animation-utils'

import { projectsData } from '@/data/projects-data'

export default function ProjectsPage() {
  const featuredProjects = projectsData.filter((project) => project.featured)
  const otherProjects = projectsData.filter((project) => !project.featured)

  return (
    <PageTransition>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative pt-24 md:pt-32">
          <AnimatedGradient className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
          <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
            <motion.div
              className="flex flex-col items-center text-center"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              <GradientHeading
                className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
                delay={0.1}
              >
                What I've been working on
              </GradientHeading>

              <motion.p
                className="mb-8 max-w-2xl text-xl text-muted-foreground"
                variants={fadeUp}
              >
                A collection of my recent projects, showcasing my skills and
                experience in web development.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
          <ScrollAnimation>
            <h2 className="mb-8 text-2xl font-bold md:text-3xl">
              Featured Projects
            </h2>
          </ScrollAnimation>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <ScrollAnimation key={project.id} delay={0.1 * index}>
                <motion.div
                  className="project-card group"
                  whileHover="hover"
                  initial="rest"
                  variants={cardHover}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="mb-6 block overflow-hidden rounded-lg"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={project.image || '/placeholder.svg'}
                        alt={`${project.title} Project`}
                        width={600}
                        height={400}
                        className="h-48 w-full object-cover"
                      />
                    </motion.div>
                  </Link>
                  <Link href={`/projects/${project.slug}`}>
                    <h3 className="mb-2 text-xl font-bold transition-colors hover:text-primary">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="mb-4 text-muted-foreground">
                    {project.summary}
                  </p>
                  <div className="mb-6 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 5 && (
                      <Badge variant="secondary">
                        +{project.technologies.length - 5} more
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <Link href={`/projects/${project.slug}`}>
                      <motion.div
                        whileHover="hover"
                        whileTap="tap"
                        variants={{
                          hover: { scale: 1.05 },
                          tap: { scale: 0.98 },
                        }}
                      >
                        <Button variant="default" size="sm" className="gap-2">
                          View Details
                        </Button>
                      </motion.div>
                    </Link>
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
                          <Button variant="outline" size="sm" className="gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Live Demo
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
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Github className="h-4 w-4" />
                            Code
                          </Button>
                        </motion.div>
                      </Link>
                    )}
                  </div>
                </motion.div>
              </ScrollAnimation>
            ))}
          </div>
        </section>

        {/* Other Projects */}
        <section className="bg-secondary/50">
          <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
            <ScrollAnimation>
              <h2 className="mb-8 text-2xl font-bold md:text-3xl">
                Other Projects
              </h2>
            </ScrollAnimation>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {otherProjects.map((project, index) => (
                <ScrollAnimation key={project.id} delay={0.1 * index}>
                  <motion.div
                    className="project-card group bg-card"
                    whileHover="hover"
                    initial="rest"
                    variants={cardHover}
                  >
                    <Link
                      href={`/projects/${project.slug}`}
                      className="mb-6 block overflow-hidden rounded-lg"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Image
                          src={project.image || '/placeholder.svg'}
                          alt={`${project.title} Project`}
                          width={600}
                          height={400}
                          className="h-48 w-full object-cover"
                        />
                      </motion.div>
                    </Link>
                    <Link href={`/projects/${project.slug}`}>
                      <h3 className="mb-2 text-xl font-bold transition-colors hover:text-primary">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="mb-4 text-muted-foreground">
                      {project.summary}
                    </p>
                    <div className="mb-6 flex flex-wrap gap-2">
                      {project.technologies.slice(0, 5).map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 5 && (
                        <Badge variant="secondary">
                          +{project.technologies.length - 5} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <Link href={`/projects/${project.slug}`}>
                        <motion.div
                          whileHover="hover"
                          whileTap="tap"
                          variants={{
                            hover: { scale: 1.05 },
                            tap: { scale: 0.98 },
                          }}
                        >
                          <Button variant="default" size="sm" className="gap-2">
                            View Details
                          </Button>
                        </motion.div>
                      </Link>
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
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Live Demo
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
                            <Button variant="ghost" size="sm" className="gap-2">
                              <Github className="h-4 w-4" />
                              Code
                            </Button>
                          </motion.div>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
          <ScrollAnimation>
            <motion.div
              className="rounded-xl border border-border bg-card p-8 md:p-12"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="flex flex-col items-center text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                  Have a project in mind?
                </h2>
                <p className="mb-8 max-w-2xl text-muted-foreground">
                  I&apos;m always open to new opportunities and collaborations.
                  Let&apos;s discuss how I can help bring your ideas to life.
                </p>
                <Link href="/contact">
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={{
                      hover: { scale: 1.05 },
                      tap: { scale: 0.98 },
                    }}
                  >
                    <Button size="lg">Get in Touch</Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </ScrollAnimation>
        </section>
      </div>
    </PageTransition>
  )
}
