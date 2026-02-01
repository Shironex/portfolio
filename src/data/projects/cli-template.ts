import { Project } from '@/types'

export const cliTemplate: Project = {
  id: 'cli-template',
  slug: 'cli-template',
  title: 'CLI Template',
  summary:
    'A modern template for building command-line applications with TypeScript, Commander.js, and best practices.',
  description: [
    'CLI Template is a comprehensive starting point for developers looking to build professional command-line applications. Built with TypeScript and Commander.js, it provides a solid foundation with modern development tools and best practices baked in.',
    'The template comes pre-configured with everything needed for CLI development, including interactive mode support, table output formatting with cli-table3, progress bars with cli-progress, and comprehensive testing setup with Vitest. The project structure is designed to be intuitive and scalable.',
    'One of the standout features is the complete CI/CD setup with GitHub Actions for automated testing, code quality checks with CodeQL, and automated releases. The template also includes VitePress documentation, making it easy to create professional documentation for your CLI tools.',
  ],
  projectType: 'cli',
  gallery: [],
  technologies: [
    'TypeScript',
    'Commander.js',
    'Vitest',
    'ESLint',
    'Prettier',
    'VitePress',
    'cli-table3',
    'cli-progress',
    'tsup',
    'GitHub Actions',
  ],
  features: [
    'Modern TypeScript stack with strict type checking',
    'Commander.js for powerful CLI argument parsing',
    'Interactive mode with menu-driven interface',
    'Formatted table output with cli-table3',
    'Progress bars and visual indicators',
    'Comprehensive testing setup with Vitest',
    'Code quality tools (ESLint, Prettier)',
    'CI/CD pipeline with GitHub Actions',
    'Automated testing and releases',
    'VitePress documentation site',
    'Multiple example commands (hello, table, progress)',
    'Custom logger utility with colored output',
    'Error handling with custom error classes',
    'Package.json helper utilities',
    'Ready for global npm installation',
  ],
  techDetails: {
    stack: [
      'TypeScript',
      'Commander.js',
      'Vitest',
      'tsup',
      'ESLint',
      'Prettier',
      'VitePress',
      'cli-table3',
      'cli-progress',
      'inquirer',
    ],
    architecture:
      'CLI Template follows a modular architecture with clear separation of concerns. Commands are organized in the commands/ directory, utilities are isolated in utils/, and type definitions are centralized in types/. The build process uses tsup for fast, optimized bundling with support for both CommonJS and ES modules. The testing setup uses Vitest for unit testing with coverage reporting.',
    challenges: [
      {
        challenge: 'Creating a flexible and extensible command structure',
        solution:
          'Implemented a modular command system using Commander.js subcommands, allowing easy addition of new commands without modifying the core structure',
      },
      {
        challenge: 'Providing comprehensive examples for common CLI patterns',
        solution:
          'Built example commands for tables, progress bars, and interactive modes, demonstrating best practices for each pattern with multiple variations',
      },
      {
        challenge: 'Setting up automated CI/CD for CLI tools',
        solution:
          'Configured GitHub Actions workflows for testing, code quality checks with CodeQL, and automated semantic versioning releases',
      },
      {
        challenge: 'Making the template documentation-ready',
        solution:
          'Integrated VitePress for documentation with pre-configured guides, API references, and examples that can be easily customized',
      },
    ],
  },
  completedDate: 'April 2025',
  duration: '1 month',
  demoUrl: 'https://shironex.github.io/cli-template/',
  githubUrl: 'https://github.com/Shironex/cli-template',
  featured: false,
}
