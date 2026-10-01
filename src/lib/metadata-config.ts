import { Metadata } from 'next'

import {
  AUTHOR_FULL_NAME,
  AUTHOR_NAME,
  BLOG_URL,
  GITHUB_URL,
} from '@/lib/constants'
import { DEFAULT_APPEARANCE, groundColor } from '@/lib/os/appearance'
import { DEFAULT_THEME_COLOR } from '@/lib/os/palettes.generated'
import {
  completedDateIso,
  hasUsableDemo,
  projectPath,
  projectStack,
} from '@/lib/utils/project-meta'

import { env } from '@/env/client'
import type { Project } from '@/types'

// Base URL for the website (used for absolute URLs in metadata)
export const siteConfig = {
  name: 'ShiroOS',
  title: 'Kacper Lachowicz: full-stack developer, TypeScript + Rust | ShiroOS',
  url: env.NEXT_PUBLIC_PUBLIC_URL,
  description:
    'Full-stack developer working in TypeScript and Rust: desktop apps with Tauri and Electron, typed Node backends, self-hosted infrastructure. Remote (CET), open to full-time roles and contracts.',
  twitter: {
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
  themeColor: DEFAULT_THEME_COLOR,
  /**
   * Page ground of the default appearance (light mode, default palette), for
   * the places CSS variables cannot reach: the `theme-color` meta as served
   * and the manifest.
   */
  ground: groundColor(DEFAULT_APPEARANCE),
}

/** Absolute URL of a root-relative path on this site. */
export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).href
}

/**
 * Document title: `<page title> | ShiroOS`, or the site title without one.
 * Also the root metadata template, so a title the shell sets by hand matches
 * the one a server render of the same URL would produce.
 */
export function documentTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} | ${siteConfig.name}` : siteConfig.title
}

/**
 * The author's name and handle lead `siteConfig.keywords`; project pages
 * carry those two after their own stack.
 */
const AUTHOR_KEYWORD_COUNT = 2

/** `@id` of the Person entity, so other JSON-LD blocks can point at it. */
const PERSON_ID = absoluteUrl('/#person')

// Default metadata that will be used as fallback
export const defaultMetadata: Metadata = {
  title: {
    default: documentTitle(),
    template: documentTitle('%s'),
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author, url: siteConfig.url }],
  creator: siteConfig.author,
  // The home page; a page with its own URL sets its own (see projectMetadata).
  alternates: { canonical: '/' },
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
  '@id': PERSON_ID,
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

/** Metadata for a project page; the title goes through the root template. */
export function projectMetadata(project: Project): Metadata {
  const path = projectPath(project.slug)
  return {
    title: project.title,
    description: project.summary,
    keywords: [
      ...projectStack(project),
      ...siteConfig.keywords.slice(0, AUTHOR_KEYWORD_COUNT),
    ],
    alternates: { canonical: path },
    openGraph: {
      ...defaultMetadata.openGraph,
      url: path,
      title: project.title,
      description: project.summary,
      // Image comes from src/app/projects/[slug]/opengraph-image.tsx.
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: project.title,
      description: project.summary,
    },
  }
}

/**
 * schema.org entity for a project. Projects with a public repository are
 * `SoftwareSourceCode`; client sites and closed-source work have no code to
 * point at, so they stay a plain `CreativeWork`. The author is a reference to
 * the Person rendered by the root layout.
 */
export function projectJsonLd(project: Project) {
  const url = absoluteUrl(projectPath(project.slug))
  const completed = completedDateIso(project)
  // Posts, docs and packages are about the project, not the project itself.
  const subjectOf = project.links?.map((link) => ({
    '@type': 'CreativeWork',
    name: link.label,
    url: link.url,
  }))
  return {
    '@context': 'https://schema.org',
    '@type': project.githubUrl ? 'SoftwareSourceCode' : 'CreativeWork',
    name: project.title,
    description: project.summary,
    url,
    mainEntityOfPage: url,
    author: { '@id': PERSON_ID },
    keywords: projectStack(project),
    creativeWorkStatus: project.status,
    ...(project.githubUrl && { codeRepository: project.githubUrl }),
    ...(project.image && { image: absoluteUrl(project.image) }),
    ...(completed && { datePublished: completed }),
    ...(hasUsableDemo(project.demoUrl) && { sameAs: [project.demoUrl] }),
    ...(subjectOf && subjectOf.length > 0 && { subjectOf }),
  }
}

/** JSON-LD as the body of a script tag: `<` is escaped so no string in the data can close the tag. */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
