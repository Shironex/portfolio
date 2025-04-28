import { Metadata } from 'next'

// Base URL for the website (used for absolute URLs in metadata)
export const siteConfig = {
  name: 'Shirone | Developer Portfolio',
  url: process.env.NEXT_PUBLIC_PUBLIC_URL || 'https://shirone.dev',
  ogImage: '/og-image.png', // Default Open Graph image
  description:
    'Personal portfolio of Shirone, a full-stack developer specializing in Next.js and modern web technologies',
  twitter: {
    handle: '@shirone_dev',
    site: '@shirone_dev',
    cardType: 'summary_large_image',
  },
  keywords: [
    'web developer',
    'full-stack developer',
    'Next.js developer',
    'React developer',
    'TypeScript',
    'portfolio',
    'react',
    'nextjs',
    'tailwindcss',
    'typescript',
    'javascript',
    'nodejs',
  ],
  author: 'Shirone',
  themeColor: '#7c77c6',
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
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
  metadataBase: new URL(siteConfig.url),
}

// Type for page-specific metadata
export interface PageMetadata extends Partial<Metadata> {
  path?: string
  ogImage?: string
}

// Section-specific metadata configurations
export const sectionMetadata: Record<string, PageMetadata> = {
  home: {
    title: 'Home',
    description:
      'Full-stack developer building impactful web applications with modern technologies',
    path: '/',
    ogImage: '/og-image.png',
  },
  about: {
    title: 'About Me',
    description:
      'Learn about my journey, skills, and experience as a full-stack developer',
    path: '/about',
    ogImage: '/og-about.png',
  },
  projects: {
    title: 'Projects',
    description:
      'Explore my portfolio of web development projects and applications',
    path: '/projects',
    ogImage: '/og-projects.png',
  },
  articles: {
    title: 'Articles & Insights',
    description:
      'Read my thoughts and tutorials on web development, technology, and programming',
    path: '/articles',
    ogImage: '/og-articles.png',
  },
  contact: {
    title: 'Contact Me',
    description:
      'Get in touch with me for collaborations, job opportunities, or just to say hello',
    path: '/contact',
    ogImage: '/og-contact.png',
  },
}

// Helper function to generate metadata for a specific page
export function generateMetadata(
  pageMetadata: PageMetadata,
  dynamicParams?: Record<string, string>
): Metadata {
  const title = pageMetadata.title || defaultMetadata.title
  const description = pageMetadata.description || defaultMetadata.description
  const ogImage = pageMetadata.ogImage || siteConfig.ogImage

  // Construct the URL with dynamic parameters if provided
  let path = pageMetadata.path || '/'
  if (dynamicParams) {
    Object.entries(dynamicParams).forEach(([key, value]) => {
      path = path.replace(`:${key}`, value)
    })
  }

  const url = `${siteConfig.url}${path}`

  return {
    ...defaultMetadata,
    title,
    description,
    openGraph: {
      ...defaultMetadata.openGraph,
      title:
        typeof title === 'string'
          ? title
          : (title as any)?.default || siteConfig.name,
      description: description?.toString() || defaultMetadata.description || '',
      url,
      images: [
        {
          url: `${siteConfig.url}${ogImage}`,
          width: 1200,
          height: 630,
          alt:
            typeof title === 'string'
              ? title
              : (title as any)?.default || siteConfig.name,
        },
      ],
    },
    twitter: {
      ...defaultMetadata.twitter,
      title:
        typeof title === 'string'
          ? title
          : (title as any)?.default || siteConfig.name,
      description: description?.toString() || defaultMetadata.description || '',
      images: [`${siteConfig.url}${ogImage}`],
    },
    alternates: {
      canonical: url,
    },
  }
}
