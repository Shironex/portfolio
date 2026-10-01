import { parseMonthYear } from '@/lib/utils/format-date'

import type { Project, ProjectStatus } from '@/types'

/** How a status reads in a badge or a tag line. */
export const STATUS_LABEL: Record<ProjectStatus, string> = {
  'in-progress': 'in progress',
  shipped: 'shipped',
  archived: 'archived',
}

/** Root-relative path of the page for the project with this slug. */
export function projectPath(slug: string): string {
  return `/projects/${slug}`
}

/**
 * Whether `demoUrl` is a real link. Projects without a public demo carry an
 * empty string or a `#...` placeholder.
 */
export function hasUsableDemo(demoUrl: string): boolean {
  return demoUrl.length > 0 && !demoUrl.startsWith('#')
}

/** Headline technologies followed by the detailed stack, without repeats. */
export function projectStack(project: Project): string[] {
  return Array.from(
    new Set([...project.technologies, ...project.techDetails.stack])
  )
}

/**
 * `completedDate` ("May 2026") as an ISO year and month (`2026-05`), or
 * `undefined` when the project has no completion date or it is free text.
 */
export function completedDateIso(project: Project): string | undefined {
  return parseMonthYear(project.completedDate)?.iso
}

/** The first sentence of the summary, for places with room for one line. */
export function summaryLead(project: Project): string {
  const end = project.summary.search(/[.!?](\s|$)/)
  return end === -1 ? project.summary : project.summary.slice(0, end + 1)
}
