import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Project as PayloadProject } from '@/types'

/**
 * Get all projects from Payload CMS
 * Use this in Server Components
 */
export async function getProjects() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'projects',
    limit: 100,
    sort: '-completedDate',
  })

  return transformProjects(docs)
}

/**
 * Get featured projects from Payload CMS
 * Use this in Server Components
 */
export async function getFeaturedProjects(limit = 3) {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'projects',
    where: {
      featured: {
        equals: true,
      },
    },
    limit,
    sort: '-completedDate',
  })

  return transformProjects(docs)
}

/**
 * Get a single project by slug
 * Use this in Server Components
 */
export async function getProjectBySlug(slug: string) {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'projects',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (docs.length === 0) {
    return null
  }

  const transformed = transformProjects(docs)
  return transformed[0] || null
}

/**
 * Get all project slugs for static generation
 * Use this in generateStaticParams()
 */
export async function getProjectSlugs() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'projects',
    limit: 100,
    select: {
      slug: true,
    },
  })

  return docs.map((doc) => doc.slug)
}

/**
 * Transform Payload project data to match your existing Project interface
 */
function transformProjects(docs: any[]): PayloadProject[] {
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
    // Payload stores uploaded images with a url property
    return media.url || media.filename || ''
  }

  return ''
}
