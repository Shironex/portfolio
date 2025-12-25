'use cache'

import { cacheLife } from 'next/cache'

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'

import ProjectCard from '@/components/card/project-card'
import { PageTransition } from '@/components/layout/page-transition'
import { ScrollAnimation } from '@/components/scroll-animation'
import CTASection from '@/components/sections/cta-section'
import HeroSection from '@/components/sections/hero-section'

import { projectsData } from '@/data/projects-data'
import {
  getFeaturedProjects,
  getInProgressProjects,
  getOtherProjects,
} from '@/lib/utils/projects'

export default async function ProjectsPage() {
  cacheLife('days')
  const inProgressProjects = getInProgressProjects(projectsData)
  const featuredProjects = getFeaturedProjects(projectsData)
  const otherProjects = getOtherProjects(projectsData)

  return (
    <PageTransition>
      <div className="flex flex-col">
        <HeroSection
          title="Projects"
          description="A collection of my recent projects, showcasing my skills and experience in web development."
        />

        {/* In Development Projects */}
        {inProgressProjects.length > 0 && (
          <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
            <ScrollAnimation>
              <h2 className="mb-8 text-2xl font-bold md:text-3xl">
                In Development
              </h2>
            </ScrollAnimation>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {inProgressProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  delay={0.1 * index}
                  priority={index < 2}
                />
              ))}
            </div>
          </section>
        )}

        {/* Featured Projects */}
        <section className="bg-secondary/50">
          <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
            <ScrollAnimation>
              <h2 className="mb-8 text-2xl font-bold md:text-3xl">
                Featured Projects
              </h2>
            </ScrollAnimation>
            {featuredProjects.length === 0 ? (
              <Empty className="bg-background border">
                <EmptyHeader>
                  <EmptyTitle>No featured projects</EmptyTitle>
                  <EmptyDescription>
                    When projects are marked as featured, they will appear here.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  Check back later or browse all projects below.
                </EmptyContent>
              </Empty>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    delay={0.1 * index}
                    priority={index < 2}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Other Projects */}
        <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
          <ScrollAnimation>
            <h2 className="mb-8 text-2xl font-bold md:text-3xl">
              Other Projects
            </h2>
          </ScrollAnimation>
          {otherProjects.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyTitle>No projects to display</EmptyTitle>
                <EmptyDescription>
                  Projects you add will be shown here with details and links.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                Consider adding new projects to showcase your work.
              </EmptyContent>
            </Empty>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {otherProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  delay={0.1 * index}
                  priority={index < 2}
                />
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <CTASection
          title="Have a project in mind?"
          description="Let's discuss how I can help bring your ideas to life."
        />
      </div>
    </PageTransition>
  )
}
