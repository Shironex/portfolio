import { Project } from '@/types'

export const projectsData: Project[] = [
  {
    id: 'write-wiz',
    slug: 'write-wiz',
    title: 'Write-Wiz',
    summary:
      'An AI project management tool that helps you manage your projects and tasks with Discord integration and AI chatbot.',
    description: [
      'Write-Wiz is a comprehensive project management tool designed specifically for writers, content creators, and creative teams. It combines the power of AI with intuitive project management features to streamline the content creation process.',
      'The application was built to address the common challenges faced by content teams, such as maintaining consistent voice, tracking progress across multiple projects, and facilitating collaboration between team members.',
      'One of the standout features is the AI chatbot that can help with content ideation, provide writing suggestions, and even help with editing. The Discord integration allows team members to receive notifications and updates directly in their preferred communication channel.',
    ],
    image: '/projects/write-wiz/thumbnail.png',
    gallery: [
      {
        src: '/projects/write-wiz/overview.png',
        alt: 'Write-Wiz Overview',
        caption: 'The main overview of the project',
      },
      {
        src: '/projects/write-wiz/overview-2.png',
        alt: 'Write-Wiz Overview 2',
        caption: 'The main overview of the project with more details',
      },
      {
        src: '/projects/write-wiz/ai-assistant.png',
        alt: 'Write-Wiz AI Assistant',
        caption: 'The AI assistant interface for content suggestions',
      },
      {
        src: '/projects/write-wiz/task-management.png',
        alt: 'Write-Wiz Task Management',
        caption: 'Task management interface with drag-and-drop functionality',
      },
      {
        src: '/projects/write-wiz/integrations.png',
        alt: 'Write-Wiz Integrations',
        caption: 'Integrations settings for Discord Webhook and Github App',
      },
      {
        src: '/projects/write-wiz/resources.png',
        alt: 'Write-Wiz Resources',
        caption: 'Resources section with all the project files and links',
      },
      {
        src: '/projects/write-wiz/changelog.png',
        alt: 'Write-Wiz Changelog',
        caption:
          'Changelog section with all the changes made to the project with AI suggestions and Markdown formatting',
      },
      {
        src: '/projects/write-wiz/feedback.png',
        alt: 'Write-Wiz Feedback',
        caption:
          'Feedback section with all the feedback from the users coming from API Webhook',
      },
      {
        src: '/projects/write-wiz/events.png',
        alt: 'Write-Wiz Events',
        caption:
          'Events section with all the events coming from the API Webhook',
      },
      {
        src: '/projects/write-wiz/reports.png',
        alt: 'Write-Wiz Reports',
        caption:
          'Reports section with all the reports about completed task in the last 10 weeks',
      },
    ],
    technologies: [
      'Next JS',
      'TypeScript',
      'Shadcn',
      'Zod',
      'Redis',
      'Docker',
      'PostgreSQL',
      'Shadcn UI',
      'React Form',
      'React Hook Form',
      'Zsa-react',
      'Recharts',
      'terraform',
      'AWS SES',
      'AWS S3',
      'OpenAI API',
      'hello-pangea/dnd',
      'cypress',
    ],
    features: [
      'AI-powered project management system for keeping track of tasks and progress',
      'Discord integration for real-time notifications and updates',
      'Comprehensive project management with tasks, milestones, and deadlines',
      'Team collaboration features with role-based permissions',
      'Detailed analytics and reporting dashboard',
      'Github integration for showing last commits and pull requests',
      'Custom AI Chatbox with OpenAI API',
      'Feedback system for users to give feedback about the project using API Webhook',
      'Changelong enchanced with AI suggestions and Markdown formatting with abbility to integrate it with current project',
      'Mobile-responsive design',
      'Unlimited projects and tasks',
      'And many more...',
    ],
    techDetails: {
      stack: [
        'Next JS',
        'TypeScript',
        'Shadcn',
        'Zod',
        'Redis',
        'Docker',
        'PostgreSQL',
        'Shadcn UI',
        'React Form',
        'React Hook Form',
        'Zsa-react',
        'Recharts',
        'terraform',
        'AWS SES',
        'AWS S3',
        'OpenAI API',
        'Cypress',
      ],
      architecture:
        'Write-Wiz follows a modern architecture with a Next.js frontend and API routes for backend functionality. The application uses PostgreSQL for persistent storage, Redis for caching and real-time features, and Docker for containerization and easy deployment.',
      challenges: [
        {
          challenge: 'Caching system for faster response times',
          solution:
            'Used Redis for caching system to store frequently accessed data, reducing the load on the database and improving response times',
        },
        {
          challenge: 'Clean architecture for scalability and maintainability',
          solution:
            'Used a Use-Case Driven Architecture for scalability and maintainability',
        },

        {
          challenge: 'Handling permission structures for team collaboration',
          solution:
            'Developed a granular role-based access control system with inheritance and custom permission sets',
        },
        {
          challenge:
            'Securing sensitive secrets like OpenAI API Key or Github App configuration',
          solution:
            'Implemented AES-GCM encryption for storing sensitive secrets',
        },
        {
          challenge: 'Integrating with external services like Github APP',
          solution:
            'Implemented a class-based system to receive data from Github and integrate them with the application',
        },
        {
          challenge: 'Move heavy computations to the background',
          solution:
            'Used BullMQ for background processing of heavy computations',
        },
        {
          challenge: 'Testing the application',
          solution:
            'Used Cypress for testing the application and make sure that it is working as expected using E2E testing and Component testing',
        },
      ],
    },
    inProgress: true,
    duration: '11 months',
    outcome:
      'Write-Wiz is a private project for my own use, but I decided to share it with the community in the near future. I hope that it can be helpful for other programmers.',
    demoUrl: 'https://write-wiz.shirone.xyz',
    featured: true,
  },
  {
    id: 'matmajka',
    slug: 'matmajka',
    title: 'Matmajka',
    summary:
      'Matmajka connects parents and students with private tutor Maja that help with math, physics, and chemistry.',
    description: [
      'Matmajka is an landing page for my private tutor friend Maja that helps with math, physics, and chemistry. ',
    ],
    image: '/projects/matmajka/thumbnail.png',
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
        caption:
          'The about lessons section with more details about the lessons',
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
      challenges: [
        {
          challenge:
            'Create a project in short amount of time also after 12h of working at the vacation',
          solution:
            'Used Tailwind CSS for the simple design and Framer Motion for the animations',
        },
        {
          challenge: 'Secure form with Cloudflare Turnstile',
          solution:
            'Used Cloudflare Turnstile for secure form validation and protection against spam and abuse',
        },
        {
          challenge: 'Integrating with external services like Resend',
          solution: 'Used Resend for sending emails to the users and the team',
        },
      ],
    },
    completedDate: 'November 2024',
    duration: '1 month',
    outcome:
      'Matmajka has successfully connected over 32 students with qualified tutor in its first six months of operation. The platform has received positive feedback from both students and friends, with many reporting significant improvements in academic performance. The project is going to be expanded with a learning platform for the students to learn from the lessons by doing quizzes and exercises in the future.',
    demoUrl: 'https://matmajka.com',
    featured: true,
  },
  {
    id: 'toriime',
    slug: 'toriime',
    title: 'Toriime',
    summary:
      'A streaming platform for finding and watching anime series and movies with Polish subtitles.',
    description: [
      'Toriime is a project is created with my friends to give a better experience to the Polish anime community by providing a comprehensive library of anime content with high-quality Polish subtitles and a friendly user interface. Platform is not only for anime watchers but also for translators who can contribute to the platform by adding new subtitles to the anime and creating their own community and groups. The platform is still in development and will be expanded with more features in the future.',
    ],
    image: '/projects/toriime/thumbnail.png',
    gallery: [
      {
        src: '/projects/toriime/thumbnail.png',
        alt: 'Toriime Thumbnail',
        caption: 'The homepage of the project',
      },
      {
        src: '/projects/toriime/about-project.png',
        alt: 'Toriime About Project',
        caption:
          'The about project section with more details about the project',
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
    outcome:
      'Toriime was orginally going to be a simple project but turns out to be a big one. It is still in high development state but its already have a ready to use services to be used when website will be ready.',
    demoUrl: 'https://toriime.pl',
    featured: true,
  },
] as const
