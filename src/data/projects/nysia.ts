import { Project } from '@/types'

export const nysia: Project = {
  id: 'nysia',
  slug: 'nysia',
  title: 'Nysia',
  summary:
    'Terminal-first development environment for coding agents, built with Rust and Tauri. A headless daemon owns the terminals, so closing or updating the window never interrupts a running agent.',
  description: [
    'Nysia is a desktop environment for working with coding agents. Every tab is a session, either an agent or a shell. Projects and their git worktrees are the backbone, and tasks come from GitHub Issues: starting an issue creates a branch-keyed worktree with its own session and tab.',
    'The core is a long-lived Rust daemon that owns the PTYs, the SQLite store, orchestration state and the agent status endpoint. The Tauri window is only a client, so a crash or an update of the UI leaves running agents alone, and a relaunch brings the tab back with its scrollback. The same binary is also a CLI with JSON output for every command, so scripts and agents can drive it too.',
    'It is early (v0.3, projects and tasks) and public on GitHub. The design docs in the repo record each decision and where it still falls short.',
  ],
  projectType: 'desktop',
  gallery: [],
  technologies: ['Rust', 'Tauri', 'SQLite', 'React', 'TypeScript'],
  features: [
    'Headless daemon owns the terminals; the window is a detachable client',
    'Sessions survive closing the window, with scrollback replayed on relaunch',
    'Projects and git worktrees as the main structure',
    'GitHub Issues start branch-keyed worktrees with a session and tab',
    'Live agent status driven by the agent hooks, not terminal-title guessing',
    'One binary for daemon and CLI, with JSON output on every verb',
  ],
  techDetails: {
    stack: [
      'Rust',
      'Tauri 2',
      'rusqlite (bundled SQLite)',
      'React',
      'TypeScript',
      'Vite',
      'pnpm workspaces',
    ],
  },
  status: 'in-progress',
  duration: 'Ongoing',
  demoUrl: '',
  githubUrl: 'https://github.com/noctcore/nysia',
  featured: false,
}
