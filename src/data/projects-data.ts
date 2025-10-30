import { Project } from '@/types'

export const projectsData: Project[] = [
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
    demoUrl: 'https://matmajka.com',
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
  },
  {
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
          challenge:
            'Creating a professional and trustworthy brand presentation',
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
    demoUrl: 'https://toriime.pl',
    featured: false,
  },
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
    projectType: 'web',
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
    inProgress: false,
    duration: '11 months',
    demoUrl: 'https://writewiz.shirone.dev/',
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
    duration: '2 months',
    demoUrl: '',
    githubUrl: 'https://github.com/Shironex/next-js-nest-js-template',
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
    projectType: 'desktop',
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
    completedDate: 'September 2025',
    duration: '3 months',
    demoUrl: '#desktop-app',
    featured: false,
  },
  {
    id: 'cli-template',
    slug: 'cli-template',
    title: 'CLI Template',
    summary:
      'A modern template for building command-line applications with TypeScript, Commander.js, and best practices.',
    description: [
      'CLI Template is a comprehensive starting point for developers looking to build professional command-line applications. Built with TypeScript and Commander.js, it provides a solid foundation with modern development tools and best practices baked in.',
      'The template comes pre-configured with everything needed for CLI development, including interactive mode support, table output formatting with cli-table3, progress bars with cli-progress, and comprehensive testing setup with Vitest. The project structure is designed to be intuitive and scalable.',
      'One of the standout features is the complete CI/CD setup with GitHub Actions for automated testing, code quality checks with CodeQL, and automated releases. The template also includes VitePress documentation, making it easy to create professional documentation for your CLI tools.',
    ],
    projectType: 'cli',
    gallery: [],
    technologies: [
      'TypeScript',
      'Commander.js',
      'Vitest',
      'ESLint',
      'Prettier',
      'VitePress',
      'cli-table3',
      'cli-progress',
      'tsup',
      'GitHub Actions',
    ],
    features: [
      'Modern TypeScript stack with strict type checking',
      'Commander.js for powerful CLI argument parsing',
      'Interactive mode with menu-driven interface',
      'Formatted table output with cli-table3',
      'Progress bars and visual indicators',
      'Comprehensive testing setup with Vitest',
      'Code quality tools (ESLint, Prettier)',
      'CI/CD pipeline with GitHub Actions',
      'Automated testing and releases',
      'VitePress documentation site',
      'Multiple example commands (hello, table, progress)',
      'Custom logger utility with colored output',
      'Error handling with custom error classes',
      'Package.json helper utilities',
      'Ready for global npm installation',
    ],
    techDetails: {
      stack: [
        'TypeScript',
        'Commander.js',
        'Vitest',
        'tsup',
        'ESLint',
        'Prettier',
        'VitePress',
        'cli-table3',
        'cli-progress',
        'inquirer',
      ],
      architecture:
        'CLI Template follows a modular architecture with clear separation of concerns. Commands are organized in the commands/ directory, utilities are isolated in utils/, and type definitions are centralized in types/. The build process uses tsup for fast, optimized bundling with support for both CommonJS and ES modules. The testing setup uses Vitest for unit testing with coverage reporting.',
      challenges: [
        {
          challenge: 'Creating a flexible and extensible command structure',
          solution:
            'Implemented a modular command system using Commander.js subcommands, allowing easy addition of new commands without modifying the core structure',
        },
        {
          challenge: 'Providing comprehensive examples for common CLI patterns',
          solution:
            'Built example commands for tables, progress bars, and interactive modes, demonstrating best practices for each pattern with multiple variations',
        },
        {
          challenge: 'Setting up automated CI/CD for CLI tools',
          solution:
            'Configured GitHub Actions workflows for testing, code quality checks with CodeQL, and automated semantic versioning releases',
        },
        {
          challenge: 'Making the template documentation-ready',
          solution:
            'Integrated VitePress for documentation with pre-configured guides, API references, and examples that can be easily customized',
        },
      ],
    },
    completedDate: 'April 2025',
    duration: '1 month',
    demoUrl: 'https://shironex.github.io/cli-template/',
    githubUrl: 'https://github.com/Shironex/cli-template',
    featured: false,
  },
  {
    id: 'gh-labels-cli',
    slug: 'gh-labels-cli',
    title: 'GitHub Labels CLI',
    summary:
      'Command-line tool for managing labels in GitHub repositories with AI-powered suggestions using OpenAI.',
    description: [
      'GitHub Labels CLI is a powerful command-line tool designed to streamline label management across GitHub repositories. Built with TypeScript and the Octokit REST API, it provides an intuitive interface for organizing and maintaining repository labels at scale.',
      'The tool features an interactive mode that guides users through common label management tasks, including fetching repository lists, adding/removing labels, and creating custom label templates. Users can save label configurations and reuse them across multiple repositories, ensuring consistency across projects.',
      'One of the standout features is AI-powered label suggestions for pull requests. Using OpenAI API, the tool analyzes PR titles, descriptions, changed files, and code context to automatically suggest appropriate labels with confidence scores. It can also generate comprehensive PR descriptions, making it invaluable for large teams looking to automate workflow categorization and maintain consistent documentation.',
    ],
    projectType: 'cli',
    gallery: [],
    technologies: [
      'TypeScript',
      'Commander.js',
      'Octokit',
      'OpenAI API',
      'Inquirer',
      'Chalk',
      'Ora',
      'Zod',
      'Vitest',
      'VitePress',
      'Semantic Release',
      'Husky',
    ],
    features: [
      'Interactive mode for guided label management',
      'Fetch and list user repositories from GitHub',
      'Add and remove labels from repositories',
      'Create and save custom label templates',
      'Reuse label templates across multiple repositories',
      'AI-powered label suggestions for pull requests',
      'Automatic PR description generation using AI',
      'Analyze changed files and code context',
      'Confidence scoring for label suggestions',
      'Support for bulk label operations',
      'Colored terminal output with Chalk',
      'Loading spinners and progress indicators',
      'Type-safe validation with Zod',
      'Comprehensive testing with Vitest',
      'Full VitePress documentation',
      'Semantic versioning and automated releases',
    ],
    techDetails: {
      stack: [
        'TypeScript',
        'Commander.js',
        '@octokit/rest',
        'OpenAI API',
        'Inquirer',
        'Chalk',
        'Ora',
        'Zod',
        'Vitest',
        'VitePress',
        'tsup',
        'Semantic Release',
        'Husky',
        'Commitizen',
      ],
      architecture:
        'GitHub Labels CLI follows a modular command-based architecture using Commander.js for command routing and argument parsing. The tool integrates with GitHub API via Octokit for repository and label operations, and OpenAI API for intelligent label suggestions. Interactive prompts are powered by Inquirer, providing a user-friendly CLI experience. The codebase uses Zod for runtime validation of API responses and user input, ensuring type safety throughout the application.',
      challenges: [
        {
          challenge: 'Integrating AI for intelligent label suggestions',
          solution:
            'Implemented OpenAI API integration that analyzes PR context including title, description, changed files, and code diff to provide relevant label suggestions with confidence scores',
        },
        {
          challenge: 'Managing complex GitHub API interactions',
          solution:
            'Used Octokit REST client with proper error handling and rate limiting, implementing retry logic for failed requests and clear error messages for users',
        },
        {
          challenge: 'Creating reusable label templates',
          solution:
            'Built a template system that allows users to export labels from any repository and save them as JSON templates for quick application to other repositories',
        },
        {
          challenge: 'Providing excellent user experience in the terminal',
          solution:
            'Combined Inquirer for interactive prompts, Chalk for colored output, and Ora for loading indicators to create an intuitive and visually appealing CLI interface',
        },
      ],
    },
    completedDate: 'May 2025',
    duration: '2 months',
    demoUrl: 'https://shironex.github.io/gh-labels-cli/',
    githubUrl: 'https://github.com/Shironex/gh-labels-cli',
    featured: false,
  },
  {
    id: 'ag-gdrive-generator',
    slug: 'ag-gdrive-generator',
    title: 'AG GDrive Link Generator',
    summary:
      'Desktop Electron app for automating Google Drive video link generation with Discord formatting and automatic updates.',
    description: [
      'AG GDrive Link Generator is a specialized desktop application built for the AnimeGate community to streamline their video sharing workflow. The app automates the process of generating shareable Google Drive links for video files, formatting them for Discord, and managing episode sequences.',
      'Built with Electron and React 19, the application provides a modern, intuitive interface for browsing Google Drive folders, automatically detecting episode numbers from filenames, and generating properly formatted Discord messages with embedded video players. The app integrates with Google Service Accounts for secure, automated access to shared drives.',
      'One of the key features is the automatic update system using electron-updater and GitHub Releases. When a new version is pushed, all users receive the update automatically without manual distribution, making it easy to roll out improvements and fixes to the entire group instantly.',
    ],
    image: '/projects/gdrive-generator/thumbnail.png',
    projectType: 'desktop',
    gallery: [
      {
        src: '/projects/gdrive-generator/overview.png',
        alt: 'AG GDrive Generator Main Interface',
        caption: 'Main interface with folder browser and episode detection',
      },
      {
        src: '/projects/gdrive-generator/generate-links.png',
        alt: 'AG GDrive Generator Link Generation',
        caption:
          'Automatic link generation with Discord formatting copied to clipboard',
      },
      {
        src: '/projects/gdrive-generator/service-account.png',
        alt: 'AG GDrive Generator Link Generation 2',
        caption: 'Google service account settings',
      },
      {
        src: '/projects/gdrive-generator/settings.png',
        alt: 'AG GDrive Generator Settings',
        caption: 'Settings panel with theme and language options',
      },
    ],
    technologies: [
      'Electron',
      'React 19',
      'TypeScript',
      'Vite',
      'Tailwind CSS 4',
      'shadcn-ui',
      'TanStack Router',
      'TanStack Query',
      'Google APIs',
      'i18next',
      'electron-updater',
      'electron-store',
      'Vitest',
      'Playwright',
      'pnpm',
    ],
    features: [
      'Automatic episode number detection from filenames',
      'Google Drive folder browsing with Service Account integration',
      'Discord message formatting with embedded video players',
      'Copy links or full Discord messages to clipboard',
      'Gap detection in episode sequences',
      'Auto-fill assist for missing episodes',
      'Automatic updates via GitHub Releases',
      'Custom title bar with window controls',
      'Dark/Light theme support',
      'Bilingual interface (Polish & English)',
      'Persistent settings with electron-store',
      'Debug mode with separate console window',
      'Professional NSIS installer for Windows',
      'Type-safe file-based routing',
      'Comprehensive error handling',
    ],
    techDetails: {
      stack: [
        'Electron 38',
        'React 19',
        'TypeScript',
        'Vite',
        'Tailwind CSS 4',
        'shadcn-ui',
        'Radix UI',
        'TanStack Router',
        'TanStack Query',
        'Google APIs',
        'i18next',
        'electron-updater',
        'electron-store',
        'electron-window-state',
        'Zod',
        'Vitest',
        'Playwright',
      ],
      architecture:
        'AG GDrive Generator follows modern Electron architecture with context isolation and secure IPC communication. The main process handles Google API interactions via Service Accounts, while the renderer process provides a React-based UI. TanStack Router manages file-based routing with type safety, and TanStack Query handles data fetching and caching. The auto-update system uses electron-updater to check GitHub Releases and seamlessly install updates in the background.',
      challenges: [
        {
          challenge: 'Rapid migration from Next.js web app to Electron',
          solution:
            'Leveraged existing React components and business logic, adapting only the API layer from HTTP endpoints to IPC channels. Completed the full migration in just one day by focusing on the Electron-specific features like window management and auto-updates',
        },
        {
          challenge: 'Secure Google Drive integration without user OAuth',
          solution:
            'Implemented Google Service Account authentication, allowing the app to access shared drives without requiring each user to authenticate individually, while maintaining security through proper scope limitations',
        },
        {
          challenge: 'Automatic episode detection and gap handling',
          solution:
            'Built pattern matching system to extract episode numbers from various filename formats, with intelligent gap detection that alerts users to missing episodes and provides auto-fill suggestions',
        },
        {
          challenge: 'Seamless automatic updates for all users',
          solution:
            'Integrated electron-updater with GitHub Releases, enabling one-click publishing that automatically distributes updates to all users without manual intervention, significantly reducing maintenance overhead',
        },
      ],
    },
    completedDate: 'October 2025',
    duration: '1 day (port), 1 day (initial web version)',
    demoUrl: '#desktop-app',
    featured: false,
  },
  {
    id: 'ag-anime-bot',
    slug: 'ag-anime-bot',
    title: 'AG Anime Bot',
    summary:
      'Enterprise-grade Discord bot for anime enthusiasts with AniList/MAL integration, AI-powered Polish translations, and intelligent caching.',
    description: [
      'AG Anime Bot is a feature-rich Discord bot built for the AnimeGate Polish anime community, providing seamless access to anime information from multiple sources. The bot integrates with both AniList and MyAnimeList APIs, offering comprehensive anime data with automatic Polish translations powered by OpenAI.',
      'Built with NestJS and following enterprise architecture patterns, the bot features an intelligent priority-based caching system that learns from usage metrics to optimize response times. It includes sophisticated rate limiting across multiple levels (user, channel, guild, global) and a batch translation service that reduces translation costs by 50% using OpenAI Batch API.',
      'The bot provides daily automated notifications for airing anime schedules, administrative tools for bulk pre-caching entire seasons or years, and detailed cache statistics. The monorepo structure with pnpm and Turbo allows for shared UI components and future web dashboard integration, while Docker deployment ensures easy scalability and reliability.',
    ],
    image: '/projects/anime-bot/upcoming-animes.png',
    projectType: 'api',
    gallery: [
      {
        src: '/projects/anime-bot/anime-search.png',
        alt: 'AG Anime Bot Search Command',
        caption:
          'Anime search with automatic Polish translation and character information',
      },
      {
        src: '/projects/anime-bot/upcoming-animes.png',
        alt: 'AG Anime Bot Daily Airing Schedule',
        caption: "Automated daily notifications for today's airing anime",
      },
      {
        src: '/projects/anime-bot/automatic-translation-cron.png',
        alt: 'AG Anime Bot Translation System',
        caption: 'Automatic translation cron job with batch processing',
      },
      {
        src: '/projects/anime-bot/cache-statistics.png',
        alt: 'AG Anime Bot Cache Statistics',
        caption:
          'Cache statistics showing priority distribution and job status',
      },
    ],
    technologies: [
      'NestJS',
      'Necord',
      'Discord.js',
      'TypeScript',
      'PostgreSQL',
      'Prisma ORM',
      'OpenAI API',
      'AniList GraphQL',
      'Jikan API',
      'pnpm Monorepo',
      'Turbo',
      'Docker',
      'Next.js',
      'shadcn-ui',
      'nestjs-pino',
    ],
    features: [
      'Dual anime database integration (AniList + MyAnimeList)',
      'Automatic Polish translation of synopses and genres via OpenAI',
      'Priority-based intelligent caching system with usage metrics',
      'Multi-level rate limiting (user, channel, guild, global)',
      'Daily automated airing schedule notifications with role pings',
      'Character information with Japanese and English voice actors',
      'Admin bulk pre-caching for seasons, years, and trending anime',
      'Batch translation service with 50% cost reduction',
      'Translation reporting via Discord webhooks',
      'Circuit breaker pattern for API resilience',
      'Cache statistics and job tracking dashboard',
      'Docker deployment with multi-stage builds',
      'Monorepo architecture with shared UI packages',
      'Type-safe database queries with Prisma',
      'Structured logging with pino',
      'Scheduled jobs with timezone support (Europe/Warsaw)',
    ],
    techDetails: {
      stack: [
        'NestJS 11',
        'Necord 6 (Discord.js 14)',
        'TypeScript 5.7',
        'PostgreSQL 16',
        'Prisma 6.16',
        'OpenAI SDK 6.1',
        'AniList GraphQL API',
        'Jikan API v4',
        'pnpm 10.4',
        'Turbo 2.5',
        'Docker',
        'nestjs-pino 4.4',
        'Next.js (future web dashboard)',
        'shadcn-ui',
      ],
      architecture:
        'AG Anime Bot follows NestJS enterprise architecture with dependency injection, modular design, and clear separation of concerns. The bot uses Necord for type-safe Discord.js integration, with commands organized into user and admin modules. Services handle external API interactions with circuit breaker patterns and rate limiting. The database layer uses Prisma ORM with PostgreSQL for reliable data persistence and caching. The monorepo structure (pnpm + Turbo) enables code sharing between the bot and future web dashboard, with shared UI components and TypeScript configurations.',
      challenges: [
        {
          challenge: 'Optimizing translation costs for large anime libraries',
          solution:
            'Implemented OpenAI Batch API for bulk translations, reducing costs by 50%. Created intelligent priority system that translates frequently requested anime in real-time while batching less popular titles for overnight processing',
        },
        {
          challenge: 'Managing rate limits across multiple anime APIs',
          solution:
            'Built circuit breaker pattern with configurable concurrency limits and retry logic. AniList allows 3 concurrent requests, Jikan requires 1-second intervals. Implemented intelligent fallback between APIs when one is unavailable',
        },
        {
          challenge:
            'Scaling pre-cache operations for entire years of anime data',
          solution:
            'Developed admin commands with progress tracking and job statistics. Sequential processing with automatic pagination handles thousands of anime entries without overwhelming APIs. Estimated 1-3 hours per year with detailed progress updates',
        },
        {
          challenge: 'Building intelligent caching that learns from usage',
          solution:
            'Created priority-based system (1-5) that tracks search metrics and automatically promotes frequently requested anime. Cache prioritizes popular titles for instant responses while maintaining a 24-hour TTL for less popular entries',
        },
      ],
    },
    completedDate: 'October 2025',
    duration: '1 week',
    demoUrl: '',
    featured: false,
  },
  {
    id: 'claude-code-discord-bot',
    slug: 'claude-code-discord-bot',
    title: 'Claude Code Discord Bot',
    summary:
      'Discord bot that executes Claude Code on GitHub repositories via workflow dispatch, creating automated PRs from Discord prompts and images.',
    description: [
      'Claude Code Discord Bot is a fun experimental project that enables agentic coding directly from Discord. Users can trigger Claude Code to execute tasks on any repository by sending prompts and error screenshots through Discord slash commands. The bot dispatches GitHub Actions workflows that run Claude Code autonomously, implementing fixes, adding features, or refactoring code based on the prompt, then automatically creating pull requests with the changes.',
      'Built with NestJS and Necord in just a couple of days, the bot provides an interactive Discord interface for repository search, prompt submission with image attachments, and real-time workflow monitoring. It uses a custom GitHub Actions workflow template that users add to their repositories, which handles the Claude Code execution and PR creation. The entire process happens automatically - from Discord message to GitHub PR - without manual intervention.',
      'While the project has some rough edges and unfinished features, it demonstrates the potential of agentic coding workflows triggered through chat interfaces. The Turborepo monorepo structure with automated CI/CD using Changesets shows solid engineering practices, making it a good foundation for future development into a more polished tool for Discord-based development workflows.',
    ],
    projectType: 'api',
    gallery: [],
    technologies: [
      'NestJS',
      'Necord',
      'Discord.js',
      'TypeScript',
      'Turborepo',
      'pnpm',
      'GitHub API',
      'Octokit',
      'GitHub Actions',
      'Changesets',
      'ESLint',
      'Prettier',
    ],
    features: [
      'Agentic coding triggered from Discord slash commands',
      'Prompt submission with error screenshot attachments',
      'Automated Claude Code execution via GitHub Actions',
      'Autonomous PR creation with implemented changes',
      'Repository search with autocomplete functionality',
      'Real-time workflow status monitoring and updates',
      'Custom workflow template for Claude Code integration',
      'Session management across Discord interactions',
      'Interactive buttons for status checks and re-triggering',
      'Multiple workflow template support (two-step, one-step)',
      'Automated CI/CD with commit validation',
      'Changeset-based versioning and releases',
      'GitHub token permission validation',
      'Service-specific logging system',
      'Modal-based forms for complex interactions',
    ],
    techDetails: {
      stack: [
        'NestJS',
        'Necord (Discord.js wrapper)',
        'Discord.js v14',
        'TypeScript',
        'Turborepo',
        'pnpm workspaces',
        'Octokit REST API',
        'GitHub Actions',
        'Changesets',
        'Commitlint',
        'Husky',
        'ESLint',
        'Prettier',
      ],
      architecture:
        'Claude Code Discord Bot follows NestJS modular architecture with clear separation between commands, interactions, and services. The bot uses Necord for type-safe Discord.js integration, with dedicated modules for slash commands, button interactions, modal submissions, and select menu handlers. Services handle business logic including GitHub API interactions via Octokit, workflow dispatching, and session management. The Turborepo monorepo structure enables future package sharing and scalability. Automated CI/CD pipelines handle quality checks, versioning, and releases using changesets and GitHub Actions.',
      challenges: [
        {
          challenge: 'Building agentic coding workflow from Discord to GitHub',
          solution:
            'Created end-to-end automation that dispatches GitHub Actions workflows with user prompts and images, allowing Claude Code to autonomously implement changes and create PRs without manual repository access',
        },
        {
          challenge:
            'Managing Discord interaction state across async workflows',
          solution:
            'Implemented session management and modal-based forms to maintain context across multi-step Discord interactions, with real-time polling to update users on long-running Claude Code execution status',
        },
        {
          challenge: 'Rapid prototyping with production-ready patterns',
          solution:
            "Built the core functionality in a couple of days while maintaining clean architecture with NestJS modules, automated CI/CD with Changesets, and comprehensive error handling - proving fast iteration doesn't require sacrificing code quality",
        },
        {
          challenge: 'Making Claude Code accessible via chat interface',
          solution:
            'Designed custom GitHub Actions workflow templates that users can easily add to repositories, enabling Claude Code execution through simple Discord commands with prompt and image support',
        },
      ],
    },
    inProgress: true,
    duration: 'Few days (core), 2 months (total)',
    demoUrl: '',
    githubUrl: 'https://github.com/Shironex/claude-code-discord-bot',
    featured: false,
  },
] as const
