import { MetadataRoute } from 'next'

import { env } from '@/env/client'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.NEXT_PUBLIC_PUBLIC_URL
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
