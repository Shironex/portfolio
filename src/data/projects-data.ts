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
    demoUrl: 'https://writewiz.shirone.dev/',
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
  {
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
    outcome:
      'Perfect Clean Car&House successfully launched as a professional service website that effectively showcases the business offerings and facilitates customer inquiries. The modern design and user-friendly interface have helped establish a strong online presence for the cleaning service business, making it easier for potential customers to understand services and make bookings.',
    demoUrl: 'https://perfectcleancarhouse.pl',
    featured: false,
  },
  {
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
        caption:
          'User registration with form validation and verification system',
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
    duration: '6 months',
    outcome:
      'Next.js SaaS Template is nearing completion and will serve as a comprehensive foundation for building modern SaaS applications. The template provides developers with a production-ready starting point, significantly reducing development time and ensuring best practices are followed from the beginning of any SaaS project.',
    demoUrl: '#in-development',
    featured: false,
  },
  {
    id: 'env-vault',
    slug: 'env-vault',
    title: 'ENV Vault',
    summary:
      'A desktop application built with Tauri for managing and organizing environment variables across multiple development projects.',
    description: [
      'ENV Vault is a desktop application designed to streamline the management of environment variables during development. Built with Tauri, React, and TypeScript, it provides a centralized location to store, organize, and quickly access environment variables from multiple projects.',
      'The application addresses the common developer pain point of managing numerous .env files across different projects. Instead of switching between files in your code editor, ENV Vault allows you to quickly search and copy environment variables with an intuitive interface.',
      'Features include project-based organization, powerful search functionality for both project names and variable names, and quick clipboard integration for seamless workflow integration. The application runs natively on desktop platforms while maintaining a modern web-based UI.',
    ],
    image: '/projects/env-vault/thumbnail.png',
    gallery: [
      {
        src: '/projects/env-vault/home-screen.png',
        alt: 'ENV Vault Home Screen',
        caption: 'Main interface showing project overview and navigation',
      },
      {
        src: '/projects/env-vault/overview.png',
        alt: 'ENV Vault Project Overview',
        caption: 'Project list view with environment variable counts',
      },
      {
        src: '/projects/env-vault/example-env-screen.png',
        alt: 'ENV Vault Environment Variables',
        caption: 'Environment variables display for a selected project',
      },
      {
        src: '/projects/env-vault/search-input-project.png',
        alt: 'ENV Vault Project Search',
        caption: 'Search functionality for finding specific projects',
      },
      {
        src: '/projects/env-vault/search-input-variable.png',
        alt: 'ENV Vault Variable Search',
        caption: 'Variable search with real-time filtering',
      },
    ],
    technologies: [
      'Tauri',
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Radix UI',
      'Lucide React',
      'React Virtual',
      'UUID',
    ],
    features: [
      'Native desktop application with modern web UI',
      'Project-based environment variable organization',
      'Powerful search functionality for projects and variables',
      'Quick clipboard integration for copying variables',
      'File system integration for importing .env files',
      'Lightweight and fast performance with Tauri',
      'Cross-platform compatibility (Windows, macOS, Linux)',
      'Local data storage with SQLite integration',
      'Context menu support for enhanced productivity',
      'Virtualized lists for handling large datasets',
    ],
    techDetails: {
      stack: [
        'Tauri 2.0',
        'React 19',
        'TypeScript',
        'Vite',
        'Tailwind CSS',
        'Radix UI Primitives',
        'Lucide React Icons',
        'TanStack React Virtual',
        'UUID Generation',
        'SQLite Database',
      ],
      architecture:
        'ENV Vault follows a modern desktop application architecture using Tauri as the native wrapper around a React-based frontend. The application uses SQLite for local data persistence, ensuring fast access to environment variables without requiring network connectivity. The UI is built with Radix UI primitives for accessibility and Tailwind CSS for styling.',
      challenges: [
        {
          challenge:
            'Managing large numbers of environment variables efficiently',
          solution:
            'Implemented TanStack React Virtual for virtualized rendering of large lists, ensuring smooth performance even with hundreds of projects and variables',
        },
        {
          challenge: 'Providing fast search across projects and variables',
          solution:
            'Built real-time search functionality with debounced input and efficient filtering algorithms to quickly locate specific environment variables',
        },
        {
          challenge: 'Seamless integration with development workflow',
          solution:
            'Added clipboard integration and context menus for quick copying of variables, reducing the need to switch between applications during development',
        },
        {
          challenge: 'Cross-platform compatibility and native performance',
          solution:
            'Utilized Tauri framework to create a lightweight native application that works consistently across Windows, macOS, and Linux while maintaining web development practices',
        },
      ],
    },
    inProgress: true,
    duration: '3 months',
    outcome:
      'ENV Vault successfully solves the environment variable management problem for developers, providing a clean and efficient alternative to juggling multiple .env files in code editors. The application is nearing completion with plans for public release after final tweaks and testing.',
    demoUrl: '#desktop-app',
    featured: false,
  },
] as const
