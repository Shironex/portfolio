'use client'

import { useEffect, useState } from 'react'

import { PageTransition } from '@/components/layout/page-transition'
import { LoadingState } from '@/components/loading-state'
import { ProjectGallery } from '@/components/project-gallery'
import { ProjectLoadingSkeleton } from '@/components/project-loading-skeleton'
import { RelatedProjects } from '@/components/related-projects'
import { ScrollAnimation } from '@/components/scroll-animation'
import CTASection from '@/components/sections/cta-section'

import { projectsData } from '@/data/projects-data'
import { useScrollTop } from '@/hooks/use-scroll-top'

import HeroSection from './_components/hero-section'
import ProjectDetailsSection from './_components/project-detail-section'

type ProjectDetailPageProps = {
  params: { slug: string }
}

const ProjectDetailPage = ({ params }: ProjectDetailPageProps) => {
  const slug = params.slug
  const [project, setProject] = useState<any>(null)
  const [relatedProjects, setRelatedProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    const timer = setTimeout(() => {
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
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    }, 1500) // Simulate loading for 1.5 seconds

    return () => clearTimeout(timer)
  }, [slug])

  // Use the scroll hook to scroll to top when project changes
  useScrollTop({
    enabled: !isLoading,
    delay: 100,
    deps: [slug, isLoading],
  })

  if (isLoading) {
    return <ProjectLoadingSkeleton />
  }

  if (!project) {
    return (
      <div className="container mx-auto">
        <LoadingState
          title="Project Not Found"
          message="We couldn't find the project you're looking for."
          additionalInfo="Please check the URL or return to the projects page."
          buttonText="Back to Projects"
          buttonHref="/projects"
        />
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="flex flex-col">
        <HeroSection project={project} />

        {/* Project Gallery */}
        <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
          <ScrollAnimation>
            <ProjectGallery images={project.gallery} />
          </ScrollAnimation>
        </section>

        {/* Project Details */}
        <ProjectDetailsSection project={project} />

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
        <CTASection
          title="Interested in working together?"
          description="I'm always open to new opportunities and collaborations. Let's discuss how I can help bring your ideas to life."
        />
      </div>
    </PageTransition>
  )
}

export default ProjectDetailPage
