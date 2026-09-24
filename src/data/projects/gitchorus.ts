import { Project } from '@/types'

export const gitchorus: Project = {
  id: 'gitchorus',
  slug: 'gitchorus',
  title: 'GitChorus',
  summary:
    'Desktop app for AI-assisted issue validation and pull request reviews with evidence-backed findings. Archived in April 2026.',
  description: [
    'GitChorus was a desktop app that ran AI code analysis against local repositories. It used the Claude Agent SDK to start read-only agents that checked whether an issue was valid or reviewed a pull request, and returned structured findings that pointed at the actual code.',
    'The analysis streamed into the app live, results could be published to GitHub as issue comments or pull request reviews with inline comments, and a dashboard tracked repository health over time.',
    'I archived it in April 2026. I was not sure the licensing terms allowed a third-party app like this to run the Agent SDK on a personal subscription, and I did not want to ship something that could put users in a grey area.',
  ],
  projectType: 'desktop',
  gallery: [],
  technologies: [
    'Electron',
    'NestJS',
    'React',
    'TypeScript',
    'Claude Agent SDK',
    'Socket.IO',
  ],
  features: [
    'Issue validation with structured verdicts',
    'Pull request reviews with findings grouped by severity',
    'Live streaming of the agent analysis',
    'One-click publishing to GitHub as comments or pull request reviews',
    'Findings backed by references to the actual code',
    'Review history stored locally',
    'Configurable model, review depth and settings',
  ],
  techDetails: {
    stack: [
      'Electron',
      'NestJS',
      'React',
      'TypeScript',
      'Claude Agent SDK',
      'Socket.IO',
      'Zustand',
      'Tailwind CSS',
      'Vite',
      'electron-store',
      'GitHub API',
    ],
  },
  completedDate: 'April 2026',
  status: 'archived',
  duration: '5 months',
  demoUrl: '',
  githubUrl: 'https://github.com/Shironex/gitchorus',
  featured: false,
}
