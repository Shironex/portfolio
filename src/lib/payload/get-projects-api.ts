/**
 * Client-side API functions to fetch projects from Payload REST API
 * Use these in Client Components
 */

import type { Project } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_PUBLIC_URL || 'http://localhost:3000'

/**
 * Fetch all projects from the Payload REST API
 * Use this in Client Components
 */
export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch(`${API_URL}/api/projects?limit=100&sort=-completedDate`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  })

  if (!response.ok) {
    throw new Error('Failed to fetch projects')
  }

  const data = await response.json()
  return transformProjects(data.docs)
}

/**
 * Fetch featured projects from the Payload REST API
 * Use this in Client Components
 */
export async function fetchFeaturedProjects(limit = 3): Promise<Project[]> {
  const response = await fetch(
    `${API_URL}/api/projects?where[featured][equals]=true&limit=${limit}&sort=-completedDate`,
    {
      next: { revalidate: 60 },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch featured projects')
  }

  const data = await response.json()
  return transformProjects(data.docs)
}

/**
 * Fetch a single project by slug from the Payload REST API
 * Use this in Client Components
 */
export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const response = await fetch(`${API_URL}/api/projects?where[slug][equals]=${slug}&limit=1`, {
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch project')
  }

  const data = await response.json()

  if (data.docs.length === 0) {
    return null
  }

  const transformed = transformProjects(data.docs)
  return transformed[0] || null
}

/**
 * Transform Payload project data to match your existing Project interface
 */
function transformProjects(docs: any[]): Project[] {
  return docs.map((doc) => ({
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    summary: doc.summary,
    description: doc.description?.map((item: any) => item.paragraph) || [],
    image: getImageUrl(doc.image),
    gallery:
      doc.gallery?.map((item: any) => ({
        src: getImageUrl(item.image),
        alt: typeof item.image === 'object' ? item.image.alt : '',
        caption: typeof item.image === 'object' ? item.image.caption || '' : '',
      })) || [],
    technologies: doc.technologies?.map((item: any) => item.tech) || [],
    features: doc.features?.map((item: any) => item.feature) || [],
    techDetails: {
      stack: doc.techDetails?.stack?.map((item: any) => item.tech) || [],
      architecture: doc.techDetails?.architecture || undefined,
      challenges:
        doc.techDetails?.challenges?.map((item: any) => ({
          challenge: item.challenge,
          solution: item.solution,
        })) || [],
    },
    completedDate: doc.completedDate || undefined,
    startDate: doc.startDate || undefined,
    inProgress: doc.inProgress || false,
    duration: doc.duration,
    outcome: doc.outcome,
    demoUrl: doc.demoUrl,
    githubUrl: doc.githubUrl || undefined,
    featured: doc.featured || false,
  }))
}

/**
 * Helper to get image URL from Payload media
 */
function getImageUrl(media: any): string {
  if (typeof media === 'string') {
    return media
  }

  if (media && typeof media === 'object') {
    return media.url || media.filename || ''
  }

  return ''
}
