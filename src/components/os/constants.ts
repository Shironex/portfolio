import { Activity, BookOpen, FolderKanban, Mail, UserRound } from 'lucide-react'

import type { AppDescriptor, AppId } from './types'

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
      'Junior full-stack, Gdańsk, PL.',
      'Four years of TypeScript, mostly Electron and Next.js.',
    ],
  },
  {
    prompt: 'ls projects/ | wc -l',
    output: ['16 — two featured, five in-progress, eight shipped.'],
  },
  {
    prompt: 'cat availability.txt',
    output: ['Open to freelance now · full-time from Q2 2026.'],
  },
]
