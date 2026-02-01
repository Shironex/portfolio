import { Project } from '@/types'

export const nextJsSaasTemplate: Project = {
  id: 'next-js-saas-template',
  slug: 'next-js-saas-template',
  title: 'Next.js SaaS Template',
  summary:
    'A complete full-stack SaaS template with Next.js frontend and NestJS API backend, featuring authentication, dashboard, analytics, and pricing tiers.',
  description: [
    'Next.js SaaS Template is a comprehensive monorepo solution designed to accelerate SaaS product development. Built with modern technologies, it provides a complete foundation for building scalable web applications with professional-grade features and architecture.',
    'The template includes a sophisticated authentication system with social logins, email verification, password recovery, and secure user management. The dashboard provides real-time analytics, user activity tracking, and comprehensive data visualization components.',
    'As a monorepo structure, it separates concerns between the Next.js frontend and NestJS backend API, enabling independent scaling and deployment while maintaining shared UI components and TypeScript configurations across the entire stack.',
  ],
  image: '/projects/next-js-template/thumbnail.png',
  projectType: 'web',
  gallery: [
    {
      src: '/projects/next-js-template/overview.png',
      alt: 'Next.js SaaS Template Landing Page',
      caption:
        'Modern SaaS landing page with hero section and feature highlights',
    },
    {
      src: '/projects/next-js-template/features.png',
      alt: 'Next.js SaaS Template Features',
      caption: 'Comprehensive feature showcase with modern card layouts',
    },
    {
      src: '/projects/next-js-template/pricing.png',
      alt: 'Next.js SaaS Template Pricing',
      caption: 'Flexible pricing tiers with detailed feature comparisons',
    },
    {
      src: '/projects/next-js-template/testimonials.png',
      alt: 'Next.js SaaS Template Testimonials',
      caption: 'Customer testimonials and social proof section',
    },
    {
      src: '/projects/next-js-template/cta.png',
      alt: 'Next.js SaaS Template Call to Action',
      caption: 'Strong call-to-action section for user conversion',
    },
    {
      src: '/projects/next-js-template/login-screen.png',
      alt: 'Next.js SaaS Template Login',
      caption:
        'Secure authentication with social login options and Cloudflare Turnstile',
    },
    {
      src: '/projects/next-js-template/register-screen.png',
      alt: 'Next.js SaaS Template Registration',
      caption: 'User registration with form validation and verification system',
    },
    {
      src: '/projects/next-js-template/forgot-password-screen.png',
      alt: 'Next.js SaaS Template Password Recovery',
      caption: 'Password recovery workflow with email verification',
    },
    {
      src: '/projects/next-js-template/verify-email-screen.png',
      alt: 'Next.js SaaS Template Email Verification',
      caption: 'Email verification process with modern UI design',
    },
    {
      src: '/projects/next-js-template/verify-email-template.png',
      alt: 'Next.js SaaS Template Email Template',
      caption: 'Professional email templates using React Email components',
    },
    {
      src: '/projects/next-js-template/dashboard-overview.png',
      alt: 'Next.js SaaS Template Dashboard',
      caption:
        'Comprehensive dashboard with real-time metrics and activity feeds',
    },
    {
      src: '/projects/next-js-template/dashboard-analytics.png',
      alt: 'Next.js SaaS Template Analytics',
      caption:
        'Advanced analytics dashboard with detailed performance insights',
    },
    {
      src: '/projects/next-js-template/dashboard-example-page.png',
      alt: 'Next.js SaaS Template Example Page',
      caption: 'Additional dashboard pages with consistent design patterns',
    },
    {
      src: '/projects/next-js-template/dashboard-settings.png',
      alt: 'Next.js SaaS Template Settings',
      caption: 'User settings and account management interface',
    },
  ],
  technologies: [
    'Next.js',
    'NestJS',
    'TypeScript',
    'Tailwind CSS',
    'Shadcn UI',
    'Prisma',
    'React Query',
    'React Hook Form',
    'Zod',
    'Recharts',
    'Framer Motion',
    'AWS S3',
    'Redis',
    'Cloudflare Turnstile',
    'React Email',
    'Axios',
    'Sharp',
    'Winston',
  ],
  features: [
    'Complete monorepo architecture with shared packages',
    'Full-stack authentication with social login integration',
    'Comprehensive dashboard with real-time analytics',
    'Advanced user management and role-based permissions',
    'Professional email templates with React Email',
    'File upload and management with AWS S3 integration',
    'Real-time data visualization with Recharts',
    'Form validation with React Hook Form and Zod schemas',
    'Bot protection with Cloudflare Turnstile integration',
    'Responsive design with Shadcn UI components',
    'Type-safe API communication with React Query',
    'Professional logging system with Winston',
    'Database management with Prisma ORM',
    'Email verification and password recovery workflows',
    'Modern animations with Framer Motion',
    'Production-ready deployment configuration',
    'Comprehensive testing setup with Jest',
    'Development tools and linting configuration',
  ],
  techDetails: {
    stack: [
      'Next.js 15',
      'NestJS API',
      'TypeScript',
      'Tailwind CSS',
      'Shadcn UI',
      'Prisma ORM',
      'React Query',
      'React Hook Form',
      'Zod Validation',
      'Recharts',
      'Framer Motion',
      'AWS S3',
      'Redis Cache',
      'Cloudflare Turnstile',
      'React Email',
      'Winston Logger',
      'Jest Testing',
    ],
    architecture:
      'Next.js SaaS Template follows a modern monorepo architecture with clear separation between frontend and backend services. The Next.js frontend handles user interface and client-side logic while the NestJS API manages server-side operations, authentication, and data processing. Shared packages ensure consistency across the monorepo with unified UI components, TypeScript configurations, and ESLint rules.',
    challenges: [
      {
        challenge: 'Designing a scalable monorepo structure',
        solution:
          'Implemented workspace-based monorepo with shared packages for UI components, TypeScript configs, and ESLint rules, enabling code reuse and consistent development patterns',
      },
      {
        challenge: 'Creating a comprehensive authentication system',
        solution:
          'Built full authentication workflow with email verification, password recovery, social logins, and secure session management using industry best practices',
      },
      {
        challenge: 'Implementing real-time analytics and data visualization',
        solution:
          'Integrated Recharts with React Query for dynamic data fetching and created reusable chart components with responsive design and performance optimization',
      },
      {
        challenge: 'Managing complex form validation and user input',
        solution:
          'Combined React Hook Form with Zod schemas for type-safe validation, providing real-time feedback and consistent error handling across all forms',
      },
      {
        challenge: 'Building a production-ready email system',
        solution:
          'Implemented React Email for creating professional email templates with consistent branding and integrated with backend email service for reliable delivery',
      },
    ],
  },
  inProgress: true,
  duration: '2 months',
  demoUrl: '',
  githubUrl: 'https://github.com/Shironex/next-js-nest-js-template',
  featured: false,
}
