import { APP_WINDOW_DEFAULTS } from '@/components/os/constants'
import type { AppId, WindowId, WindowState } from '@/components/os/types'

import { cascadeOrigin } from '@/lib/os/geometry'

import type { Project } from '@/types'

const PROJECT_WINDOW_PREFIX = 'project-'

/** Id of the window that shows the project with this slug. */
export function projectWindowId(slug: string): WindowId {
  return `${PROJECT_WINDOW_PREFIX}${slug}`
}

/** Slug of the project a project window shows; inverse of {@link projectWindowId}. */
export function projectSlugForWindow(id: WindowId): string {
  return id.slice(PROJECT_WINDOW_PREFIX.length)
}

/**
 * Build a fresh app `WindowState` from its registry defaults at z-index `z`.
 * Collapses the construction half of the old `openApp`.
 */
export function createAppWindow(appId: AppId, z: number): WindowState {
  const cfg = APP_WINDOW_DEFAULTS[appId]
  return {
    id: appId,
    title: cfg.title,
    icon: cfg.icon,
    x: cfg.x,
    y: cfg.y,
    w: cfg.w,
    h: cfg.h,
    z,
    minimized: false,
    maximized: false,
  }
}

/**
 * Build a fresh project `WindowState` cascaded by how many windows are already
 * open, at z-index `z`. Collapses the construction half of the old `openProject`.
 */
export function createProjectWindow(
  project: Project,
  z: number,
  openCount: number
): WindowState {
  const origin = cascadeOrigin(openCount)
  return {
    id: projectWindowId(project.slug),
    title: `${project.slug}.app`,
    icon: '◆',
    x: origin.x,
    y: origin.y,
    w: 820,
    h: 600,
    z,
    minimized: false,
    maximized: false,
    project,
  }
}
