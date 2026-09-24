import { Project } from '@/types'

export const cliTemplate: Project = {
  id: 'cli-template',
  slug: 'cli-template',
  title: 'CLI Template',
  summary:
    'Starter template for command-line apps in TypeScript with Commander.js, tests, docs and release automation. Archived.',
  description: [
    'CLI Template is a starting point for command-line apps written in TypeScript. It uses Commander.js for argument parsing and comes with an interactive mode, table output (cli-table3), progress bars (cli-progress), a colored logger and custom error classes.',
    'Testing runs on Vitest, the build on tsup, and GitHub Actions handles tests, CodeQL checks and releases. A VitePress site holds the documentation, and the example commands show how the pieces fit together.',
  ],
  projectType: 'cli',
  gallery: [],
  technologies: ['TypeScript', 'Commander.js', 'Vitest', 'tsup', 'VitePress'],
  features: [
    'Strict TypeScript setup',
    'Commander.js argument parsing',
    'Interactive, menu-driven mode',
    'Table output and progress bars',
    'Colored logger and custom error classes',
    'Vitest test setup',
    'GitHub Actions for tests, CodeQL and releases',
    'VitePress documentation site',
    'Ready for global npm installation',
  ],
  techDetails: {
    stack: [
      'TypeScript',
      'Commander.js',
      'Inquirer',
      'cli-table3',
      'cli-progress',
      'Vitest',
      'tsup',
      'ESLint',
      'Prettier',
      'VitePress',
      'GitHub Actions',
    ],
  },
  completedDate: 'April 2025',
  status: 'archived',
  duration: '1 month',
  demoUrl: 'https://shironex.github.io/cli-template/',
  githubUrl: 'https://github.com/Shironex/cli-template',
  featured: false,
}
