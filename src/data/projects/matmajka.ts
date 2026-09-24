import { Project } from '@/types'

export const matmajka: Project = {
  id: 'matmajka',
  slug: 'matmajka',
  title: 'Matmajka',
  summary:
    'Landing page for Maja, a private tutor who teaches math, physics and chemistry, with lesson details, reviews and a contact form.',
  description: [
    'Matmajka is a landing page I built for a friend, Maja, who tutors students in math, physics and chemistry. It explains how lessons work, lists what she offers, shows reviews from students and parents, and ends with a contact form.',
    'The site is available in Polish and English, uses Framer Motion for small animations, and sends contact messages through Resend. It runs in Docker.',
  ],
  image: '/projects/matmajka/thumbnail.png',
  projectType: 'web',
  gallery: [
    {
      src: '/projects/matmajka/overview.png',
      alt: 'Matmajka Homepage',
      caption: 'Homepage',
    },
    {
      src: '/projects/matmajka/about-me.png',
      alt: 'Matmajka About Me',
      caption: 'About Maja',
    },
    {
      src: '/projects/matmajka/about-lessons.png',
      alt: 'Matmajka About Lessons',
      caption: 'How the lessons work',
    },
    {
      src: '/projects/matmajka/lessons.png',
      alt: 'Matmajka Lessons',
      caption: 'Lessons on offer',
    },
    {
      src: '/projects/matmajka/opinions.png',
      alt: 'Matmajka Opinions',
      caption: 'Reviews from students',
    },
    {
      src: '/projects/matmajka/contact.png',
      alt: 'Matmajka Contact',
      caption: 'Contact form',
    },
  ],
  technologies: [
    'Next.js',
    'Tailwind CSS',
    'Docker',
    'Resend',
    'Framer Motion',
  ],
  features: [
    'Single-page layout with lessons, reviews and contact sections',
    'Polish and English versions',
    'Contact form with email delivery through Resend',
    'Small animations with Framer Motion',
  ],
  techDetails: {
    stack: ['Next.js', 'Tailwind CSS', 'Docker', 'Resend', 'Framer Motion'],
  },
  completedDate: 'November 2024',
  status: 'shipped',
  duration: '1 month',
  demoUrl: 'https://matmajka.com',
  featured: false,
}
