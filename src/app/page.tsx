'use client'

import Image from 'next/image'
import Link from 'next/link'

import { ArrowRight, Code, ExternalLink, Github } from 'lucide-react'
import { motion } from 'motion/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { AnimatedGradient } from '@/components/animated-gradient'
import { GradientHeading } from '@/components/gradient-heading'
import { PageTransition } from '@/components/layout/page-transition'
import { ScrollAnimation } from '@/components/scroll-animation'

import { cardHover, fadeUp, staggerContainer } from '@/lib/animation-utils'

import { projectsData } from '@/data/projects-data'

export default function Home() {
  const featuredProjects = projectsData
    .filter((project) => project.featured)
    .slice(0, 3)

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
              <motion.div
                className="mb-6 inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-sm"
                variants={fadeUp}
              >
                <motion.span
                  className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500"
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
                Available for new projects
              </motion.div>

              <GradientHeading
                className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
                delay={0.1}
              >
                Hello there! I'm Kacper
              </GradientHeading>

              <motion.p
                className="mb-8 max-w-2xl text-xl text-muted-foreground"
                variants={fadeUp}
              >
                I&apos;m a full-stack developer that loves building new things
                and web apps that can impact peoples around me.
              </motion.p>
              <motion.div
                className="flex flex-col gap-4 sm:flex-row"
                variants={fadeUp}
              >
                <Link href="/projects">
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={{
                      hover: { scale: 1.05 },
                      tap: { scale: 0.98 },
                    }}
                  >
                    <Button size="lg" className="gap-2">
                      View My Work
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
                <Link href="/contact">
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={{
                      hover: { scale: 1.05 },
                      tap: { scale: 0.98 },
                    }}
                  >
                    <Button size="lg" variant="outline">
                      Get in Touch
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
          <ScrollAnimation>
            <div className="mb-12 flex flex-col items-center text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                What I&apos;ve been working on
              </h2>
              <p className="max-w-2xl text-muted-foreground">
                A selection of my recent projects and collaborations.
              </p>
            </div>
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

          <ScrollAnimation delay={0.4}>
            <div className="mt-12 flex justify-center">
              <Link href="/projects">
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={{
                    hover: { scale: 1.05 },
                    tap: { scale: 0.98 },
                  }}
                >
                  <Button variant="outline" className="gap-2">
                    View All Projects
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
            </div>
          </ScrollAnimation>
        </section>

        {/* Skills Section */}
        <section className="bg-secondary/50">
          <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
            <ScrollAnimation>
              <div className="mb-12 flex flex-col items-center text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                  My Skills & Expertise
                </h2>
                <p className="max-w-2xl text-muted-foreground">
                  I specialize in building modern web applications with these
                  technologies.
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <ScrollAnimation delay={0.1}>
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
                    <Code className="h-6 w-6" />
                  </motion.div>
                  <h3 className="mb-2 text-xl font-bold">
                    Frontend Development
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Creating responsive and interactive user interfaces with
                    modern frameworks.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">Next.js</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                    <Badge variant="secondary">Tailwind CSS</Badge>
                    <Badge variant="secondary">Framer Motion</Badge>
                  </div>
                </motion.div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.2}>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M2 13a6 6 0 1 0 12 0 6 6 0 1 0-12 0Z"></path>
                      <path d="M16 13a6 6 0 1 0 12 0 6 6 0 1 0-12 0Z"></path>
                      <path d="M8 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"></path>
                      <path d="M8 21V8"></path>
                    </svg>
                  </motion.div>
                  <h3 className="mb-2 text-xl font-bold">
                    Backend Development
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Building robust server-side applications and APIs to power
                    web applications.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Node.js</Badge>
                    <Badge variant="secondary">Express</Badge>
                    <Badge variant="secondary">PostgreSQL</Badge>
                    <Badge variant="secondary">MongoDB</Badge>
                    <Badge variant="secondary">Redis</Badge>
                  </div>
                </motion.div>
              </ScrollAnimation>

              <ScrollAnimation delay={0.3}>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <rect
                        width="18"
                        height="18"
                        x="3"
                        y="3"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="3" x2="21" y1="9" y2="9"></line>
                      <line x1="9" x2="9" y1="21" y2="9"></line>
                    </svg>
                  </motion.div>
                  <h3 className="mb-2 text-xl font-bold">
                    DevOps & Deployment
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Setting up CI/CD pipelines and deploying applications to
                    production environments.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Docker</Badge>
                    <Badge variant="secondary">Terraform</Badge>
                    <Badge variant="secondary">GitHub Actions</Badge>
                    <Badge variant="secondary">Vercel</Badge>
                    <Badge variant="secondary">AWS</Badge>
                  </div>
                </motion.div>
              </ScrollAnimation>
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
                  Let&apos;s Work Together
                </h2>
                <p className="mb-8 max-w-2xl text-muted-foreground">
                  I&apos;m currently available for freelance projects, full-time
                  positions, or collaborations. If you have a project in mind or
                  just want to chat, feel free to reach out!
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
              </div>
            </motion.div>
          </ScrollAnimation>
        </section>
      </div>
    </PageTransition>
  )
}
