import {
  IconArticle,
  IconBolt,
  IconBrandDiscord,
  IconBrandGithub,
  IconBriefcase2,
  IconMail,
  IconMessage2,
} from '@tabler/icons-react'

// Write-Wiz images
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

// Matmajka images
import matmajkaAboutLessons from '@/public/projects/matmajka/about-lessons.png'
import matmajkaAboutMe from '@/public/projects/matmajka/about-me.png'
import matmajkaContact from '@/public/projects/matmajka/contact.png'
import matmajkaOpinions from '@/public/projects/matmajka/opinions.png'
import matmajka from '@/public/projects/matmajka/thumbnail.png'

// Toriime images
import toriimeAboutProject from '@/public/projects/toriime/about-project.png'
import toriimeFaq from '@/public/projects/toriime/faq.png'
import toriimeFooter from '@/public/projects/toriime/footer.png'
import toriimeImages2 from '@/public/projects/toriime/images-2.png'
import toriimeImages3 from '@/public/projects/toriime/images-3.png'
import toriimeImages from '@/public/projects/toriime/images.png'
import toriime from '@/public/projects/toriime/thumbnail.png'

import { ProjectStatus } from './type'

export const navlinks = [
  {
    href: '/',
    label: 'Home',
    ariaLabel: 'Home',
    icon: IconBolt,
  },
  {
    href: '/about',
    label: 'About',
    ariaLabel: 'About',
    icon: IconMessage2,
  },
  {
    href: '/projects',
    label: 'Projects',
    ariaLabel: 'Projects',
    icon: IconBriefcase2,
  },
  {
    href: '/blog',
    label: 'Articles',
    ariaLabel: 'Articles',
    icon: IconArticle,
  },
  {
    href: '/contact',
    label: 'Contact',
    ariaLabel: 'Contact',
    icon: IconMail,
  },
]

export const socials = [
  {
    href: 'https://github.com/Shironex',
    label: 'GitHub',
    ariaLabel: 'GitHub',
    icon: IconBrandGithub,
  },
  {
    href: 'https://discord.gg/ZpPwXMfU',
    label: 'Discord',
    ariaLabel: 'Discord',
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
      'NextJS',
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
      'Docker',
    ],
    slug: 'write-wiz',
    content:
      'Write-Wiz is an ai project management tool that helps you manage your projects and tasks. You can create projects, add tasks, send events from your projects and track it in our charts. There is also discord integration reports page, ai chatbox and many more features that are coming soon.',
  },
  {
    href: 'https://matmajka.com',
    title: 'Matmajka',
    description:
      'Matmajka is a website for parents and students to contact tutor for private lessons for math, physics, chemistry.',
    thumbnail: matmajka,
    status: 'Completed' as ProjectStatus,
    images: [
      matmajka,
      matmajkaAboutMe,
      matmajkaAboutLessons,
      matmajkaOpinions,
      matmajkaContact,
    ],
    stack: [
      'NextJS',
      'Typescript',
      'Tailwind',
      'Resend',
      'Zod',
      'React-hook-form',
      'Redis',
      'Docker',
    ],
    slug: 'matmajka',
    content:
      'Matmajka is a website for parents and students to contact tutor for private lessons for math, physics, chemistry.',
  },
  {
    href: 'https://toriime.pl',
    title: 'Toriime',
    description:
      'Toriime is a website where you can find and watch anime series/movies with subtitles in Polish language and much more.',
    thumbnail: toriime,
    status: 'In Progress' as ProjectStatus,
    images: [
      toriime,
      toriimeAboutProject,
      toriimeImages,
      toriimeImages2,
      toriimeImages3,
      toriimeFaq,
      toriimeFooter,
    ],
    stack: [
      'NextJS',
      'NestJS',
      'Shadcn',
      'Typescript',
      'Tailwind',
      'MongoDB',
      'Prisma',
      'Zod',
      'React-hook-form',
      'hello-pangea/dnd',
      'Axios',
      'AWS',
      'Docker'
    ],
    slug: 'toriime',
    content:
      'Toriime is a project that i work with group of friends. We are trying to create a website where you can find and watch anime series/movies with subtitles in Polish language, create your own lists and watch them later. Have own account with statistics of watched series/movies and much more interesting features.',
  },
]
