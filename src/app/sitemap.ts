import type { MetadataRoute } from 'next'

import { absoluteUrl, siteConfig } from '@/lib/metadata-config'
import { completedDateIso, projectPath } from '@/lib/utils/project-meta'

import { projectsData } from '@/data/projects-data'

const PRIORITY = { home: 1.0, featured: 0.8, project: 0.6 } as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  'use cache'
  return [
    {
      url: siteConfig.url,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: PRIORITY.home,
    },
    // `lastModified` comes from the project's completion month and is left out
    // for ongoing work: a build timestamp would claim a change on every deploy.
    ...projectsData.map((project) => ({
      url: absoluteUrl(projectPath(project.slug)),
      lastModified: completedDateIso(project),
      changeFrequency: 'monthly' as const,
      priority: project.featured ? PRIORITY.featured : PRIORITY.project,
    })),
  ]
}
