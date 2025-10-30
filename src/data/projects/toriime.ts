import { Project } from '@/types'

export const toriime: Project = {
  id: 'toriime',
  slug: 'toriime',
  title: 'Toriime',
  summary:
    'A streaming platform for finding and watching anime series and movies with Polish subtitles.',
  description: [
    'Toriime is a project is created with my friends to give a better experience to the Polish anime community by providing a comprehensive library of anime content with high-quality Polish subtitles and a friendly user interface. Platform is not only for anime watchers but also for translators who can contribute to the platform by adding new subtitles to the anime and creating their own community and groups. The platform is still in development and will be expanded with more features in the future.',
  ],
  image: '/projects/toriime/thumbnail.png',
  projectType: 'web',
  gallery: [
    {
      src: '/projects/toriime/thumbnail.png',
      alt: 'Toriime Thumbnail',
      caption: 'The homepage of the project',
    },
    {
      src: '/projects/toriime/about-project.png',
      alt: 'Toriime About Project',
      caption: 'The about project section with more details about the project',
    },
    {
      src: '/projects/toriime/images.png',
      alt: 'Toriime Images',
      caption: 'The images section with all the images of the project',
    },
    {
      src: '/projects/toriime/images-2.png',
      alt: 'Toriime Images 2',
      caption: 'More images of the project',
    },
    {
      src: '/projects/toriime/images-3.png',
      alt: 'Toriime Images 3',
      caption: 'More images of the project',
    },
    {
      src: '/projects/toriime/faq.png',
      alt: 'Toriime FAQ',
      caption: 'The FAQ section with the questions and answers',
    },
    {
      src: '/projects/toriime/footer.png',
      alt: 'Toriime Footer',
      caption: 'The footer section with the social media links',
    },
  ],
  technologies: [
    'NextJS',
    'Shadcn',
    'TypeScript',
    'Tailwind',
    'MongoDB',
    'Prisma',
    'hello-pangea/dnd',
  ],
  features: [
    'Extensive library of anime with Polish subtitles',
    'Custom video player with advanced subtitle controls',
    'User profiles with watch history and favorites',
    'Community translation tools and workflow',
    'Recommendation engine based on viewing habits',
    'Mobile-responsive design for on-the-go viewing',
    'Drag and drop for anime list',
    'Customizeable anime list and profile',
    'And many more...',
  ],
  techDetails: {
    stack: [
      'Next.js',
      'TypeScript',
      'Shadcn UI',
      'Tailwind CSS',
      'MongoDB',
      'Prisma ORM',
      'AWS S3',
      'Nest js',
      'TipTap js',
      'hello-pangea/dnd',
      'React Hook Form',
      'BullMQ',
    ],
    architecture:
      'Toriime uses a microservices architecture with Next.js for the frontend and dedicated services for backend and subtitle management. Content is stored in MongoDB with media files hosted on AWS S3 and delivered via CloudFront CDN.',
    challenges: [
      {
        challenge: 'Use one account across other services',
        solution:
          'Used Nest js to create own oauth server and used it to authenticate users and give access to other services in the future',
      },
    ],
  },
  inProgress: true,
  duration: '2 years',
  demoUrl: 'https://toriime.pl',
  featured: false,
}
