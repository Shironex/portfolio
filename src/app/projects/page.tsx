'use client'

import ProjectCard from '@/components/card/project-card'
import { PageTransition } from '@/components/layout/page-transition'
import { ScrollAnimation } from '@/components/scroll-animation'
import CTASection from '@/components/sections/cta-section'
import HeroSection from '@/components/sections/hero-section'

import { projectsData } from '@/data/projects-data'

export default function ProjectsPage() {
  const featuredProjects = projectsData.filter((project) => project.featured)
  const otherProjects = projectsData.filter((project) => !project.featured)

  return (
    <PageTransition>
      <div className="flex flex-col">
        <HeroSection
          title="Projects"
          description="A collection of my recent projects, showcasing my skills and experience in web development."
        />

        {/* Featured Projects */}
        <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
          <ScrollAnimation>
            <h2 className="mb-8 text-2xl font-bold md:text-3xl">
              Featured Projects
            </h2>
          </ScrollAnimation>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                delay={0.1 * index}
              />
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
                <ProjectCard
                  key={project.id}
                  project={project}
                  delay={0.1 * index}
                />
              ))}
            </div>
          </div>
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
