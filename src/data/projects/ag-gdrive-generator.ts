import { Project } from '@/types'

export const agGdriveGenerator: Project = {
  id: 'ag-gdrive-generator',
  slug: 'ag-gdrive-generator',
  title: 'AG GDrive Link Generator',
  summary:
    'Desktop Electron app for automating Google Drive video link generation with Discord formatting and automatic updates.',
  description: [
    'AG GDrive Link Generator is a specialized desktop application built for the AnimeGate community to streamline their video sharing workflow. The app automates the process of generating shareable Google Drive links for video files, formatting them for Discord, and managing episode sequences.',
    'Built with Electron and React 19, the application provides a modern, intuitive interface for browsing Google Drive folders, automatically detecting episode numbers from filenames, and generating properly formatted Discord messages with embedded video players. The app integrates with Google Service Accounts for secure, automated access to shared drives.',
    'One of the key features is the automatic update system using electron-updater and GitHub Releases. When a new version is pushed, all users receive the update automatically without manual distribution, making it easy to roll out improvements and fixes to the entire group instantly.',
  ],
  image: '/projects/gdrive-generator/thumbnail.png',
  projectType: 'desktop',
  gallery: [
    {
      src: '/projects/gdrive-generator/overview.png',
      alt: 'AG GDrive Generator Main Interface',
      caption: 'Main interface with folder browser and episode detection',
    },
    {
      src: '/projects/gdrive-generator/generate-links.png',
      alt: 'AG GDrive Generator Link Generation',
      caption:
        'Automatic link generation with Discord formatting copied to clipboard',
    },
    {
      src: '/projects/gdrive-generator/service-account.png',
      alt: 'AG GDrive Generator Link Generation 2',
      caption: 'Google service account settings',
    },
    {
      src: '/projects/gdrive-generator/settings.png',
      alt: 'AG GDrive Generator Settings',
      caption: 'Settings panel with theme and language options',
    },
  ],
  technologies: [
    'Electron',
    'React 19',
    'TypeScript',
    'Vite',
    'Tailwind CSS 4',
    'shadcn-ui',
    'TanStack Router',
    'TanStack Query',
    'Google APIs',
    'i18next',
    'electron-updater',
    'electron-store',
    'Vitest',
    'Playwright',
    'pnpm',
  ],
  features: [
    'Automatic episode number detection from filenames',
    'Google Drive folder browsing with Service Account integration',
    'Discord message formatting with embedded video players',
    'Copy links or full Discord messages to clipboard',
    'Gap detection in episode sequences',
    'Auto-fill assist for missing episodes',
    'Automatic updates via GitHub Releases',
    'Custom title bar with window controls',
    'Dark/Light theme support',
    'Bilingual interface (Polish & English)',
    'Persistent settings with electron-store',
    'Debug mode with separate console window',
    'Professional NSIS installer for Windows',
    'Type-safe file-based routing',
    'Comprehensive error handling',
  ],
  techDetails: {
    stack: [
      'Electron 38',
      'React 19',
      'TypeScript',
      'Vite',
      'Tailwind CSS 4',
      'shadcn-ui',
      'Radix UI',
      'TanStack Router',
      'TanStack Query',
      'Google APIs',
      'i18next',
      'electron-updater',
      'electron-store',
      'electron-window-state',
      'Zod',
      'Vitest',
      'Playwright',
    ],
    architecture:
      'AG GDrive Generator follows modern Electron architecture with context isolation and secure IPC communication. The main process handles Google API interactions via Service Accounts, while the renderer process provides a React-based UI. TanStack Router manages file-based routing with type safety, and TanStack Query handles data fetching and caching. The auto-update system uses electron-updater to check GitHub Releases and seamlessly install updates in the background.',
    challenges: [
      {
        challenge: 'Rapid migration from Next.js web app to Electron',
        solution:
          'Leveraged existing React components and business logic, adapting only the API layer from HTTP endpoints to IPC channels. Completed the full migration in just one day by focusing on the Electron-specific features like window management and auto-updates',
      },
      {
        challenge: 'Secure Google Drive integration without user OAuth',
        solution:
          'Implemented Google Service Account authentication, allowing the app to access shared drives without requiring each user to authenticate individually, while maintaining security through proper scope limitations',
      },
      {
        challenge: 'Automatic episode detection and gap handling',
        solution:
          'Built pattern matching system to extract episode numbers from various filename formats, with intelligent gap detection that alerts users to missing episodes and provides auto-fill suggestions',
      },
      {
        challenge: 'Seamless automatic updates for all users',
        solution:
          'Integrated electron-updater with GitHub Releases, enabling one-click publishing that automatically distributes updates to all users without manual intervention, significantly reducing maintenance overhead',
      },
    ],
  },
  completedDate: 'October 2025',
  duration: '1 day (port), 1 day (initial web version)',
  demoUrl: '#desktop-app',
  featured: false,
}
