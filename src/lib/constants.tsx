import { NavItem } from '@/types'

export const APP_ROUTES = {
  toHome: '/',
  toAbout: '/about',
  toProjects: '/projects',
  toContact: '/contact',
} as const

export const GITHUB_URL = 'https://github.com/shironex'
export const AUTHOR_NAME = 'Shironex'
export const EMAIL_SENDER = '"shironex" <noreply@shirone.dev>'
export const EMAIL_CONTACT = 'support@shirone.dev'

// Navigation items with translation keys instead of hardcoded names
export const NAV_ITEMS: NavItem[] = [
  { name: 'nav.home', path: '/' },
  { name: 'nav.about', path: '/about' },
  { name: 'nav.projects', path: '/projects' },
  { name: 'nav.contact', path: '/contact' },
]
