import { Project } from '@/types'

export const shiroani: Project = {
  id: 'shiroani',
  slug: 'shiroani',
  title: 'ShiroAni',
  summary:
    'Personal anime browser and tracker. Search, track, and organize your watchlist with a built-in browser, Discord Rich Presence, and community bot.',
  description: [
    'ShiroAni is an Electron desktop app for anime fans who want a dedicated tool to browse, track, and organize their watchlist. It features a built-in browser for watching anime, Discord Rich Presence integration to share what you are currently watching, and a community Discord bot.',
    'The app is built with a full TypeScript stack: React and Zustand on the frontend, NestJS and Prisma on the backend, and discord.js powering the community bot. It is live and accessible at shiroani.app.',
    'ShiroAni started as a personal project to replace scattered browser tabs and tracking spreadsheets with a single, purpose-built application. Building a browser inside Electron taught a lot about session management, CSP headers, and the quirks of the webview tag.',
  ],
  projectType: 'desktop',
  gallery: [],
  technologies: [
    'Electron',
    'React',
    'TypeScript',
    'NestJS',
    'Prisma',
    'Zustand',
    'Discord.js',
    'Tailwind CSS',
    'Discord Rich Presence',
  ],
  features: [
    'Built-in anime browser with session management',
    'Watchlist tracking and organization',
    'Discord Rich Presence for current activity',
    'Community Discord bot integration',
    'Search and discover anime titles',
    'Cross-platform desktop application',
    'Local-first data with cloud sync capabilities',
  ],
  techDetails: {
    stack: [
      'Electron',
      'React',
      'TypeScript',
      'NestJS',
      'Prisma',
      'Zustand',
      'Discord.js',
      'Tailwind CSS',
      'Vite',
    ],
    architecture:
      'ShiroAni follows a monorepo structure with an Electron main process running a NestJS backend, a React renderer for the UI, and a separate Discord bot service. The built-in browser uses Electron webview with custom session management and CSP handling.',
    challenges: [
      {
        challenge: 'Embedding a browser inside Electron with proper isolation',
        solution:
          'Went through multiple iterations. Tried native overlays, DOM elements, and the deprecated webview tag. The "deprecated" approach turned out to be the most reliable for session management and CSP compliance.',
      },
      {
        challenge:
          'Real-time Discord Rich Presence synced with viewing activity',
        solution:
          'Built a bridge between the Electron main process and Discord RPC to update presence automatically when the user starts or stops watching anime',
      },
      {
        challenge: 'Managing community features alongside the desktop app',
        solution:
          'Separated the Discord bot into its own service within the monorepo, sharing types and utilities with the main app while running independently',
      },
    ],
  },
  inProgress: true,
  duration: 'Ongoing',
  demoUrl: 'https://shiroani.app',
  githubUrl: 'https://github.com/Shironex/shiroani',
  featured: true,
}
