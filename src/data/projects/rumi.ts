import { Project } from '@/types'

export const rumi: Project = {
  id: 'rumi',
  slug: 'rumi',
  title: 'Rumi',
  summary:
    'A k9s-style terminal dashboard for Coolify: browse apps, services and databases, deploy, restart and tail logs without leaving the keyboard.',
  description: [
    'I run my own projects on Coolify and got tired of clicking through the web UI to restart a service or read a deploy log. Rumi is a keyboard-driven terminal dashboard for it, in the spirit of k9s.',
    'It lists apps, services and databases with their health, filters them as you type, and runs start, stop, restart and deploy behind a confirm prompt. It tails runtime and build logs, follows a deploy you just triggered, inspects and edits environment variables (masked by default), and switches between Coolify instances using the same config file as the official CLI.',
    'Rumi is written in TypeScript with React on OpenTUI and runs on Bun, compiled to a single binary for macOS, Linux and Windows, and it can update itself. It is early and still has rough edges.',
  ],
  projectType: 'cli',
  gallery: [],
  technologies: ['TypeScript', 'Bun', 'React', 'OpenTUI'],
  features: [
    'Live list of apps, services and databases with health status and filtering',
    'Start, stop, restart and deploy behind a confirm prompt',
    'Runtime and deploy log tailing that follows a fresh deploy',
    'Config and env inspector with masked values, editing and .env copy',
    'Servers view and switching between Coolify instances',
    'Single self-updating binary for macOS, Linux and Windows',
  ],
  techDetails: {
    stack: [
      'TypeScript',
      'Bun (compiled binary)',
      'React',
      'OpenTUI',
      'Coolify API',
      'GitHub Actions',
    ],
  },
  status: 'in-progress',
  duration: 'Ongoing',
  demoUrl: 'https://github.com/Shironex/Rumi/releases/latest',
  githubUrl: 'https://github.com/Shironex/Rumi',
  featured: false,
}
