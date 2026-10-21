import type { MetadataRoute } from 'next'

import { siteConfig } from '@/lib/metadata-config'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ShiroOS: Kacper's desktop",
    short_name: 'ShiroOS',
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    // The splash a fresh install paints: the ground navy the page shows in
    // both Lamp modes, and the browser bar's colour (SPEC 2.2).
    background_color: siteConfig.ground,
    theme_color: siteConfig.themeColor,
    // The README logo tile, nearest neighbour (`pnpm generate:icons`). The
    // maskable one sits on the ground, inside the circle a mask keeps.
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
        src: '/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
