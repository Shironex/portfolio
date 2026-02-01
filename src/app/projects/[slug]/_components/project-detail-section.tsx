'use client'

import { ScrollAnimation } from '@/components/scroll-animation'

import { Project } from '@/types'

interface ProjectDetailsSectionProps {
  project: Project
}

const ProjectDetailsSection = ({ project }: ProjectDetailsSectionProps) => {
  return (
    <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
      <div className="mx-auto max-w-4xl">
        <ScrollAnimation>
          <h2 className="mb-6 text-2xl font-bold md:text-3xl">
            Project Overview
          </h2>
          <div className="prose prose-lg dark:prose-invert mb-12 max-w-none">
            {project.description.map((paragraph: string, index: number) => (
              <p key={index} className="text-muted-foreground mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.1}>
          <h2 className="mb-6 text-2xl font-bold md:text-3xl">Key Features</h2>
          <ul className="mb-12 grid gap-4 md:grid-cols-2">
            {project.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
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
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {project.techDetails.stack.map((tech: string, index: number) => (
                <div
                  key={index}
                  className="border-border bg-card flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
                    <span className="text-xs font-bold">{tech.charAt(0)}</span>
                  </div>
                  <span className="text-sm">{tech}</span>
                </div>
              ))}
            </div>

            {project.techDetails.architecture && (
              <>
                <h3 className="mb-4 text-xl font-medium">Architecture</h3>
                <p className="text-muted-foreground mb-6">
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
                        className="border-border bg-card rounded-lg border p-4"
                      >
                        <h4 className="mb-2 font-medium">
                          Challenge: {item.challenge}
                        </h4>
                        <p className="text-muted-foreground text-sm">
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
      </div>
    </section>
  )
}

export default ProjectDetailsSection
