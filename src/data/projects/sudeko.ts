import { Project } from '@/types'

export const sudeko: Project = {
  id: 'sudeko',
  slug: 'sudeko',
  title: 'Sudeko',
  summary:
    'Website for an electrical installation and construction company in Elbląg, Poland, with a service overview and a protected contact form.',
  description: [
    'Sudeko is the website of an electrical installation and construction company that has operated in Elbląg, Poland since 2019. It presents the services, company background, credentials and client testimonials in Polish.',
    "I built it in a few days with Next.js, following the company's blue and yellow branding and a mobile-first layout. The contact form validates input with Zod and is protected by a honeypot, Cloudflare Turnstile and Arcjet rate limiting, with messages delivered through Resend.",
  ],
  image: '/projects/sudeko/thumbnail.png',
  projectType: 'web',
  gallery: [
    {
      src: '/projects/sudeko/overview.png',
      alt: 'Sudeko Homepage',
      caption: 'Homepage with company statistics and services',
    },
    {
      src: '/projects/sudeko/services.png',
      alt: 'Sudeko Services',
      caption: 'Electrical and construction services',
    },
    {
      src: '/projects/sudeko/about-us.png',
      alt: 'Sudeko About Us',
      caption: 'Company background and credentials',
    },
    {
      src: '/projects/sudeko/why-us.png',
      alt: 'Sudeko Why Choose Us',
      caption: 'Why clients choose the company',
    },
    {
      src: '/projects/sudeko/contact.png',
      alt: 'Sudeko Contact',
      caption: 'Contact details and inquiry form',
    },
  ],
  technologies: [
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'React Hook Form',
    'Zod',
    'Resend',
    'Arcjet',
  ],
  features: [
    'Service overview for electrical and construction work',
    'Company statistics, credentials and client testimonials',
    'Contact form with Zod validation, a honeypot and Cloudflare Turnstile',
    'Arcjet rate limiting and bot protection',
    'Mobile-first responsive layout',
    'SEO metadata and structured page sections',
  ],
  techDetails: {
    stack: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Radix UI',
      'React Hook Form',
      'Zod',
      'Framer Motion',
      'Lucide icons',
      'Resend',
      'Arcjet',
      'Cloudflare Turnstile',
      'next-themes',
      'Sonner',
    ],
  },
  completedDate: 'September 2025',
  status: 'shipped',
  duration: '3 days',
  demoUrl: 'https://sudekospzoo.pl/',
  featured: false,
}
