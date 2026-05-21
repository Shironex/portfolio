import { APP_WINDOW_DEFAULTS } from '@/components/os/constants'
import type { AppId, WindowId, WindowState } from '@/components/os/types'

import { cascadeOrigin } from '@/lib/os/geometry'

import type { Project } from '@/types'

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
    id: `project-${project.slug}` as WindowId,
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
