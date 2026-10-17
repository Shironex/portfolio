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

/** `aria-keyshortcuts` of every control that opens the command palette. */
export const CMD_PALETTE_SHORTCUT = 'Control+K Meta+K'

/** Height and top padding of a mobile top bar, status-bar inset included. */
export const MOBILE_BAR_CLASS =
  'h-[calc(3rem+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]'

/** Side padding of mobile content: 1rem, or the safe-area inset when larger. */
export const MOBILE_GUTTER_CLASS =
  'pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))]'

/** Text link inside running copy: a 1 art px underline, 2 art px down. */
export const INLINE_LINK_CLASS =
  'focus-ring text-miku-2-ink underline decoration-(length:--px) underline-offset-[calc(2*var(--px))]'

/**
 * Small uppercase mono label over a section: the one eyebrow of the shell.
 * Callers add the colour and the spacing.
 */
export const EYEBROW_CLASS = 'font-mono text-[11px] font-normal uppercase'

/**
 * Small uppercase mono label of a badge or a legend, tighter than the eyebrow.
 * Callers add the colour.
 */
export const LABEL_CLASS = 'font-mono text-[11px] uppercase'

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

/** Where each app window opens and how big, in art px (SPEC 2.4). */
export const APP_WINDOW_DEFAULTS: Record<
  AppId,
  { title: string; icon: string; x: number; y: number; w: number; h: number }
> = {
  projects: { title: 'projects.app', icon: '▦', x: 60, y: 45, w: 450, h: 310 },
  about: { title: 'about.me', icon: '◌', x: 90, y: 60, w: 410, h: 290 },
  skills: { title: 'monitor.sys', icon: '▤', x: 110, y: 65, w: 390, h: 280 },
  contact: { title: 'contact.app', icon: '✉', x: 130, y: 55, w: 410, h: 290 },
  writing: { title: 'writing.rss', icon: '✎', x: 170, y: 50, w: 360, h: 300 },
  readme: { title: 'readme.md', icon: '¶', x: 150, y: 75, w: 320, h: 250 },
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
