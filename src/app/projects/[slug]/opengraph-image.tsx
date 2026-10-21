import { accentFor } from '@/components/os/accent-map'

import { AUTHOR_FULL_NAME } from '@/lib/constants'
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

export const alt = `Project card from the portfolio of ${AUTHOR_FULL_NAME}`
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export const generateStaticParams = projectStaticParams

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
