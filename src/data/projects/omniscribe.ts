import { Project } from '@/types'

export const omniscribe: Project = {
  id: 'omniscribe',
  slug: 'omniscribe',
  title: 'Omniscribe',
  summary:
    'Desktop app for running and managing up to 12 AI coding assistant sessions in parallel, with per-session terminals, git worktrees, and MCP configs.',
  description: [
    'Omniscribe is a desktop application built for developers who use AI coding assistants as a core part of their workflow. It allows running up to 12 concurrent AI sessions, each in its own isolated terminal with dedicated git worktrees and MCP (Model Context Protocol) configurations.',
    'The app solves the friction of juggling multiple Claude Code sessions across different terminal windows. Each session gets its own workspace with full terminal integration, task tracking, and status reporting. Everything is visible from a single unified interface.',
    'Built as a daily driver tool that I use every day for my own development work. Omniscribe demonstrates deep integration between Electron, terminal emulation, git worktree management, and AI assistant orchestration.',
  ],
  projectType: 'desktop',
  gallery: [],
  technologies: [
    'Electron',
    'TypeScript',
    'React',
    'NestJS',
    'Socket.io',
    'Git Worktrees',
    'MCP Protocol',
    'Terminal Emulation',
    'Zustand',
    'Tailwind CSS',
  ],
  features: [
    'Run up to 12 AI coding sessions simultaneously',
    'Per-session terminal emulation with full shell access',
    'Git worktree isolation for each session',
    'MCP configuration management per session',
    'Real-time task and status tracking across sessions',
    'Unified interface for managing all active sessions',
    'Session-specific context and history',
    'Cross-platform support (macOS, Windows, Linux)',
  ],
  techDetails: {
    stack: [
      'Electron',
      'TypeScript',
      'React',
      'NestJS',
      'Socket.io',
      'Zustand',
      'Tailwind CSS',
      'Git Worktrees',
      'MCP Protocol',
      'Terminal PTY',
    ],
    architecture:
      'Omniscribe uses an Electron shell with a NestJS backend running in the main process, communicating with a React frontend via Socket.io. Each AI session is managed as an isolated workspace with its own terminal PTY, git worktree, and MCP configuration. The architecture mirrors the patterns used in GitChorus but scaled to handle 12 concurrent sessions.',
    challenges: [
      {
        challenge: 'Running 12 terminal sessions without freezing the UI',
        solution:
          'Implemented buffered output handling and virtualized rendering to keep the interface responsive even with 12 terminals generating output simultaneously',
      },
      {
        challenge: 'Isolating git state across concurrent sessions',
        solution:
          'Leveraged git worktrees to give each session its own working directory and branch, preventing conflicts between parallel coding tasks',
      },
      {
        challenge: 'Managing MCP configurations per session',
        solution:
          'Built a configuration layer that allows each session to have its own MCP server setup, enabling different tool configurations for different tasks',
      },
    ],
  },
  duration: 'Ongoing',
  demoUrl: '#desktop-app',
  githubUrl: 'https://github.com/Shironex/omniscribe',
  featured: true,
}
