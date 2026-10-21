import { accentFor } from '@/components/os/accent-map'

import { OG_CONTENT_TYPE, OG_SIZE, projectCard } from '@/lib/og/og-card'
import { STATUS_LABEL, summaryLead } from '@/lib/utils/project-meta'
import {
  type ProjectRouteProps,
  findProjectBySlug,
  projectStaticParams,
} from '@/lib/utils/projects'

/*
 * Per-project Open Graph card (OG.md, project): the slug in the window's
 * prompt, the project's drawn icon (or its first letter on the bare tile),
 * its title, type and status chips and the first sentence of its summary.
 */

export const generateStaticParams = projectStaticParams

/**
 * One card per project, with its own alt text: the title and the lead
 * sentence it shows, as two sentences, since a lead can hold a colon
 * (decision 12 of SPEC 11). A static `alt` export would be the same for
 * every project.
 */
export function generateImageMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const project = findProjectBySlug(params.slug)
  if (!project) return []
  return [
    {
      id: 'card',
      alt: `${project.title}. ${summaryLead(project)}`,
      size: OG_SIZE,
      contentType: OG_CONTENT_TYPE,
    },
  ]
}

export default async function ProjectOpengraphImage({
  params,
}: ProjectRouteProps) {
  const { slug } = await params
  const project = findProjectBySlug(slug)
  if (!project) return new Response('Not found', { status: 404 })

  return projectCard({
    slug: project.slug,
    title: project.title,
    accent: accentFor(project.slug),
    type: project.projectType ?? 'project',
    status: project.status,
    statusLabel: STATUS_LABEL[project.status],
    summary: summaryLead(project),
  })
}
