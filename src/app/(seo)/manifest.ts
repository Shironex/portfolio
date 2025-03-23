import type { MetadataRoute } from 'next'

import { siteConfig } from '@/lib/metadata-config'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: 'Shirone',
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#1e1e2f',
    theme_color: siteConfig.themeColor,
    icons: [
      {
        src: '/og-image.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/og-image.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
