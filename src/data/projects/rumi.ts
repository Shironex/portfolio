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
  image: '/projects/rumi/hero.webp',
  projectType: 'cli',
  gallery: [
    {
      src: '/projects/rumi/resources.webp',
      alt: 'Rumi resource list with a detail panel',
      caption: 'Apps, services and databases with live health and details',
    },
    {
      src: '/projects/rumi/deploy-logs.webp',
      alt: 'Rumi deploy log panel for an app',
      caption:
        'Following a deploy from the first build step to the new container',
    },
    {
      src: '/projects/rumi/runtime-logs.webp',
      alt: 'Rumi runtime log tail for an app',
      caption: 'Runtime logs tailed live, with warnings and errors colored',
    },
    {
      src: '/projects/rumi/config-env.webp',
      alt: 'Rumi config and environment variable inspector',
      caption: 'Env vars masked by default, plus the build and runtime config',
    },
    {
      src: '/projects/rumi/nav-demo.webp',
      alt: 'Rumi keyboard navigation demo',
      caption: 'Moving through resources, logs and views from the keyboard',
    },
    {
      src: '/projects/rumi/confirm-restart.webp',
      alt: 'Rumi restart confirmation prompt',
      caption: 'Start, stop, restart and deploy always ask first',
    },
    {
      src: '/projects/rumi/context-switch.webp',
      alt: 'Rumi context switcher',
      caption: 'Switching between Coolify instances, like prod and staging',
    },
    {
      src: '/projects/rumi/servers.webp',
      alt: 'Rumi servers view',
      caption: 'Servers with their IPs and reachability',
    },
    {
      src: '/projects/rumi/help.webp',
      alt: 'Rumi keybinding help overlay',
      caption: 'Every keybinding one ? away',
    },
  ],
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
