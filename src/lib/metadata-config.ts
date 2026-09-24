import { Metadata } from 'next'

import {
  AUTHOR_FULL_NAME,
  AUTHOR_NAME,
  BLOG_URL,
  GITHUB_URL,
} from '@/lib/constants'

import { env } from '@/env/client'

// Base URL for the website (used for absolute URLs in metadata)
export const siteConfig = {
  name: 'ShiroOS',
  title: 'Kacper Lachowicz: full-stack developer, TypeScript + Rust | ShiroOS',
  url: env.NEXT_PUBLIC_PUBLIC_URL,
  description:
    'Full-stack developer working in TypeScript and Rust: desktop apps with Tauri and Electron, typed Node backends, self-hosted infrastructure. Remote (CET), open to full-time roles and contracts.',
  twitter: {
    handle: '@shirone_dev',
    site: '@shirone_dev',
    cardType: 'summary_large_image',
  },
  keywords: [
    'Kacper Lachowicz',
    'Shironex',
    'full-stack developer',
    'TypeScript',
    'Rust',
    'Tauri',
    'Electron',
    'Node.js',
    'React',
    'desktop apps',
    'self-hosted',
    'remote developer',
    'Poland',
  ],
  author: AUTHOR_FULL_NAME,
  themeColor: '#0f7c74',
}

// Default metadata that will be used as fallback
export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.title,
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
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    // Image comes from src/app/opengraph-image.tsx (file-based metadata).
  },
  twitter: {
    card: siteConfig.twitter.cardType as 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    site: siteConfig.twitter.site,
    creator: siteConfig.twitter.handle,
    // Image comes from src/app/twitter-image.tsx (file-based metadata).
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

/**
 * schema.org Person for the site owner, rendered as JSON-LD in the root
 * layout so search engines can tie the page to a real name.
 */
export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: AUTHOR_FULL_NAME,
  alternateName: AUTHOR_NAME,
  url: siteConfig.url,
  jobTitle: 'Full-stack developer',
  description: siteConfig.description,
  knowsAbout: [
    'TypeScript',
    'Rust',
    'Tauri',
    'Electron',
    'Node.js',
    'React',
    'PostgreSQL',
    'Self-hosted infrastructure',
  ],
  knowsLanguage: ['en', 'pl'],
  address: { '@type': 'PostalAddress', addressCountry: 'PL' },
  sameAs: [GITHUB_URL, BLOG_URL],
}
