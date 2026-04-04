import { Project } from '@/types'

export const automaker: Project = {
  id: 'automaker',
  slug: 'automaker',
  title: 'AutoMaker',
  summary:
    'Autonomous AI development studio that orchestrates Claude agents to implement features on a Kanban board. My first open-source project, built with a team of 4. Over 3,000 stars in 2 months.',
  description: [
    'AutoMaker is an autonomous AI development studio. Users describe features on a Kanban board, and when moved to "In Progress", a Claude agent automatically implements the feature in an isolated git worktree. You review the changes, approve or reject, and move on to the next one.',
    'This was my first open-source project. A team of four of us started it for fun and it took off way faster than we expected. We hit 3,000 GitHub stars within two months. Contributing every day, pushing rapid changes, and watching the community grow was an incredible experience.',
    'Building AutoMaker taught me things no tutorial ever could. How much time open-source maintenance actually takes. How hard it is to keep a codebase healthy when multiple people push changes daily. How to support cross-platform users with completely different environments. How to coordinate a team around a fast-moving project without everything falling apart.',
    'I no longer have time to contribute actively, but AutoMaker remains one of my proudest projects. Not because of the star count, but because of everything I learned building it.',
  ],
  projectType: 'desktop',
  gallery: [],
  technologies: [
    'Electron',
    'React',
    'TypeScript',
    'Express',
    'Claude Agent SDK',
    'WebSocket',
    'Vite',
    'TanStack Router',
    'Zustand',
    'Tailwind CSS',
    'xterm.js',
    'CodeMirror',
    'Git Worktrees',
    'Radix UI',
    'Playwright',
  ],
  features: [
    'Kanban board where moving a card to "In Progress" triggers autonomous AI implementation',
    'AI agents execute in isolated git worktrees to protect the main branch',
    'Real-time WebSocket streaming of agent progress',
    'Built-in terminal emulator via xterm.js and node-pty',
    'Code review with CodeMirror diff viewer',
    'Multi-level planning modes (skip, lite, spec, full) with optional approval',
    'Multi-agent spec mode that spawns dedicated agents per task',
    'Cross-platform: macOS, Windows, Linux, and web browser',
    '25+ themes (Dracula, Nord, Catppuccin, and more)',
    'Docker support with multi-architecture builds',
  ],
  techDetails: {
    stack: [
      'Electron 39',
      'React 19',
      'TypeScript 5.9',
      'Express 5',
      'Vite 7',
      'Claude Agent SDK',
      'WebSocket (ws)',
      'TanStack Router',
      'TanStack React Query',
      'Zustand 5',
      'Tailwind CSS 4',
      'Radix UI',
      'xterm.js + node-pty',
      'CodeMirror 6',
      'dnd-kit',
      '@xyflow/react',
      'Playwright',
      'Vitest',
    ],
    architecture:
      'npm workspace monorepo with 2 apps (React+Electron frontend, Express+WebSocket backend) and 8 shared libraries (types, utils, prompts, platform, model-resolver, dependency-resolver, git-utils, spec-parser). AI agents run through the Claude Agent SDK with autonomous tool use. Each feature executes in its own git worktree for isolation. File-based JSON storage in .automaker/ directory, no database required.',
    challenges: [
      {
        challenge:
          'Keeping the codebase stable when 4 contributors push rapid changes every day',
        solution:
          'Set up CI pipelines, code review processes, and clear contribution guidelines. Learned the hard way that moving fast without process leads to breakage, but too much process kills momentum.',
      },
      {
        challenge:
          'Supporting macOS, Windows, Linux, and web browser from a single codebase',
        solution:
          'Built a platform abstraction layer (libs/platform) for path management and security, with Electron builds via electron-builder and Docker support for multi-arch deployments.',
      },
      {
        challenge:
          'Preventing AI agents from corrupting the working directory during execution',
        solution:
          'Each feature runs in its own git worktree, giving the agent a completely isolated copy of the repo. Users review changes before anything touches the main branch.',
      },
    ],
  },
  duration: 'Ongoing',
  demoUrl: '',
  githubUrl: 'https://github.com/AutoMaker-Org/automaker',
  featured: true,
}
