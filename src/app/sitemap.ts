import type { MetadataRoute } from 'next'

import { sectionMetadata, siteConfig } from '@/lib/metadata-config'
import { getAllArticles } from '@/lib/utils/mdx'

import { projectsData } from '@/data/projects-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url
  const currentDate = new Date().toISOString()

  // Get all static routes from section metadata
  const staticRoutes = Object.values(sectionMetadata).map((section) => ({
    url: `${baseUrl}${section.path}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: section.path === '/' ? 1.0 : 0.8,
  }))

  // Get all project routes
  const projectRoutes = projectsData.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.completedDate
      ? new Date(project.completedDate).toISOString()
      : currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Get all article routes
  const articles = getAllArticles()
  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.date
      ? new Date(article.date).toISOString()
      : currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...projectRoutes, ...articleRoutes]
}
