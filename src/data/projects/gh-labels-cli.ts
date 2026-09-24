import { Project } from '@/types'

export const ghLabelsCli: Project = {
  id: 'gh-labels-cli',
  slug: 'gh-labels-cli',
  title: 'GitHub Labels CLI',
  summary:
    'Command-line tool for managing GitHub labels across repositories, with AI label suggestions for pull requests. Archived.',
  description: [
    'GitHub Labels CLI manages labels across GitHub repositories from the terminal. An interactive mode walks through listing repositories, adding and removing labels, and saving label sets as templates that can be applied to other repositories.',
    'It can also suggest labels for a pull request. The tool sends the title, description and changed files to the OpenAI API and returns suggested labels with a confidence score, and it can draft a pull request description the same way.',
  ],
  projectType: 'cli',
  gallery: [],
  technologies: ['TypeScript', 'Commander.js', 'Octokit', 'OpenAI API', 'Zod'],
  features: [
    'Interactive mode for common label tasks',
    'List repositories and add or remove labels',
    'Reusable label templates across repositories',
    'Bulk label operations',
    'AI label suggestions for pull requests with confidence scores',
    'AI-drafted pull request descriptions',
    'VitePress documentation and automated releases',
  ],
  techDetails: {
    stack: [
      'TypeScript',
      'Commander.js',
      '@octokit/rest',
      'OpenAI API',
      'Inquirer',
      'Chalk',
      'Ora',
      'Zod',
      'Vitest',
      'tsup',
      'VitePress',
      'Semantic Release',
      'Husky',
      'Commitizen',
    ],
  },
  completedDate: 'May 2025',
  status: 'archived',
  duration: '2 months',
  demoUrl: 'https://shironex.github.io/gh-labels-cli/',
  githubUrl: 'https://github.com/Shironex/gh-labels-cli',
  featured: false,
}
