'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ArrowLeft, Calendar, Clock, ExternalLink, Github } from 'lucide-react'
import { motion } from 'motion/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { AnimatedGradient } from '@/components/animated-gradient'
import { GradientHeading } from '@/components/gradient-heading'
import { PageTransition } from '@/components/layout/page-transition'
import { ProjectGallery } from '@/components/project-gallery'
import { RelatedProjects } from '@/components/related-projects'
import { ScrollAnimation } from '@/components/scroll-animation'

import { fadeUp, staggerContainer } from '@/lib/animation-utils'

import { projectsData } from '@/data/projects-data'
import { useScrollTop } from '@/hooks/use-scroll-top'

export default function ProjectDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [project, setProject] = useState<any>(null)
  const [relatedProjects, setRelatedProjects] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Find the current project
    const currentProject = projectsData.find((p) => p.slug === slug)
    setProject(currentProject)

    // Find related projects (excluding current project)
    if (currentProject) {
      const related = projectsData
        .filter((p) => p.slug !== slug)
        .filter((p) => {
          // Find projects with at least one matching technology
          return p.technologies.some((tech: string) =>
            currentProject.technologies.includes(tech)
          )
        })
        .slice(0, 3) // Limit to 3 related projects

      setRelatedProjects(related)
      setIsLoaded(true)
    }
  }, [slug])

  // Use the scroll hook to scroll to top when project changes
  useScrollTop({
    enabled: isLoaded,
    delay: 100,
    deps: [slug, isLoaded],
  })

  if (!project) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-16 md:px-6">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">Loading project...</h1>
          <p className="text-muted-foreground">
            Please wait while we fetch the project details.
          </p>
        </div>
      </div>
    )
  }

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

        {/* Rest of the component remains the same */}
        {/* Project Gallery */}
        <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
          <ScrollAnimation>
            <ProjectGallery images={project.gallery} />
          </ScrollAnimation>
        </section>

        {/* Project Details */}
        <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
          <div className="mx-auto max-w-4xl">
            <ScrollAnimation>
              <h2 className="mb-6 text-2xl font-bold md:text-3xl">
                Project Overview
              </h2>
              <div className="prose prose-lg mb-12 max-w-none dark:prose-invert">
                {project.description.map((paragraph: string, index: number) => (
                  <p key={index} className="mb-4 text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </ScrollAnimation>

            <ScrollAnimation delay={0.1}>
              <h2 className="mb-6 text-2xl font-bold md:text-3xl">
                Key Features
              </h2>
              <ul className="mb-12 grid gap-4 md:grid-cols-2">
                {project.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </ScrollAnimation>

            <ScrollAnimation delay={0.2}>
              <h2 className="mb-6 text-2xl font-bold md:text-3xl">
                Technical Details
              </h2>
              <div className="mb-12">
                <h3 className="mb-4 text-xl font-medium">Technology Stack</h3>
                <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {project.techDetails.stack.map(
                    (tech: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <span className="text-xs font-bold">
                            {tech.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm">{tech}</span>
                      </div>
                    )
                  )}
                </div>

                {project.techDetails.architecture && (
                  <>
                    <h3 className="mb-4 text-xl font-medium">Architecture</h3>
                    <p className="mb-6 text-muted-foreground">
                      {project.techDetails.architecture}
                    </p>
                  </>
                )}

                {project.techDetails.challenges && (
                  <>
                    <h3 className="mb-4 text-xl font-medium">
                      Challenges & Solutions
                    </h3>
                    <ul className="space-y-4">
                      {project.techDetails.challenges.map(
                        (item: any, index: number) => (
                          <li
                            key={index}
                            className="rounded-lg border border-border bg-card p-4"
                          >
                            <h4 className="mb-2 font-medium">
                              Challenge: {item.challenge}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Solution: {item.solution}
                            </p>
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}
              </div>
            </ScrollAnimation>

            {project.outcome && (
              <ScrollAnimation delay={0.3}>
                <h2 className="mb-6 text-2xl font-bold md:text-3xl">
                  Outcome & Results
                </h2>
                <div className="prose prose-lg mb-12 max-w-none dark:prose-invert">
                  <p className="text-muted-foreground">{project.outcome}</p>
                </div>
              </ScrollAnimation>
            )}
          </div>
        </section>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="bg-secondary/50">
            <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
              <ScrollAnimation>
                <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
                  Related Projects
                </h2>
                <RelatedProjects projects={relatedProjects} />
              </ScrollAnimation>
            </div>
          </section>
        )}

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
                  Interested in working together?
                </h2>
                <p className="mb-8 max-w-2xl text-muted-foreground">
                  I'm always open to new opportunities and collaborations. Let's
                  discuss how I can help bring your ideas to life.
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
