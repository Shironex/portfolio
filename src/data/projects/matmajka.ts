import { Project } from '@/types'

export const matmajka: Project = {
  id: 'matmajka',
  slug: 'matmajka',
  title: 'Matmajka',
  summary:
    'Matmajka connects parents and students with private tutor Maja that help with math, physics, and chemistry.',
  description: [
    'Matmajka is an landing page for my private tutor friend Maja that helps with math, physics, and chemistry. ',
  ],
  image: '/projects/matmajka/thumbnail.png',
  projectType: 'web',
  gallery: [
    {
      src: '/projects/matmajka/overview.png',
      alt: 'Matmajka Homepage',
      caption: 'The welcoming homepage',
    },
    {
      src: '/projects/matmajka/about-me.png',
      alt: 'Matmajka About Me',
      caption: 'The about me section with more details about the Maja',
    },
    {
      src: '/projects/matmajka/about-lessons.png',
      alt: 'Matmajka About Lessons',
      caption: 'The about lessons section with more details about the lessons',
    },
    {
      src: '/projects/matmajka/lessons.png',
      alt: 'Matmajka Lessons',
      caption: 'The lessons section with the lessons that Maja offers',
    },
    {
      src: '/projects/matmajka/opinions.png',
      alt: 'Matmajka Opinions',
      caption: 'The opinions section with the opinions of the students',
    },
    {
      src: '/projects/matmajka/contact.png',
      alt: 'Matmajka Contact',
      caption: 'The contact section with the contact form',
    },
  ],
  technologies: ['NextJS', 'Tailwind', 'Docker', 'Resend', 'Framer Motion'],
  features: [
    'Simple landing page with a clean design',
    'Translations to Polish and English',
    'Feedback dialog that is integrated with the Write-Wiz Project',
    'Animated UI elements using Framer Motion',
  ],
  techDetails: {
    stack: ['Next.js', 'Tailwind CSS', 'Docker', 'Resend', 'Framer Motion'],
    challenges: [],
  },
  completedDate: 'November 2024',
  duration: '1 month',
  demoUrl: 'https://matmajka.com',
  featured: true,
}
