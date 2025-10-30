import { Project } from '@/types'

export const ghLabelsCli: Project = {
  id: 'gh-labels-cli',
  slug: 'gh-labels-cli',
  title: 'GitHub Labels CLI',
  summary:
    'Command-line tool for managing labels in GitHub repositories with AI-powered suggestions using OpenAI.',
  description: [
    'GitHub Labels CLI is a powerful command-line tool designed to streamline label management across GitHub repositories. Built with TypeScript and the Octokit REST API, it provides an intuitive interface for organizing and maintaining repository labels at scale.',
    'The tool features an interactive mode that guides users through common label management tasks, including fetching repository lists, adding/removing labels, and creating custom label templates. Users can save label configurations and reuse them across multiple repositories, ensuring consistency across projects.',
    'One of the standout features is AI-powered label suggestions for pull requests. Using OpenAI API, the tool analyzes PR titles, descriptions, changed files, and code context to automatically suggest appropriate labels with confidence scores. It can also generate comprehensive PR descriptions, making it invaluable for large teams looking to automate workflow categorization and maintain consistent documentation.',
  ],
  projectType: 'cli',
  gallery: [],
  technologies: [
    'TypeScript',
    'Commander.js',
    'Octokit',
    'OpenAI API',
    'Inquirer',
    'Chalk',
    'Ora',
    'Zod',
    'Vitest',
    'VitePress',
    'Semantic Release',
    'Husky',
  ],
  features: [
    'Interactive mode for guided label management',
    'Fetch and list user repositories from GitHub',
    'Add and remove labels from repositories',
    'Create and save custom label templates',
    'Reuse label templates across multiple repositories',
    'AI-powered label suggestions for pull requests',
    'Automatic PR description generation using AI',
    'Analyze changed files and code context',
    'Confidence scoring for label suggestions',
    'Support for bulk label operations',
    'Colored terminal output with Chalk',
    'Loading spinners and progress indicators',
    'Type-safe validation with Zod',
    'Comprehensive testing with Vitest',
    'Full VitePress documentation',
    'Semantic versioning and automated releases',
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
      'VitePress',
      'tsup',
      'Semantic Release',
      'Husky',
      'Commitizen',
    ],
    architecture:
      'GitHub Labels CLI follows a modular command-based architecture using Commander.js for command routing and argument parsing. The tool integrates with GitHub API via Octokit for repository and label operations, and OpenAI API for intelligent label suggestions. Interactive prompts are powered by Inquirer, providing a user-friendly CLI experience. The codebase uses Zod for runtime validation of API responses and user input, ensuring type safety throughout the application.',
    challenges: [
      {
        challenge: 'Integrating AI for intelligent label suggestions',
        solution:
          'Implemented OpenAI API integration that analyzes PR context including title, description, changed files, and code diff to provide relevant label suggestions with confidence scores',
      },
      {
        challenge: 'Managing complex GitHub API interactions',
        solution:
          'Used Octokit REST client with proper error handling and rate limiting, implementing retry logic for failed requests and clear error messages for users',
      },
      {
        challenge: 'Creating reusable label templates',
        solution:
          'Built a template system that allows users to export labels from any repository and save them as JSON templates for quick application to other repositories',
      },
      {
        challenge: 'Providing excellent user experience in the terminal',
        solution:
          'Combined Inquirer for interactive prompts, Chalk for colored output, and Ora for loading indicators to create an intuitive and visually appealing CLI interface',
      },
    ],
  },
  completedDate: 'May 2025',
  duration: '2 months',
  demoUrl: 'https://shironex.github.io/gh-labels-cli/',
  githubUrl: 'https://github.com/Shironex/gh-labels-cli',
  featured: false,
}
