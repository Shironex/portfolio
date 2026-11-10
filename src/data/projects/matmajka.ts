import { Project } from '@/types'

export const matmajka: Project = {
  id: 'matmajka',
  slug: 'matmajka',
  title: 'Matmajka',
  summary:
    'Website for Maja, a private tutor in math, physics, chemistry and English. The landing page is a small 3D study room: click an object on the desk and the matching section opens beside it.',
  description: [
    "Matmajka is the site I built for a friend, Maja, who tutors students in math, physics, chemistry and English. It started in 2024 as a plain landing page. In 2026 I rebuilt it around a 3D study room drawn with three.js and React Three Fiber: the corkboard opens the page about her, the globe shows where she teaches, the calculator, the flask, the Newton's cradle and the stack of books are her subjects, the chalkboard holds the reviews and the planner is the contact form.",
    'The sections are ordinary HTML that the server renders, so the page reads the same without the room. Clicking an object flies the camera to it and slides that section in as a panel. Phones and weak graphics cards get a picture of the room and the plain page first, with a button to enter the room. A switch in the navbar goes between the two views.',
    'Most models started as generated meshes that I cleaned up, and the laptop, the cradle and the room itself are built in Blender. The files are compressed with Meshopt and KTX2, and lighter copies load first and are swapped for the full ones at the first close-up. The site is in Polish and English, the contact form is guarded by Cloudflare Turnstile and sends mail over SMTP, and it runs in Docker on my own server.',
  ],
  image: '/projects/matmajka/thumbnail.png',
  projectType: 'web',
  gallery: [
    {
      src: '/projects/matmajka/overview.png',
      alt: 'Matmajka: the landing page with the 3D study room beside the headline',
      caption:
        'The landing page: the study room, with every object on the desk clickable.',
    },
    {
      src: '/projects/matmajka/about-me.png',
      alt: 'Matmajka: the corkboard up close with the About me panel open',
      caption: 'The corkboard opens the section about Maja.',
    },
    {
      src: '/projects/matmajka/about-lessons.png',
      alt: 'Matmajka: the globe up close with the tutoring panel open',
      caption: 'The globe: where and how the lessons are held.',
    },
    {
      src: '/projects/matmajka/lessons.png',
      alt: 'Matmajka: the calculator up close with the subjects panel open on mathematics',
      caption:
        'The calculator opens the subjects, with mathematics picked out.',
    },
    {
      src: '/projects/matmajka/opinions.png',
      alt: 'Matmajka: the chalkboard up close with a student review in the panel',
      caption: 'The chalkboard: reviews from students and parents.',
    },
    {
      src: '/projects/matmajka/contact.png',
      alt: 'Matmajka: the planner and pen up close with the contact form in the panel',
      caption: 'The planner opens the contact form.',
    },
  ],
  technologies: [
    'Next.js',
    'three.js',
    'React Three Fiber',
    'Tailwind CSS',
    'Blender',
    'Docker',
  ],
  features: [
    'A 3D study room where nine objects open the sections of the page',
    'Camera flights between the objects, with the section in a side panel',
    'A plain page and a picture of the room for phones and weak graphics cards',
    'Polish and English versions, each with its own address',
    'Compressed models, with lighter copies loaded first',
    'Contact form with Cloudflare Turnstile and email delivery',
  ],
  techDetails: {
    stack: [
      'Next.js',
      'three.js',
      'React Three Fiber',
      'Tailwind CSS',
      'next-intl',
      'Nodemailer',
      'Docker',
    ],
  },
  completedDate: 'November 2024',
  status: 'shipped',
  duration: '1 month',
  demoUrl: 'https://matmajka.com',
  featured: false,
}
