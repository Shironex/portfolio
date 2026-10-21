import {
  APP_WINDOW_DEFAULTS,
  type AppWindowDefaults,
} from '@/components/os/constants'
import { panelColumnLeft } from '@/components/os/desktop-layout'
import type { AppId, WindowId, WindowState } from '@/components/os/types'

import { measureDesktopArea } from '@/lib/os/dom'
import {
  CASCADE_OFFSET,
  NEW_WINDOW_HEADROOM,
  NEW_WINDOW_MIN_WIDTH,
  NEW_WINDOW_PANEL_GAP,
  type Rect,
  fitInArea,
} from '@/lib/os/geometry'
import {
  DEFAULT_ART_PIXEL,
  artPixel,
  artPx,
  floorToArt,
  snapToArt,
} from '@/lib/os/pixel'

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
 * `n` art px of a window default as the CSS px it takes at DPR 1, snapped
 * to the art pixel of this screen. New windows open at that CSS size and
 * place at every DPR (decision 1 of SPEC 11): at 1.25, where an art px is
 * 2.4 CSS px, a window drawn at its art size would be 20% larger and cover
 * the panel column.
 */
function openingPx(n: number): number {
  return snapToArt(artPx(n, DEFAULT_ART_PIXEL))
}

/**
 * A new window's rect, in CSS px, from its default (art px):
 * - its DPR 1 size and place, at every DPR (decision 1 of SPEC 11);
 * - clear of the desktop's panel column (decision 13): it ends
 *   {@link NEW_WINDOW_PANEL_GAP} left of the column, narrowed as far as
 *   {@link NEW_WINDOW_MIN_WIDTH} (or the app's `openMinWidth`), then moved
 *   left, and only overlaps the column where even that does not fit;
 * - no higher than {@link NEW_WINDOW_HEADROOM} under the top of the desktop
 *   area, so the pet can sit on it the moment it opens;
 * - inside the area, which moves a window up (or shrinks it) only where the
 *   area is too short for both.
 * An `artHeight` window keeps its height in art px, and takes its
 * `narrowHeight` when it opens narrower than its default (see
 * `AppWindowDefaults`).
 */
function openingRect({
  x,
  y,
  w,
  h,
  artHeight,
  narrowHeight,
  openMinWidth = NEW_WINDOW_MIN_WIDTH,
}: Omit<AppWindowDefaults, 'title' | 'icon'>): Rect {
  const px = artPixel()
  const area = measureDesktopArea()
  let left = openingPx(x)
  let width = openingPx(w)

  const panels = panelColumnLeft(px)
  if (panels !== null) {
    const right = panels - artPx(NEW_WINDOW_PANEL_GAP, px)
    if (left + width > right) {
      const narrowest = Math.min(width, openingPx(openMinWidth))
      width = Math.max(narrowest, floorToArt(right - left, px))
      if (left + width > right) {
        left = Math.max(area.x, floorToArt(right - width, px))
      }
    }
  }

  const narrow = narrowHeight !== undefined && width < artPx(w, px)
  const height = artHeight ? artPx(narrow ? narrowHeight : h, px) : openingPx(h)
  return fitInArea(
    {
      x: left,
      y: Math.max(openingPx(y), area.y + artPx(NEW_WINDOW_HEADROOM, px)),
      w: width,
      h: height,
    },
    area
  )
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
    ...openingRect(cfg),
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
  const step = CASCADE_OFFSET
  return {
    id: projectWindowId(project.slug),
    title: `${project.slug}.app`,
    icon: '◆',
    ...openingRect({
      x: step.baseX + openCount * step.stepX,
      y: step.baseY + openCount * step.stepY,
      ...PROJECT_WINDOW_SIZE,
    }),
    z,
    minimized: false,
    maximized: false,
    project,
  }
}
