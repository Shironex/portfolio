import type { MetadataRoute } from 'next'

import { siteConfig } from '@/lib/metadata-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  'use cache'
  return [
    {
      url: siteConfig.url,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
  ]
}
