import type { MetadataRoute } from 'next'

import { getAllArticles } from '@/lib/mdx-utils'
import { sectionMetadata, siteConfig } from '@/lib/metadata-config'

import { projectsData } from '@/data/projects-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url

  // Get all static routes from section metadata
  const staticRoutes = Object.values(sectionMetadata).map((section) => ({
    url: `${baseUrl}${section.path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: section.path === '/' ? 1.0 : 0.8,
  }))

  // Get all project routes
  const projectRoutes = projectsData.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.completedDate || ''),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Get all article routes
  const articles = getAllArticles()
  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...projectRoutes, ...articleRoutes]
}
