import {
  Activity,
  BookOpen,
  Diamond,
  FolderKanban,
  Mail,
  UserRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import type { AppDescriptor, AppId, WindowId } from './types'

/*
 * App accents collapse to a two-tone teal + ochre system. Icons are from
 * lucide-react (instead of single Unicode glyphs) so they read as
 * intentional instead of placeholder-y.
 */
export const APPS: AppDescriptor[] = [
  { id: 'projects', name: 'Projects', icon: FolderKanban, color: '#0f7c74' },
  { id: 'about', name: 'About', icon: UserRound, color: '#1ca59b' },
  { id: 'skills', name: 'Monitor', icon: Activity, color: '#0a5954' },
  { id: 'contact', name: 'Contact', icon: Mail, color: '#b87a1e' },
  { id: 'readme', name: 'Readme', icon: BookOpen, color: '#1ca59b' },
]

/**
 * Lucide icon for a window's title bar — the app's own icon, or Diamond for
 * project windows. Keeps title bars in the same icon system as the taskbar,
 * start menu, and desktop instead of the old Unicode glyphs.
 */
export function windowIconFor(id: WindowId): LucideIcon {
  return APPS.find((app) => app.id === id)?.icon ?? Diamond
}

export const APP_WINDOW_DEFAULTS: Record<
  AppId,
  { title: string; icon: string; x: number; y: number; w: number; h: number }
> = {
  projects: { title: 'projects.app', icon: '▦', x: 120, y: 90, w: 900, h: 620 },
  about: { title: 'about.me', icon: '◌', x: 180, y: 120, w: 820, h: 580 },
  skills: { title: 'monitor.sys', icon: '▤', x: 220, y: 130, w: 780, h: 560 },
  contact: { title: 'contact.app', icon: '✉', x: 260, y: 110, w: 820, h: 580 },
  readme: { title: 'readme.md', icon: '¶', x: 300, y: 150, w: 640, h: 500 },
}

/*
 * Three short, factual lines shown in the TerminalPanel. Not a fake boot
 * sequence — just a real-enough shell transcript that surfaces concrete
 * claims about the work, location, and availability.
 */
export const TERMINAL_BLOCKS: Array<{ prompt: string; output: string[] }> = [
  {
    prompt: 'cat about.md',
    output: [
      'Full-stack developer, Poland. Remote-first.',
      'Four years of TypeScript, mostly Electron and Next.js.',
    ],
  },
  {
    prompt: 'ls projects/ | wc -l',
    output: ['16: two featured, five in-progress, eight shipped.'],
  },
  {
    prompt: 'cat availability.txt',
    output: ['Open to full-time (remote) and freelance work.'],
  },
]
