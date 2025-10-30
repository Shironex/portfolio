import { Project } from '@/types'

export const envVault: Project = {
  id: 'env-vault',
  slug: 'env-vault',
  title: 'ENV Vault',
  summary:
    'A desktop application built with Tauri for managing and organizing environment variables across multiple development projects.',
  description: [
    'ENV Vault is a desktop application designed to streamline the management of environment variables during development. Built with Tauri, React, and TypeScript, it provides a centralized location to store, organize, and quickly access environment variables from multiple projects.',
    'The application addresses the common developer pain point of managing numerous .env files across different projects. Instead of switching between files in your code editor, ENV Vault allows you to quickly search and copy environment variables with an intuitive interface.',
    'Features include project-based organization, powerful search functionality for both project names and variable names, and quick clipboard integration for seamless workflow integration. The application runs natively on desktop platforms while maintaining a modern web-based UI.',
  ],
  image: '/projects/env-vault/thumbnail.png',
  projectType: 'desktop',
  gallery: [
    {
      src: '/projects/env-vault/home-screen.png',
      alt: 'ENV Vault Home Screen',
      caption: 'Main interface showing project overview and navigation',
    },
    {
      src: '/projects/env-vault/overview.png',
      alt: 'ENV Vault Project Overview',
      caption: 'Project list view with environment variable counts',
    },
    {
      src: '/projects/env-vault/example-env-screen.png',
      alt: 'ENV Vault Environment Variables',
      caption: 'Environment variables display for a selected project',
    },
    {
      src: '/projects/env-vault/search-input-project.png',
      alt: 'ENV Vault Project Search',
      caption: 'Search functionality for finding specific projects',
    },
    {
      src: '/projects/env-vault/search-input-variable.png',
      alt: 'ENV Vault Variable Search',
      caption: 'Variable search with real-time filtering',
    },
  ],
  technologies: [
    'Tauri',
    'React',
    'TypeScript',
    'Vite',
    'Tailwind CSS',
    'Radix UI',
    'Lucide React',
    'React Virtual',
    'UUID',
  ],
  features: [
    'Native desktop application with modern web UI',
    'Project-based environment variable organization',
    'Powerful search functionality for projects and variables',
    'Quick clipboard integration for copying variables',
    'File system integration for importing .env files',
    'Lightweight and fast performance with Tauri',
    'Cross-platform compatibility (Windows, macOS, Linux)',
    'Local data storage with SQLite integration',
    'Context menu support for enhanced productivity',
    'Virtualized lists for handling large datasets',
  ],
  techDetails: {
    stack: [
      'Tauri 2.0',
      'React 19',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Radix UI Primitives',
      'Lucide React Icons',
      'TanStack React Virtual',
      'UUID Generation',
      'SQLite Database',
    ],
    architecture:
      'ENV Vault follows a modern desktop application architecture using Tauri as the native wrapper around a React-based frontend. The application uses SQLite for local data persistence, ensuring fast access to environment variables without requiring network connectivity. The UI is built with Radix UI primitives for accessibility and Tailwind CSS for styling.',
    challenges: [
      {
        challenge:
          'Managing large numbers of environment variables efficiently',
        solution:
          'Implemented TanStack React Virtual for virtualized rendering of large lists, ensuring smooth performance even with hundreds of projects and variables',
      },
      {
        challenge: 'Providing fast search across projects and variables',
        solution:
          'Built real-time search functionality with debounced input and efficient filtering algorithms to quickly locate specific environment variables',
      },
      {
        challenge: 'Seamless integration with development workflow',
        solution:
          'Added clipboard integration and context menus for quick copying of variables, reducing the need to switch between applications during development',
      },
      {
        challenge: 'Cross-platform compatibility and native performance',
        solution:
          'Utilized Tauri framework to create a lightweight native application that works consistently across Windows, macOS, and Linux while maintaining web development practices',
      },
    ],
  },
  completedDate: 'September 2025',
  duration: '3 months',
  demoUrl: '#desktop-app',
  featured: false,
}
