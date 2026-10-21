import { countProjects } from '@/lib/utils/projects'

import { projectsData } from '@/data/projects-data'

import type { AppDescriptor, AppId, WindowState } from './types'

/*
 * Each app names an accent role rather than a colour, so the Lamp decides
 * what it paints. Its icon is drawn by `AppIcon` (src/components/pixel).
 */
export const APPS: AppDescriptor[] = [
  { id: 'projects', name: 'Projects', accent: 'primary' },
  { id: 'about', name: 'About', accent: 'bright' },
  { id: 'skills', name: 'Monitor', accent: 'deep' },
  { id: 'contact', name: 'Contact', accent: 'warm' },
  { id: 'writing', name: 'Writing', accent: 'warm-2' },
  { id: 'readme', name: 'Readme', accent: 'bright' },
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

/**
 * Text link inside running copy: the link colour, a 1 art px underline 2 art
 * px down, the heading colour on hover.
 */
export const INLINE_LINK_CLASS =
  'focus-ring text-(--link) underline decoration-(length:--px) underline-offset-[calc(2*var(--px))] hover:text-(--heading)'

/**
 * Small uppercase label over a section (Departure Mono, `text-label`): the
 * one eyebrow of the shell. Callers add the colour and the spacing.
 */
export const EYEBROW_CLASS = 'text-label uppercase'

/**
 * Small uppercase label of a badge or a legend. Callers add the colour.
 */
export const LABEL_CLASS = 'text-label uppercase'

/**
 * Loading placeholder: the stepped dither of the skeleton tile, held by the
 * automatic pauses and the Pause setting. Callers add the size.
 */
export const SKELETON_BAR = 'px-tile-skeleton ambient-loop'

/**
 * Long text: body size, about 66 characters a line (SPEC 2.3), in the face
 * the Readable text setting swaps (`text-prose`).
 */
export const PROSE_CLASS = 'text-prose max-w-[66ch] text-(--ink)'

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
