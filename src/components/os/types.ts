import type { LucideIcon } from 'lucide-react'

import type { Rect, SnapSide } from '@/lib/os/geometry'

import type { Project } from '@/types'

import type { AccentRole } from './accent-map'

export type AppId =
  'projects' | 'about' | 'skills' | 'contact' | 'writing' | 'readme'

export type WindowId = AppId | `project-${string}`

export interface WindowState {
  id: WindowId
  title: string
  icon: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  z: number
  minimized: boolean
  maximized: boolean
  /** Half of the desktop the window is snapped to, if any. */
  snapped?: SnapSide
  prevGeometry?: Rect
  project?: Project
}

/**
 * Level of a heading that is the page `h1` in one place and steps down to
 * `h2` where something else already is.
 */
export type HeadingLevel = 1 | 2

export interface AppDescriptor {
  id: AppId
  name: string
  icon: LucideIcon
  accent: AccentRole
}
