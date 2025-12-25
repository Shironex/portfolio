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

/**
 * Filters projects that are neither featured nor in progress
 * @param projects - Array of all projects
 * @returns Array of other projects
 */
export function getOtherProjects(projects: Project[]): Project[] {
  return projects.filter(
    (project) => !project.featured && !project.inProgress
  )
}
