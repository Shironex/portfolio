import { Project } from '@/types'

export const sudeko: Project = {
  id: 'sudeko',
  slug: 'sudeko',
  title: 'Sudeko',
  summary:
    'Professional electrical and construction services company website showcasing comprehensive solutions with modern Polish interface.',
  description: [
    'Sudeko is a professional website designed for an electrical installation and construction services company operating in Elbląg, Poland since 2019. The platform showcases comprehensive electrical and building project management services with a focus on quality and professional expertise.',
    "The website features a modern, professional design with striking blue and yellow branding that reflects the company's technical expertise and reliability. Built with a mobile-first approach, it provides an intuitive experience for clients looking to understand and engage with electrical and construction services.",
    "The platform includes detailed service offerings, project portfolio, professional credentials, and client testimonials to establish trust and demonstrate the company's capabilities in both electrical installations and construction projects.",
  ],
  image: '/projects/sudeko/thumbnail.png',
  projectType: 'web',
  gallery: [
    {
      src: '/projects/sudeko/overview.png',
      alt: 'Sudeko Homepage',
      caption:
        'Professional homepage showcasing company statistics and services',
    },
    {
      src: '/projects/sudeko/services.png',
      alt: 'Sudeko Services',
      caption:
        'Comprehensive service offerings including electrical and construction',
    },
    {
      src: '/projects/sudeko/about-us.png',
      alt: 'Sudeko About Us',
      caption: 'Company information and professional credentials',
    },
    {
      src: '/projects/sudeko/why-us.png',
      alt: 'Sudeko Why Choose Us',
      caption: 'Value propositions and competitive advantages',
    },
    {
      src: '/projects/sudeko/contact.png',
      alt: 'Sudeko Contact',
      caption: 'Contact information and service inquiry form',
    },
  ],
  technologies: [
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'Radix UI',
    'React Hook Form',
    'Zod',
    'Framer Motion',
    'Lucide React',
    'Resend',
    'Arcjet',
    'React Turnstile',
    'Next Themes',
    'Sonner',
  ],
  features: [
    'Professional service website with modern design',
    'Comprehensive service portfolio presentation',
    'Company statistics and achievements showcase',
    'Professional credentials and certifications display',
    'Client testimonials and project portfolio',
    'Advanced security with Arcjet rate limiting and bot protection',
    'Contact form with validation, honeypot, and Cloudflare Turnstile',
    'Mobile-responsive design optimized for all devices',
    'Professional branding with consistent visual identity',
    'SEO-optimized content and structure',
    'Multi-section navigation for easy browsing',
  ],
  techDetails: {
    stack: [
      'Next.js 16',
      'TypeScript',
      'Tailwind CSS',
      'Radix UI Primitives',
      'React Hook Form',
      'Zod Validation',
      'Framer Motion',
      'Lucide React Icons',
      'Resend Email',
      'Arcjet Security',
      'Cloudflare Turnstile',
      'Next Themes',
      'Sonner Toast',
    ],
  },
  completedDate: 'September 2025',
  duration: '3 days',
  demoUrl: 'https://sudekospzoo.pl/',
  featured: false,
}
