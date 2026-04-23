import type { LucideIcon } from 'lucide-react'

import type { Project } from '@/types'

export type AppId = 'projects' | 'about' | 'skills' | 'contact' | 'readme'

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
  prevGeometry?: { x: number; y: number; w: number; h: number }
  project?: Project
}

export interface AppDescriptor {
  id: AppId
  name: string
  icon: LucideIcon
  color: string
}

export type WindowControl = 'min' | 'max' | 'close'
