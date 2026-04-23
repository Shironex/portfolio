import { Project } from '@/types'

export const shiroku: Project = {
  id: 'shiroku',
  slug: 'shiroku',
  title: 'Shiroku',
  summary:
    'A local-first note-taking and planner app with rich text editing, notebooks, tags, daily planning, and full-text search. All stored in SQLite.',
  description: [
    'Shiroku is a local-first notes and planner application for developers and power users who want full control over their data. It features a rich text editor, notebook organization, tagging, daily planning, and full-text search. Everything is backed by a local SQLite database.',
    'No cloud accounts, no tracking, no subscriptions. Everything stays on your machine. The app is built for people who value privacy and ownership of their personal knowledge base.',
  ],
  projectType: 'desktop',
  gallery: [],
  technologies: [
    'TypeScript',
    'React',
    'SQLite',
    'Rich Text Editor',
    'Electron',
    'Tailwind CSS',
  ],
  features: [
    'Rich text editor with formatting support',
    'Notebook-based organization',
    'Tag system for cross-notebook categorization',
    'Daily planner view',
    'Full-text search across all notes',
    'Local SQLite storage, no cloud required',
    'Privacy-first, no tracking or accounts',
  ],
  techDetails: {
    stack: ['TypeScript', 'React', 'Electron', 'SQLite', 'Tailwind CSS'],
  },
  inProgress: true,
  duration: 'Ongoing',
  demoUrl: '#in-development',
  featured: false,
}
