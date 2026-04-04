import { Project } from '@/types'

export const gitchorus: Project = {
  id: 'gitchorus',
  slug: 'gitchorus',
  title: 'GitChorus',
  summary:
    'AI-powered desktop app for issue validation and PR code reviews with evidence-backed findings. Discontinued due to unclear SDK licensing.',
  description: [
    'GitChorus was a desktop application that brought AI-powered code analysis directly to local repositories. It used the Claude Agent SDK to spawn read-only AI agents that analyzed codebases, producing structured, evidence-backed issue validation and PR reviews.',
    'The app provided real-time streaming of the AI analysis process, GitHub integration for pushing results as issue comments or PR reviews with inline comments, and a dashboard for tracking repository health over time.',
    'The project was discontinued in April 2026 due to unclear licensing terms around the Claude Agent SDK when used with Max plan credentials. Anthropic has not provided clear guidance on whether third-party applications like GitChorus are permitted, so the project was archived to protect users.',
  ],
  projectType: 'desktop',
  gallery: [],
  technologies: [
    'Electron',
    'NestJS',
    'React',
    'TypeScript',
    'Claude Agent SDK',
    'Socket.io',
    'Zustand',
    'Tailwind CSS',
    'GitHub API',
  ],
  features: [
    'AI-powered issue validation with structured verdicts',
    'PR code review with severity-categorized findings',
    'Real-time streaming of AI agent analysis',
    'One-click publishing to GitHub (comments and PR reviews)',
    'Evidence-backed findings with actual code references',
    'Review history persisted locally',
    'Configurable model, review depth, and settings',
    'Cross-platform (macOS, Windows, Linux)',
  ],
  techDetails: {
    stack: [
      'Electron 40',
      'NestJS 10',
      'React 18',
      'TypeScript',
      'Claude Agent SDK',
      'Socket.io',
      'Zustand 5',
      'Tailwind CSS 4',
      'Vite',
      'electron-store',
    ],
    architecture:
      'GitChorus used a monorepo structure with an Electron main process running a NestJS backend, communicating with a React frontend via Socket.io over dynamically allocated ports. The AI agent ran in read-only mode with bypass permissions, only able to use Read, Grep, Glob, and Bash tools.',
    challenges: [
      {
        challenge:
          'AI SDK spawns child processes that fail inside Electron asar archives',
        solution:
          'Configured asarUnpack to extract the Claude Agent SDK files to the filesystem, allowing child process spawning to work correctly in packaged builds',
      },
      {
        challenge:
          'Dynamic port allocation to avoid conflicts with other Electron apps',
        solution:
          'Used NestJS listen(0) for OS-assigned ports with a port flow that propagates through CSP headers, CORS config, and IPC handlers to the renderer',
      },
      {
        challenge:
          'Electron subprocess inheriting sensitive environment variables',
        solution:
          'Implemented environment variable sanitization to prevent leaking API keys, tokens, and passwords to spawned AI agent processes',
      },
    ],
  },
  completedDate: 'April 2026 (discontinued)',
  duration: '5 months',
  demoUrl: '',
  githubUrl: 'https://github.com/Shironex/gitchorus',
  featured: false,
}
