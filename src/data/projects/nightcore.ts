import { Project } from '@/types'

export const nightcore: Project = {
  id: 'nightcore',
  slug: 'nightcore',
  title: 'Nightcore',
  summary:
    'A local-first desktop studio that runs Claude as a small development team inside an enforced harness. Agents plan, build and test in parallel worktrees, and nothing merges until it passes the gates.',
  description: [
    'Coding agents are good at producing diffs and bad at respecting a codebase: a change can compile, pass its tests and still cross a layer boundary, skip a failing test or quietly grow to forty files. Most tools answer that with advice. Nightcore keeps the agents running at full speed and makes the boundaries enforced instead of advisory.',
    "Work is cards on a Kanban board. Agents pick them up, each in its own git worktree, and every finished task enters a verification gauntlet before it can reach your branch: the build, lint and typecheck, the project's own structure checks from .nightcore/harness.json, and an independent reviewer agent whose verdict drives the task's state machine. A guardrail battery adds a diff budget, a strictness ratchet on any and ts-ignore counts, an anti-gaming sweep for skipped tests and gutted assertions, and a secret scan.",
    'Policy rules run in a hook inside the agent session (deny, ask, allow), external text such as issue bodies is fenced as untrusted, and every gate decision lands in an append-only ledger per task. The core is Rust inside a Tauri 2 window; the agent SDK lives only in a Bun sidecar behind a provider seam, and the React board talks to the core through Tauri commands alone.',
    'Version 0.5.0 ships installers for macOS and Windows with signed auto-update. Nightcore has been in maintenance mode since 0.5.0, with dependency and security updates only.',
  ],
  image: '/projects/nightcore/thumbnail.webp',
  projectType: 'desktop',
  gallery: [
    {
      src: '/projects/nightcore/board.webp',
      alt: 'Nightcore: the Kanban board with backlog, in progress, verifying, waiting approval and done columns',
      caption:
        'The board: tasks pass through verifying and approval, and finished ones carry their verdict and cost.',
    },
  ],
  technologies: ['Rust', 'Tauri', 'TypeScript', 'React', 'Bun'],
  features: [
    'Kanban board of tasks run by agents in parallel, each in its own git worktree',
    "Verification gauntlet: build, lint, typecheck, the project's own checks and a reviewer agent",
    'Guardrails: diff and contract budgets, a strictness ratchet, an anti-gaming sweep and a secret scan',
    'Deny, ask and allow policy tiers enforced in a hook, even with permissions bypassed',
    'Untrusted external text fenced off, and an append-only ledger of every gate decision',
    'Opt-in macOS sandbox that confines agent writes at the OS level',
    'Auto mode with dependency ordering, a concurrency cap and a circuit breaker',
    'Installers for macOS and Windows with signed auto-update',
  ],
  techDetails: {
    stack: [
      'Rust',
      'Tauri 2',
      'React 19 + Vite',
      'Tailwind CSS v4',
      'Bun (provider sidecar)',
      'Zod (wire contracts)',
      'Claude Agent SDK',
      'GitHub Actions',
    ],
  },
  completedDate: 'October 2026',
  status: 'shipped',
  duration: 'Maintenance mode (0.5.0)',
  demoUrl: '',
  githubUrl: 'https://github.com/noctcore/nightcore',
  links: [
    {
      label: 'latest release',
      url: 'https://github.com/noctcore/nightcore/releases/latest',
      kind: 'release',
    },
  ],
  featured: false,
}
