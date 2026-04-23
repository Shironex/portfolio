import type { AppDescriptor, AppId } from './types'

export const APPS: AppDescriptor[] = [
  { id: 'projects', name: 'Projects', icon: '◆', color: '#39c5bb' },
  { id: 'about', name: 'About', icon: '♡', color: '#ff8ecf' },
  { id: 'skills', name: 'Monitor', icon: '✧', color: '#b79dff' },
  { id: 'contact', name: 'Contact', icon: '✉', color: '#ffd36e' },
  { id: 'readme', name: 'Readme', icon: '♪', color: '#9ef0c2' },
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

export const BOOT_LINES: string[] = [
  '[ ok ] shironex.os v4.2.6 — booting into portfolio mode',
  '[ ok ] mounting /dev/ideas  ............... done',
  '[ ok ] loading ~/.config/coffee.conf  ..... strong',
  '[ ok ] starting services: react, node, redis, worktrees',
  '[ ok ] opening daily driver: omniscribe',
  '[ ok ] available-for-freelance : true',
  '[ ok ] ready.',
]

export const QUIPS: string[] = [
  'move fast, leave footnotes',
  'small software, carefully made',
  'type-safe, sleep-safe',
  'ship it, then read the changelog',
]
