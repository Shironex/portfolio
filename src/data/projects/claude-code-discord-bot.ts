import { Project } from '@/types'

export const claudeCodeDiscordBot: Project = {
  id: 'claude-code-discord-bot',
  slug: 'claude-code-discord-bot',
  title: 'Claude Code Discord Bot',
  summary:
    'Experimental Discord bot that runs Claude Code on a GitHub repository through a workflow dispatch and opens a pull request with the result. Archived.',
  description: [
    'A small experiment in triggering agentic coding from chat. From a Discord slash command you picked a repository, wrote a prompt and optionally attached a screenshot of an error. The bot dispatched a GitHub Actions workflow that ran Claude Code on the repository and opened a pull request with the changes.',
    'I built the core in a few days with NestJS and Necord. The bot handles repository search with autocomplete, prompt forms with image attachments, and follows the workflow run so it can post status updates back to Discord. Each target repository needs a workflow template, and the repo ships two variants.',
    'It stayed an experiment with rough edges and is archived now. The monorepo setup (Turborepo, Changesets, commit linting) was the part I reused most in later projects.',
  ],
  projectType: 'api',
  gallery: [],
  technologies: [
    'NestJS',
    'Necord',
    'Discord.js',
    'TypeScript',
    'GitHub Actions',
    'Octokit',
  ],
  features: [
    'Slash commands that start a Claude Code run on a chosen repository',
    'Prompts with error screenshot attachments',
    'Claude Code runs inside GitHub Actions and opens a pull request',
    'Repository search with autocomplete',
    'Workflow status updates posted back to Discord',
    'Buttons to check status or run again',
    'Two workflow templates (one-step and two-step)',
    'GitHub token permission checks',
  ],
  techDetails: {
    stack: [
      'NestJS',
      'Necord',
      'Discord.js v14',
      'TypeScript',
      'Octokit',
      'GitHub Actions',
      'Turborepo',
      'pnpm workspaces',
      'Changesets',
      'Commitlint',
      'Husky',
    ],
  },
  status: 'archived',
  duration: 'A few days (core)',
  demoUrl: '',
  githubUrl: 'https://github.com/Shironex/claude-code-discord-bot',
  featured: false,
}
