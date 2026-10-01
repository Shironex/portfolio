import {
  Activity,
  BookOpen,
  Diamond,
  FolderKanban,
  Mail,
  PenLine,
  UserRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { countProjects } from '@/lib/utils/projects'

import { projectsData } from '@/data/projects-data'

import type { AppDescriptor, AppId, WindowId, WindowState } from './types'

/*
 * Each app names an accent role rather than a colour, so the active palette
 * decides what it paints. Icons are from lucide-react (instead of single
 * Unicode glyphs) so they read as intentional instead of placeholder-y.
 */
export const APPS: AppDescriptor[] = [
  { id: 'projects', name: 'Projects', icon: FolderKanban, accent: 'primary' },
  { id: 'about', name: 'About', icon: UserRound, accent: 'bright' },
  { id: 'skills', name: 'Monitor', icon: Activity, accent: 'deep' },
  { id: 'contact', name: 'Contact', icon: Mail, accent: 'warm' },
  { id: 'writing', name: 'Writing', icon: PenLine, accent: 'warm-2' },
  { id: 'readme', name: 'Readme', icon: BookOpen, accent: 'bright' },
]

export function isAppId(value: string): value is AppId {
  return APPS.some((app) => app.id === value)
}

/** Name of every control that copies a deep link to a window. */
export const COPY_LINK_LABEL = 'Copy link to this window'

/** Text link inside running copy. */
export const INLINE_LINK_CLASS =
  'focus-ring text-miku-2 rounded-sm underline underline-offset-2'

/** Pulsing placeholder fill; callers add the size and radius. */
export const SKELETON_BAR =
  'bg-rule animate-pulse-slow motion-reduce:animate-none'

/**
 * Lucide icon for a window's title bar: the app's own icon, or Diamond for
 * project windows. Keeps title bars in the same icon system as the taskbar,
 * start menu, and desktop instead of the old Unicode glyphs.
 */
export function windowIconFor(id: WindowId): LucideIcon {
  return APPS.find((app) => app.id === id)?.icon ?? Diamond
}

/** What a window is called out loud: the app name or the project title. */
export function windowNameFor(win: WindowState): string {
  return (
    win.project?.title ??
    APPS.find((app) => app.id === win.id)?.name ??
    win.title
  )
}

export const APP_WINDOW_DEFAULTS: Record<
  AppId,
  { title: string; icon: string; x: number; y: number; w: number; h: number }
> = {
  projects: { title: 'projects.app', icon: '▦', x: 120, y: 90, w: 900, h: 620 },
  about: { title: 'about.me', icon: '◌', x: 180, y: 120, w: 820, h: 580 },
  skills: { title: 'monitor.sys', icon: '▤', x: 220, y: 130, w: 780, h: 560 },
  contact: { title: 'contact.app', icon: '✉', x: 260, y: 110, w: 820, h: 580 },
  writing: { title: 'writing.rss', icon: '✎', x: 340, y: 100, w: 720, h: 600 },
  readme: { title: 'readme.md', icon: '¶', x: 300, y: 150, w: 640, h: 500 },
}

/*
 * Three short, factual lines shown in the TerminalPanel. Not a fake boot
 * sequence, just a real-enough shell transcript that surfaces concrete
 * claims about the work, location, and availability.
 */
const counts = countProjects(projectsData)

export const TERMINAL_BLOCKS: Array<{ prompt: string; output: string[] }> = [
  {
    prompt: 'cat about.md',
    output: [
      'Full-stack developer: TypeScript and Rust.',
      'Remote from Poland, CET (UTC+1). English C1.',
    ],
  },
  {
    prompt: 'ls projects/ | wc -l',
    output: [
      `${counts.total}: ${counts.shipped} shipped, ${counts['in-progress']} in progress, ${counts.archived} archived.`,
    ],
  },
  {
    prompt: 'cat availability.txt',
    output: ['Open to full-time remote roles and contracts or MVPs.'],
  },
]
