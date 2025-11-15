'use cache'

import { cacheLife } from 'next/cache'
import { notFound } from 'next/navigation'

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'

import { PageTransition } from '@/components/layout/page-transition'
import { ProjectGallery } from '@/components/project-gallery'
import { RelatedProjects } from '@/components/related-projects'
import { ScrollAnimation } from '@/components/scroll-animation'
import CTASection from '@/components/sections/cta-section'

import { projectsData } from '@/data/projects-data'

import HeroSection from './_components/hero-section'
import ProjectDetailsSection from './_components/project-detail-section'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  cacheLife('days')
  const { slug } = await params
  const project = projectsData.find((p) => p.slug === slug)

  if (!project) {
    notFound()
  }

  const relatedProjects = projectsData
    .filter((p) => p.slug !== slug)
    .filter((p) =>
      p.technologies.some((tech: string) =>
        project!.technologies.includes(tech)
      )
    )
    .slice(0, 3)

  return (
    <PageTransition>
      <div className="flex flex-col">
        <HeroSection project={project} />

        {/* Project Gallery */}
        {project.gallery.length > 0 && (
          <section className="container mx-auto px-4 py-8 md:px-6 md:py-16">
            <ScrollAnimation>
              <ProjectGallery images={project.gallery} />
            </ScrollAnimation>
          </section>
        )}

        {/* Project Details */}
        <ProjectDetailsSection project={project} />

        {/* Related Projects */}
        <section className="bg-secondary/50">
          <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
            <ScrollAnimation>
              <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
                Related Projects
              </h2>
              {relatedProjects.length === 0 ? (
                <Empty className="bg-background mx-auto max-w-2xl border">
                  <EmptyHeader>
                    <EmptyTitle>No related projects found</EmptyTitle>
                    <EmptyDescription>
                      Projects with overlapping technologies will appear here.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    Explore more of the portfolio to discover other work.
                  </EmptyContent>
                </Empty>
              ) : (
                <RelatedProjects projects={relatedProjects} />
              )}
            </ScrollAnimation>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection
          title="Interested in working together?"
          description="I'm always open to new opportunities and collaborations. Let's discuss how I can help bring your ideas to life."
        />
      </div>
    </PageTransition>
  )
}
