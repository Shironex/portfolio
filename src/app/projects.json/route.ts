import { AUTHOR_FULL_NAME } from '@/lib/constants'
import { STATIC_FEED_CACHE_CONTROL } from '@/lib/feed-cache'
import { absoluteUrl, siteConfig } from '@/lib/metadata-config'
import {
  completedDateIso,
  hasUsableDemo,
  projectPath,
} from '@/lib/utils/project-meta'

import { projectsData } from '@/data/projects-data'

/**
 * Every project as JSON, for scripts and agents that would rather not parse
 * HTML. Built from `projectsData` only, so it is static and changes on deploy.
 */
export function GET() {
  const feed = {
    site: siteConfig.url,
    author: AUTHOR_FULL_NAME,
    projects: projectsData.map((project) => ({
      slug: project.slug,
      title: project.title,
      summary: project.summary,
      type: project.projectType ?? null,
      status: project.status,
      featured: project.featured,
      technologies: project.technologies,
      duration: project.duration,
      completed: completedDateIso(project) ?? null,
      url: absoluteUrl(projectPath(project.slug)),
      demoUrl: hasUsableDemo(project.demoUrl) ? project.demoUrl : null,
      sourceUrl: project.githubUrl ?? null,
      links: project.links ?? [],
    })),
  }
  return Response.json(feed, {
    headers: { 'Cache-Control': STATIC_FEED_CACHE_CONTROL },
  })
}
