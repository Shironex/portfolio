import type { Project, ProjectStatus } from '@/types'

export type ProjectCounts = Record<ProjectStatus, number> & {
  total: number
  featured: number
}

/**
 * Count projects per status, plus the total and the featured flag (which
 * overlaps the statuses). Copy that mentions how many projects there are
 * reads from this so it can't drift from the data.
 */
export function countProjects(projects: readonly Project[]): ProjectCounts {
  const counts: ProjectCounts = {
    total: projects.length,
    featured: 0,
    'in-progress': 0,
    shipped: 0,
    archived: 0,
  }
  for (const project of projects) {
    counts[project.status]++
    if (project.featured) counts.featured++
  }
  return counts
}

/**
 * Filters projects that are currently in progress
 * @param projects - Array of all projects
 * @returns Array of projects that are in progress
 */
export function getInProgressProjects(projects: Project[]): Project[] {
  return projects.filter((project) => project.status === 'in-progress')
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
    (project) => project.featured && project.status !== 'in-progress'
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
