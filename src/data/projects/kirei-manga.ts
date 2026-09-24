import { Project } from '@/types'

export const kireiManga: Project = {
  id: 'kirei-manga',
  slug: 'kirei-manga',
  title: 'KireiManga',
  summary:
    'Local-first desktop manga reader: browses MangaDex, keeps a personal library in SQLite and reads CBZ or folder manga from disk. Archived at its last release.',
  description: [
    "KireiManga is a manga reader built around the way I read: half of it lives on MangaDex, the other half as CBZ files on disk, and both should open in the same reader with the same shortcuts. It wraps MangaDex's official API with Popular, Latest and Top Rated tabs and a filter-chip search, and pairs that with a local importer that detects flat, nested or single-series folder layouts.",
    'It is an Electron app with NestJS embedded in the main process, talking to a React, Vite and Tailwind renderer over Socket.IO. Data lives in better-sqlite3, and downloaded covers and pages are served over custom protocols so offline reading works the same as online.',
    'The last release was v0.2.0 "Local Library" in April 2026. I had started on a translation overlay for raw Japanese pages (an OpenCV bubble detector in C++ plus a manga-ocr sidecar), but I archived the project before it shipped and put the time into my other apps.',
  ],
  image: '/projects/kirei-manga/thumbnail.png',
  projectType: 'desktop',
  gallery: [
    {
      src: '/projects/kirei-manga/library.png',
      alt: 'KireiManga library grid',
      caption:
        'Unified library: MangaDex follows and local series side by side',
    },
    {
      src: '/projects/kirei-manga/series-detail.png',
      alt: 'KireiManga series detail',
      caption: 'Series detail with chapters, statuses, and offline cache state',
    },
    {
      src: '/projects/kirei-manga/import.png',
      alt: 'KireiManga local import flow',
      caption: 'Local import: pick a folder, the scanner handles the rest',
    },
    {
      src: '/projects/kirei-manga/reader.png',
      alt: 'KireiManga full-screen reader',
      caption:
        'Reader with single, double and webtoon modes and per-series RTL',
    },
  ],
  technologies: [
    'Electron',
    'NestJS',
    'React',
    'Vite',
    'TypeScript',
    'Tailwind CSS',
    'better-sqlite3',
    'Zustand',
    'Socket.IO',
  ],
  features: [
    'MangaDex browse: Popular, Latest and Top Rated tabs, filter chips, infinite search',
    'Unified library with 5 reading statuses across MangaDex and local series',
    'Local CBZ, ZIP and folder importer with a transactional scan and layout detection',
    'Full-screen reader with single, double and webtoon modes, per-series RTL and bookmarks',
    'Offline cache served via custom `kirei-cover://` and `kirei-page://` protocols',
    'Background new-chapter polling and on-demand rescan',
    'i18n: English and Polish',
  ],
  techDetails: {
    stack: [
      'Electron',
      'NestJS',
      'React',
      'Vite',
      'TypeScript',
      'Tailwind CSS v4',
      'better-sqlite3',
      'Zustand',
      'Radix UI',
      'Socket.IO',
      'node-stream-zip',
      'Astro (landing)',
      'electron-builder',
    ],
  },
  completedDate: 'April 2026',
  status: 'archived',
  duration: '2 months',
  demoUrl: 'https://kireimanga.app',
  githubUrl: 'https://github.com/Shironex/kirei-manga',
  featured: false,
}
