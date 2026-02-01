import { Project } from '@/types'

export const claudeCodeDiscordBot: Project = {
  id: 'claude-code-discord-bot',
  slug: 'claude-code-discord-bot',
  title: 'Claude Code Discord Bot',
  summary:
    'Discord bot that executes Claude Code on GitHub repositories via workflow dispatch, creating automated PRs from Discord prompts and images.',
  description: [
    'Claude Code Discord Bot is a fun experimental project that enables agentic coding directly from Discord. Users can trigger Claude Code to execute tasks on any repository by sending prompts and error screenshots through Discord slash commands. The bot dispatches GitHub Actions workflows that run Claude Code autonomously, implementing fixes, adding features, or refactoring code based on the prompt, then automatically creating pull requests with the changes.',
    'Built with NestJS and Necord in just a couple of days, the bot provides an interactive Discord interface for repository search, prompt submission with image attachments, and real-time workflow monitoring. It uses a custom GitHub Actions workflow template that users add to their repositories, which handles the Claude Code execution and PR creation. The entire process happens automatically - from Discord message to GitHub PR - without manual intervention.',
    'While the project has some rough edges and unfinished features, it demonstrates the potential of agentic coding workflows triggered through chat interfaces. The Turborepo monorepo structure with automated CI/CD using Changesets shows solid engineering practices, making it a good foundation for future development into a more polished tool for Discord-based development workflows.',
  ],
  projectType: 'api',
  gallery: [],
  technologies: [
    'NestJS',
    'Necord',
    'Discord.js',
    'TypeScript',
    'Turborepo',
    'pnpm',
    'GitHub API',
    'Octokit',
    'GitHub Actions',
    'Changesets',
    'ESLint',
    'Prettier',
  ],
  features: [
    'Agentic coding triggered from Discord slash commands',
    'Prompt submission with error screenshot attachments',
    'Automated Claude Code execution via GitHub Actions',
    'Autonomous PR creation with implemented changes',
    'Repository search with autocomplete functionality',
    'Real-time workflow status monitoring and updates',
    'Custom workflow template for Claude Code integration',
    'Session management across Discord interactions',
    'Interactive buttons for status checks and re-triggering',
    'Multiple workflow template support (two-step, one-step)',
    'Automated CI/CD with commit validation',
    'Changeset-based versioning and releases',
    'GitHub token permission validation',
    'Service-specific logging system',
    'Modal-based forms for complex interactions',
  ],
  techDetails: {
    stack: [
      'NestJS',
      'Necord (Discord.js wrapper)',
      'Discord.js v14',
      'TypeScript',
      'Turborepo',
      'pnpm workspaces',
      'Octokit REST API',
      'GitHub Actions',
      'Changesets',
      'Commitlint',
      'Husky',
      'ESLint',
      'Prettier',
    ],
    architecture:
      'Claude Code Discord Bot follows NestJS modular architecture with clear separation between commands, interactions, and services. The bot uses Necord for type-safe Discord.js integration, with dedicated modules for slash commands, button interactions, modal submissions, and select menu handlers. Services handle business logic including GitHub API interactions via Octokit, workflow dispatching, and session management. The Turborepo monorepo structure enables future package sharing and scalability. Automated CI/CD pipelines handle quality checks, versioning, and releases using changesets and GitHub Actions.',
    challenges: [
      {
        challenge: 'Building agentic coding workflow from Discord to GitHub',
        solution:
          'Created end-to-end automation that dispatches GitHub Actions workflows with user prompts and images, allowing Claude Code to autonomously implement changes and create PRs without manual repository access',
      },
      {
        challenge: 'Managing Discord interaction state across async workflows',
        solution:
          'Implemented session management and modal-based forms to maintain context across multi-step Discord interactions, with real-time polling to update users on long-running Claude Code execution status',
      },
      {
        challenge: 'Rapid prototyping with production-ready patterns',
        solution:
          "Built the core functionality in a couple of days while maintaining clean architecture with NestJS modules, automated CI/CD with Changesets, and comprehensive error handling - proving fast iteration doesn't require sacrificing code quality",
      },
      {
        challenge: 'Making Claude Code accessible via chat interface',
        solution:
          'Designed custom GitHub Actions workflow templates that users can easily add to repositories, enabling Claude Code execution through simple Discord commands with prompt and image support',
      },
    ],
  },
  inProgress: false,
  duration: 'Few days (core)',
  demoUrl: '',
  githubUrl: 'https://github.com/Shironex/claude-code-discord-bot',
  featured: false,
}
