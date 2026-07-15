import { Metadata } from 'next'

import { env } from '@/env/client'

// Base URL for the website (used for absolute URLs in metadata)
export const siteConfig = {
  name: "ShiroOS: Kacper's desktop",
  url: env.NEXT_PUBLIC_PUBLIC_URL,
  ogImage: '/og-image.png', // Default Open Graph image
  description:
    'Desktop-metaphor portfolio of Kacper Lachowicz, full-stack developer from Poland, building Electron apps and typed full-stack systems.',
  twitter: {
    handle: '@shirone_dev',
    site: '@shirone_dev',
    cardType: 'summary_large_image',
  },
  keywords: [
    'Kacper Lachowicz',
    'Shirone',
    'Electron',
    'Next.js',
    'TypeScript',
    'React',
    'Tailwind CSS',
    'NestJS',
    'desktop apps',
    'full-stack developer',
    'Poland',
  ],
  author: 'Shironex',
  themeColor: '#0f7c74',
}

// Default metadata that will be used as fallback
export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author, url: siteConfig.url }],
  creator: siteConfig.author,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: siteConfig.twitter.cardType as 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    site: siteConfig.twitter.site,
    creator: siteConfig.twitter.handle,
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Icons + manifest are auto-discovered from:
  //   src/app/icon.png        → /icon.png         (favicon)
  //   src/app/apple-icon.png  → /apple-icon.png   (iOS touch)
  //   src/app/manifest.ts     → /manifest.webmanifest
  // Declaring them manually here would pin Apple touch to the wrong size.
}
