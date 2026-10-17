import { APP_WINDOW_DEFAULTS } from '@/components/os/constants'
import type { AppId, WindowId, WindowState } from '@/components/os/types'

import { cascadeOrigin } from '@/lib/os/geometry'
import { artPx } from '@/lib/os/pixel'

import type { Project } from '@/types'

const PROJECT_WINDOW_PREFIX = 'project-'

/** Size of a new project window, in art px. */
const PROJECT_WINDOW_SIZE = { w: 410, h: 300 } as const

/** Id of the window that shows the project with this slug. */
export function projectWindowId(slug: string): WindowId {
  return `${PROJECT_WINDOW_PREFIX}${slug}`
}

/** Whether an id has the shape of a project window id. */
export function isProjectWindowId(id: string): id is `project-${string}` {
  return id.startsWith(PROJECT_WINDOW_PREFIX)
}

/** Slug of the project a project window shows; inverse of {@link projectWindowId}. */
export function projectSlugForWindow(id: WindowId): string {
  return id.slice(PROJECT_WINDOW_PREFIX.length)
}

/**
 * Build a fresh app `WindowState` from its registry defaults (art px) at
 * z-index `z`. Collapses the construction half of the old `openApp`.
 */
export function createAppWindow(appId: AppId, z: number): WindowState {
  const cfg = APP_WINDOW_DEFAULTS[appId]
  return {
    id: appId,
    title: cfg.title,
    icon: cfg.icon,
    x: artPx(cfg.x),
    y: artPx(cfg.y),
    w: artPx(cfg.w),
    h: artPx(cfg.h),
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
    w: artPx(PROJECT_WINDOW_SIZE.w),
    h: artPx(PROJECT_WINDOW_SIZE.h),
    z,
    minimized: false,
    maximized: false,
    project,
  }
}
