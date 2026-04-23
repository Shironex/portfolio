import type { MetadataRoute } from 'next'

import { siteConfig } from '@/lib/metadata-config'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ShiroOS — Kacper's desktop",
    short_name: 'ShiroOS',
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#f5efe0',
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
