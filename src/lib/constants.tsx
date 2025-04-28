import { NavItem } from '@/types'

export const APP_ROUTES = {
  toHome: '/',
  toAbout: '/about',
  toProjects: '/projects',
  toArticles: '/articles',
  toContact: '/contact',
} as const

export const GITHUB_URL = 'https://github.com/shironex'
export const AUTHOR_NAME = 'Shironex'
export const EMAIL_SENDER = '"shironex" <noreply@shirone.dev>'
export const EMAIL_CONTACT = 'support@shirone.dev'
export const NAV_ITEMS: NavItem[] = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Articles', path: '/articles' },
  { name: 'Contact', path: '/contact' },
]
