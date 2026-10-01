import type { MetadataRoute } from 'next'

import { siteConfig } from '@/lib/metadata-config'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ShiroOS: Kacper's desktop",
    short_name: 'ShiroOS',
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    // The splash a fresh install paints: light is the default mode until the
    // visitor picks another, and a manifest cannot follow that choice.
    background_color: siteConfig.ground,
    theme_color: siteConfig.themeColor,
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
