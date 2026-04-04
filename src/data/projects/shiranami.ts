import { Project } from '@/types'

export const shiranami: Project = {
  id: 'shiranami',
  slug: 'shiranami',
  title: 'Shiranami',
  summary:
    'A local-first music player for your own library. Like Spotify, but for files you already have. Live at shiranami.app.',
  description: [
    'Shiranami is a local-first music player designed for people who have their own music library and want a clean, modern interface to enjoy it. Instead of relying on streaming services, Shiranami works with the music files you already own.',
    'The app provides a softer, more personal listening experience. No algorithms, no ads, no subscriptions. Just your music, organized the way you want it, with a beautiful interface built for the experience of listening.',
    'Shiranami is live at shiranami.app. Built to scratch my own itch, shared with anyone who has the same need.',
  ],
  projectType: 'desktop',
  gallery: [],
  technologies: [
    'TypeScript',
    'React',
    'Electron',
    'Tailwind CSS',
    'Local Storage',
    'Audio API',
  ],
  features: [
    'Local-first music library management',
    'Modern, clean playback interface',
    'Music file import and organization',
    'No cloud dependency or streaming required',
    'Cross-platform desktop application',
    'Lightweight and fast performance',
  ],
  techDetails: {
    stack: ['TypeScript', 'React', 'Electron', 'Tailwind CSS', 'Web Audio API'],
    architecture:
      'Shiranami is built as an Electron desktop application with a React-based UI. All music data is stored locally. No cloud services or accounts required. The audio pipeline uses the Web Audio API for playback with custom controls and visualization.',
    challenges: [
      {
        challenge: 'Handling large music libraries without performance issues',
        solution:
          'Implemented efficient indexing and virtualized list rendering to handle libraries with thousands of tracks smoothly',
      },
      {
        challenge: 'Providing a polished listening experience',
        solution:
          'Focused on UI details: smooth transitions, responsive controls, and a visual design that makes listening feel intentional rather than utilitarian',
      },
    ],
  },
  inProgress: true,
  duration: 'Ongoing',
  demoUrl: 'https://shiranami.app',
  githubUrl: 'https://github.com/Shironex/shiranami',
  featured: false,
}
