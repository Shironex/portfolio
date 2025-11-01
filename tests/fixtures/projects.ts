import type { Project } from '@/types'

/**
 * Test fixtures for project data
 */

export const mockFeaturedProject: Project = {
  id: 'test-featured-project',
  slug: 'test-featured-project',
  title: 'Test Featured Project',
  summary: 'A test featured project for unit testing',
  description: [
    'This is a test project used for testing purposes.',
    'It contains all the required fields for a featured project.',
  ],
  image: '/projects/test-project/hero.png',
  projectType: 'web',
  gallery: [
    {
      src: '/projects/test-project/screenshot-1.png',
      alt: 'Screenshot 1',
      caption: 'Main dashboard view',
    },
    {
      src: '/projects/test-project/screenshot-2.png',
      alt: 'Screenshot 2',
      caption: 'User settings page',
    },
  ],
  technologies: ['Next.js', 'TypeScript', 'TailwindCSS', 'Vitest'],
  features: [
    'Server-side rendering',
    'Type-safe development',
    'Responsive design',
    'Comprehensive testing',
  ],
  techDetails: {
    stack: ['Next.js 15', 'React 19', 'TypeScript 5'],
    architecture: 'App Router with Server Components',
    challenges: [
      {
        challenge: 'Performance optimization',
        solution: 'Implemented code splitting and lazy loading',
      },
      {
        challenge: 'Type safety',
        solution: 'Used strict TypeScript configuration',
      },
    ],
  },
  completedDate: '2024-01-15',
  startDate: '2023-12-01',
  inProgress: false,
  duration: '1.5 months',
  demoUrl: 'https://test-project.example.com',
  githubUrl: 'https://github.com/test/test-project',
  featured: true,
}

export const mockInProgressProject: Project = {
  id: 'test-in-progress-project',
  slug: 'test-in-progress-project',
  title: 'Test In-Progress Project',
  summary: 'A test project currently in development',
  description: ['This project is still being developed.'],
  projectType: 'cli',
  gallery: [],
  technologies: ['Node.js', 'TypeScript'],
  features: ['Command-line interface', 'Plugin system'],
  techDetails: {
    stack: ['Node.js 22', 'TypeScript'],
    challenges: [
      {
        challenge: 'Plugin architecture',
        solution: 'Designed extensible plugin system',
      },
    ],
  },
  startDate: '2024-02-01',
  inProgress: true,
  duration: 'Ongoing',
  demoUrl: '',
  githubUrl: 'https://github.com/test/in-progress-project',
  featured: false,
}

export const mockOtherProject: Project = {
  id: 'test-other-project',
  slug: 'test-other-project',
  title: 'Test Other Project',
  summary: 'A regular test project',
  description: ['A standard project for testing.'],
  projectType: 'library',
  gallery: [],
  technologies: ['TypeScript', 'Vitest'],
  features: ['Type definitions', 'Comprehensive tests'],
  techDetails: {
    stack: ['TypeScript'],
    challenges: [],
  },
  completedDate: '2023-11-20',
  startDate: '2023-11-01',
  inProgress: false,
  duration: '3 weeks',
  demoUrl: '',
  githubUrl: 'https://github.com/test/other-project',
  featured: false,
}

export const mockProjects: Project[] = [
  mockFeaturedProject,
  mockInProgressProject,
  mockOtherProject,
]

export const mockProjectsData = {
  featured: [mockFeaturedProject],
  inProgress: [mockInProgressProject],
  other: [mockOtherProject],
  all: mockProjects,
}
