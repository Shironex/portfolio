import { Project } from '@/types'

export const kireiManga: Project = {
  id: 'kirei-manga',
  slug: 'kirei-manga',
  title: 'KireiManga',
  summary:
    'Local-first desktop manga reader for the CBZ files on disk and the series followed on MangaDex. Being rebuilt from scratch in Rust and Tauri 2 after a first Electron version.',
  description: [
    'KireiManga is a manga reader built around the way I read: half of it lives on MangaDex, the other half as CBZ files on disk, and both should open in the same reader with the same shortcuts, instantly and without getting in the way.',
    'The first version was an Electron app with NestJS embedded in the main process, talking to a React renderer over Socket.IO, with its data in better-sqlite3. Its last release was v0.2.0 "Local Library" in April 2026, and the screenshots here are from it.',
    'I am now rebuilding it from scratch with Tauri 2, Rust and React, towards a single 1.0 release. Archives (CBZ, ZIP, CBR) and image folders are read in place and streamed page by page, never extracted to disk, the catalogue lives in a local SQLite database, and MangaDex, offline downloads and AniList tracking sit on the same reader and library. There is no telemetry and there are no scraper sources: only local files and official APIs.',
  ],
  image: '/projects/kirei-manga/library.png',
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
  technologies: ['Tauri', 'Rust', 'React', 'TypeScript', 'SQLite'],
  features: [
    'CBZ, ZIP, CBR and image folders read in place and streamed, never extracted',
    'Single, double and webtoon reader modes, left to right or right to left, with remappable keys',
    'MangaDex browse and search, follows and a grouped feed of new chapters',
    'Resumable offline downloads saved as CBZ into a library folder the app watches',
    'AniList progress tracking, queued while offline',
    'Collections, tags, smart filters and a command palette',
    'Reading stats, library backups and a portable mode',
    'No telemetry and no scraper sources: local files and official APIs only',
  ],
  techDetails: {
    stack: [
      'Tauri 2',
      'Rust',
      'React',
      'TypeScript',
      'SQLite',
      'Astro (landing)',
      'MangaDex API',
      'AniList API',
    ],
  },
  status: 'in-progress',
  duration: 'Ongoing (rebuild)',
  demoUrl: '',
  githubUrl: 'https://github.com/Shironex/kirei-manga',
  featured: false,
}
