import { Project } from '@/types'

export const kodama: Project = {
  id: 'kodama',
  slug: 'kodama',
  title: 'Kodama',
  summary:
    'A 2D game: restore the echoes of a silent world. Built with Electron as a side project to explore game development.',
  description: [
    'Kodama is a game built as a personal exploration into game development. "Restore the echoes of a silent world" is the tagline, hinting at the atmospheric, narrative-driven experience the project aims to create.',
    'The project serves a dual purpose: learning game development fundamentals (physics, rendering, state machines, asset pipelines) while having a creative outlet that prevents burnout from day-to-day web development work.',
  ],
  projectType: 'desktop',
  gallery: [],
  technologies: ['TypeScript', 'Electron', 'Game Development', '2D Rendering'],
  features: [
    'Atmospheric 2D game world',
    'Narrative-driven gameplay',
    'Custom rendering pipeline',
    'Desktop application via Electron',
  ],
  techDetails: {
    stack: ['TypeScript', 'Electron', '2D Game Engine'],
  },
  inProgress: true,
  duration: 'Ongoing',
  demoUrl: '#in-development',
  featured: false,
}
