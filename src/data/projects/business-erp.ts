import { Project } from '@/types'

export const businessErp: Project = {
  id: 'business-erp',
  slug: 'business-erp',
  title: 'Business ERP (private)',
  summary:
    'A private business ERP system, in progress. Built on a deliberately boring, proven stack: tRPC, Vite, TanStack, Prisma and PostgreSQL.',
  description: [
    'I am building an ERP system for day-to-day business operations. It is private and still in progress, so there are no screenshots or links yet.',
    'The stack is chosen to be deliberately boring and proven: a Vite and React single-page app on the TanStack libraries, a typed tRPC API, and Prisma over PostgreSQL.',
  ],
  projectType: 'web',
  gallery: [],
  technologies: ['TypeScript', 'tRPC', 'TanStack', 'Prisma', 'PostgreSQL'],
  features: [
    'End-to-end typed API with tRPC',
    'Vite and React single-page app on TanStack',
    'Prisma data layer over PostgreSQL',
  ],
  techDetails: {
    stack: [
      'TypeScript',
      'React',
      'Vite',
      'TanStack',
      'tRPC',
      'Prisma',
      'PostgreSQL',
    ],
  },
  status: 'in-progress',
  duration: 'Ongoing',
  demoUrl: '',
  featured: false,
}
