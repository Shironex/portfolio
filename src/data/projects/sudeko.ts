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
      'Next.js 15',
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
    architecture:
      'Sudeko follows a modern Next.js architecture with server-side rendering for optimal SEO performance. The application uses a component-based structure with reusable UI components from Radix UI, form handling with React Hook Form and Zod validation, email integration through Resend, and comprehensive security through Arcjet rate limiting and Cloudflare Turnstile bot protection.',
    challenges: [
      {
        challenge: 'Creating a professional and trustworthy brand presentation',
        solution:
          'Developed a clean, professional design with consistent blue and yellow branding, clear service categorization, and prominent display of company credentials and statistics',
      },
      {
        challenge: 'Showcasing technical services effectively to clients',
        solution:
          'Implemented detailed service sections with clear descriptions, visual icons, and organized categorization of electrical and construction services',
      },
      {
        challenge: 'Ensuring accessibility and user experience',
        solution:
          'Used Radix UI primitives for accessibility compliance and implemented responsive design with Tailwind CSS for optimal viewing across all devices',
      },
      {
        challenge: 'Protecting contact forms from spam and abuse',
        solution:
          'Implemented multi-layered security with Arcjet for rate limiting, honeypot fields for bot detection, and Cloudflare Turnstile for human verification',
      },
    ],
  },
  completedDate: 'September 2025',
  duration: '3 days',
  demoUrl: 'https://sudekospzoo.pl/',
  featured: true,
}
