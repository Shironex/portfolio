import { Project } from '@/types'

export const perfectCleanCarHouse: Project = {
  id: 'perfect-clean-car-house',
  slug: 'perfect-clean-car-house',
  title: 'Perfect Clean Car&House',
  summary:
    'Professional car detailing and furniture cleaning service website offering comprehensive cleaning solutions with modern Polish interface.',
  description: [
    'Perfect Clean Car&House is a professional service website designed for a car detailing and furniture cleaning business. The platform showcases various cleaning services including car detailing, paint correction, ceramic coating, and furniture cleaning with a focus on quality and customer satisfaction.',
    'The website features a modern, dark-themed design with striking yellow accents that reflects the professional nature of the business. Built with a mobile-first approach, it provides an intuitive user experience for customers looking to book cleaning services.',
    'The platform includes comprehensive service listings, pricing information, a portfolio gallery, customer testimonials, and an integrated contact system to streamline the booking process for both car and furniture cleaning services.',
  ],
  image: '/projects/pcch/thumbnail.png',
  projectType: 'web',
  gallery: [
    {
      src: '/projects/pcch/overview.png',
      alt: 'Perfect Clean Car&House Homepage',
      caption:
        'Professional homepage with service statistics and call-to-action',
    },
    {
      src: '/projects/pcch/services.png',
      alt: 'Perfect Clean Car&House Services',
      caption:
        'Comprehensive service offerings including detailing and paint correction',
    },
    {
      src: '/projects/pcch/prices.png',
      alt: 'Perfect Clean Car&House Pricing',
      caption: 'Transparent pricing structure for various service packages',
    },
    {
      src: '/projects/pcch/gallery.png',
      alt: 'Perfect Clean Car&House Gallery',
      caption: 'Portfolio showcase of completed car detailing projects',
    },
    {
      src: '/projects/pcch/opinions.png',
      alt: 'Perfect Clean Car&House Reviews',
      caption: 'Customer testimonials and feedback section',
    },
    {
      src: '/projects/pcch/realizations.png',
      alt: 'Perfect Clean Car&House Realizations',
      caption: 'Before and after gallery of completed projects',
    },
    {
      src: '/projects/pcch/contact.png',
      alt: 'Perfect Clean Car&House Contact',
      caption: 'Contact form with business information and service booking',
    },
  ],
  technologies: [
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'Shadcn UI',
    'React Hook Form',
    'Zod',
    'Resend',
    'Motion',
    'Radix UI',
    'Lucide React',
  ],
  features: [
    'Professional service landing page with modern design',
    'Comprehensive service listings with detailed descriptions',
    'Pricing transparency with multiple service packages',
    'Interactive portfolio gallery showcasing completed work',
    'Customer testimonials and reviews section',
    'Integrated contact form with validation',
    'Mobile-responsive design optimized for all devices',
    'Professional branding with consistent visual identity',
  ],
  techDetails: {
    stack: [
      'Next.js 15',
      'TypeScript',
      'Tailwind CSS',
      'Shadcn UI',
      'React Hook Form',
      'Zod Validation',
      'Resend Email',
      'Motion Animations',
      'Radix UI Primitives',
      'Lucide React Icons',
    ],
    architecture:
      'Perfect Clean Car&House follows a modern Next.js architecture with server-side rendering for optimal SEO performance. The application uses a component-based structure with reusable UI components from Shadcn UI library, type-safe form handling with React Hook Form and Zod validation, and email integration through Resend service.',
    challenges: [
      {
        challenge:
          'Creating an engaging visual hierarchy for service information',
        solution:
          'Implemented a card-based layout with consistent spacing and typography, using Tailwind CSS for responsive design and yellow accent colors for important call-to-action elements',
      },
      {
        challenge: 'Showcasing portfolio work effectively',
        solution:
          'Developed an interactive gallery component with high-quality image optimization and before/after comparison views to demonstrate service quality',
      },
    ],
  },
  completedDate: 'August 2025',
  duration: '2 weeks',
  demoUrl: 'https://perfectcleancarhouse.pl',
  featured: true,
}
