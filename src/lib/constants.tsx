import {
  IconArticle,
  IconBolt,
  IconBrandDiscord,
  IconBrandGithub,
  IconBriefcase2,
  IconMail,
  IconMessage2,
} from '@tabler/icons-react'

import writeWizEvents2 from '@/public/projects/write-wiz/events-2.png'
import writeWIzEvents from '@/public/projects/write-wiz/events.png'
import writeWizIntegrationsMessages from '@/public/projects/write-wiz/integrations-messages.png'
import writeWizIntegrations from '@/public/projects/write-wiz/integrations.png'
import writeWizProjectSettings from '@/public/projects/write-wiz/project-settings.png'
import writeWizProjects from '@/public/projects/write-wiz/projects.png'
import writeWizReports from '@/public/projects/write-wiz/reports.png'
import writeWizSignIn from '@/public/projects/write-wiz/sign-in.png'
import writeWizTeamPermissions from '@/public/projects/write-wiz/team-permissions.png'
import writeWizTeam from '@/public/projects/write-wiz/team.png'
import writeWiz from '@/public/projects/write-wiz/thumbnail.png'
import writeWizWorkItems2 from '@/public/projects/write-wiz/work-items-2.png'
import writeWizWorkItems from '@/public/projects/write-wiz/work-items.png'

import { ProjectStatus } from './type'

export const navlinks = [
  {
    href: '/',
    label: 'Home',
    icon: IconBolt,
  },
  {
    href: '/about',
    label: 'About',
    icon: IconMessage2,
  },
  {
    href: '/projects',
    label: 'Projects',
    icon: IconBriefcase2,
  },
  {
    href: '/blog',
    label: 'Articles',
    icon: IconArticle,
  },
  {
    href: '/contact',
    label: 'Contact',
    icon: IconMail,
  },
]

export const socials = [
  {
    href: 'https://github.com/Shironex',
    label: 'GitHub',
    icon: IconBrandGithub,
  },
  {
    href: 'https://discord.gg/ZpPwXMfU',
    label: 'Discord',
    icon: IconBrandDiscord,
  },
]

export const projects = [
  {
    href: 'https://writewiz.shirone.xyz',
    title: 'Write-Wiz',
    description:
      'Write-Wiz is an ai project management tool that helps you manage your projects and tasks. You can create projects, add tasks, send events from your projects and track it in our charts. There is also discord integration reports page, ai chatbox and many more features that are coming soon.',
    thumbnail: writeWiz,
    status: 'In Progress' as ProjectStatus,
    images: [
      writeWiz,
      writeWizProjects,
      writeWizWorkItems,
      writeWizWorkItems2,
      writeWIzEvents,
      writeWizEvents2,
      writeWizReports,
      writeWizSignIn,
      writeWizTeam,
      writeWizTeamPermissions,
      writeWizIntegrations,
      writeWizIntegrationsMessages,
      writeWizProjectSettings,
    ],
    stack: [
      'Nextjs',
      'Typescript',
      'Shadcn',
      'Zod',
      'Tailwind',
      'Drizzle',
      'Redis',
      'PostgreSQL',
      'Terraform',
      'Stripe',
      'OpenAI',
      'AWS',
      'BullMQ',
      'React-hook-form',
      'zsa-react',
      'Recharts',
      'React-email',
    ],
    slug: 'write-wiz',
    content:
      'Write-Wiz is an ai project management tool that helps you manage your projects and tasks. You can create projects, add tasks, send events from your projects and track it in our charts. There is also discord integration reports page, ai chatbox and many more features that are coming soon.',
  },
]
