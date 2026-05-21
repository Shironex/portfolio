import type { Project } from '@/types'

/**
 * Filters projects that are currently in progress
 * @param projects - Array of all projects
 * @returns Array of projects that are in progress
 */
export function getInProgressProjects(projects: Project[]): Project[] {
  return projects.filter((project) => project.inProgress)
}

/**
 * Filters projects that are featured and not in progress
 * @param projects - Array of all projects
 * @param limit - Optional limit for the number of featured projects to return
 * @returns Array of featured projects (excluding in-progress projects)
 */
export function getFeaturedProjects(
  projects: Project[],
  limit?: number
): Project[] {
  const featured = projects.filter(
    (project) => project.featured && !project.inProgress
  )
  return limit ? featured.slice(0, limit) : featured
}

interface PinnedOptions {
  /** Max number of projects to return. */
  cap: number
  /** Which buckets to prefer first when merging. */
  order: 'featured-first' | 'in-progress-first'
  /** Field used to dedupe across the merged buckets. */
  dedupeBy: 'id' | 'slug'
}

/**
 * Merge featured + in-progress projects into a single deduped, capped list.
 *
 * Two surfaces consume this (start-menu recents, featured panel) with
 * divergent ordering, dedupe keys, and caps — each is preserved via
 * {@link PinnedOptions} rather than collapsed into one canonical output.
 */
export function getPinnedProjects(
  projects: Project[],
  { cap, order, dedupeBy }: PinnedOptions
): Project[] {
  const featured = getFeaturedProjects(projects)
  const inProgress = getInProgressProjects(projects)
  const buckets =
    order === 'featured-first'
      ? [...featured, ...inProgress]
      : [...inProgress, ...featured]

  const seen = new Set<string>()
  const pinned: Project[] = []
  for (const project of buckets) {
    const key = project[dedupeBy]
    if (seen.has(key)) continue
    seen.add(key)
    pinned.push(project)
    if (pinned.length >= cap) break
  }
  return pinned
}
