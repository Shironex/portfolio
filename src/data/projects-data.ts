export const projectsData = [
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
    image: '/placeholder.svg?height=400&width=600',
    gallery: [
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Write-Wiz Dashboard',
        caption: 'The main dashboard showing project overview and analytics',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Write-Wiz AI Assistant',
        caption: 'The AI assistant interface for content suggestions',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Write-Wiz Task Management',
        caption: 'Task management interface with drag-and-drop functionality',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Write-Wiz Discord Integration',
        caption: 'Discord integration settings and notification configuration',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Write-Wiz Mobile View',
        caption: 'Responsive mobile interface for on-the-go management',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Write-Wiz Reports',
        caption: 'Detailed analytics and reporting dashboard',
      },
    ],
    technologies: [
      'NextJS',
      'TypeScript',
      'Shadcn',
      'Zod',
      'Redis',
      'Docker',
      'PostgreSQL',
    ],
    features: [
      'AI-powered content assistant for writing suggestions and editing',
      'Discord integration for real-time notifications and updates',
      'Comprehensive project management with tasks, milestones, and deadlines',
      'Team collaboration features with role-based permissions',
      'Detailed analytics and reporting dashboard',
      'Content calendar with scheduling and publishing integration',
      'Mobile-responsive design for management on the go',
    ],
    techDetails: {
      stack: [
        'Next.js',
        'TypeScript',
        'Shadcn UI',
        'Zod',
        'Redis',
        'Docker',
        'PostgreSQL',
        'Prisma ORM',
        'OpenAI API',
        'Discord API',
        'Vercel',
      ],
      architecture:
        'Write-Wiz follows a modern architecture with a Next.js frontend and API routes for backend functionality. The application uses PostgreSQL for persistent storage, Redis for caching and real-time features, and Docker for containerization and easy deployment.',
      challenges: [
        {
          challenge:
            'Implementing real-time collaboration without performance degradation',
          solution:
            'Used Redis pub/sub for efficient real-time updates and optimistic UI updates to maintain responsiveness',
        },
        {
          challenge: 'Ensuring AI suggestions were relevant and helpful',
          solution:
            'Implemented a feedback loop system where users could rate AI suggestions, which was used to fine-tune the AI model over time',
        },
        {
          challenge:
            'Handling complex permission structures for team collaboration',
          solution:
            'Developed a granular role-based access control system with inheritance and custom permission sets',
        },
      ],
    },
    completedDate: 'December 2023',
    duration: '4 months',
    outcome:
      'Write-Wiz has been successfully adopted by several content teams, resulting in a reported 30% increase in productivity and a significant improvement in content quality. The platform continues to evolve with regular updates based on user feedback.',
    demoUrl: 'https://write-wiz.shirone.xyz',
    githubUrl: 'https://github.com/shirone/write-wiz',
    featured: true,
  },
  {
    id: 'matmajka',
    slug: 'matmajka',
    title: 'Matmajka',
    summary:
      'An educational platform that connects parents and students with private tutors for math, physics, and chemistry.',
    description: [
      'Matmajka is an educational platform designed to bridge the gap between students seeking academic help and qualified tutors. The platform focuses specifically on mathematics, physics, and chemistry - subjects that many students find challenging.',
      'The idea for Matmajka came from personal experience, observing how difficult it can be for parents to find reliable, qualified tutors for their children, especially in STEM subjects. The platform aims to simplify this process while ensuring quality education.',
      'The application features a sophisticated matching algorithm that pairs students with tutors based on subject expertise, teaching style, availability, and location preferences. It also includes integrated scheduling, secure payment processing, and a review system to maintain quality control.',
    ],
    image: '/placeholder.svg?height=400&width=600',
    gallery: [
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Matmajka Homepage',
        caption: "The welcoming homepage explaining the platform's benefits",
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Tutor Search Interface',
        caption: 'Advanced search interface for finding the perfect tutor',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Tutor Profile',
        caption: 'Detailed tutor profile showing qualifications and reviews',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Booking System',
        caption: 'Intuitive scheduling and booking system',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Student Dashboard',
        caption:
          'Student dashboard showing upcoming sessions and learning progress',
      },
    ],
    technologies: [
      'NextJS',
      'Tailwind',
      'Docker',
      'Resend',
      'PostgreSQL',
      'Stripe',
    ],
    features: [
      'Advanced tutor-student matching algorithm',
      'Integrated scheduling system with calendar sync',
      'Secure payment processing with Stripe',
      'Video conferencing integration for online tutoring',
      'Comprehensive review and rating system',
      'Resource sharing for learning materials',
      'Progress tracking for students',
    ],
    techDetails: {
      stack: [
        'Next.js',
        'Tailwind CSS',
        'Docker',
        'Resend',
        'PostgreSQL',
        'Prisma ORM',
        'Stripe API',
        'Google Calendar API',
        'Zoom API',
      ],
      architecture:
        'Matmajka uses a monolithic architecture built with Next.js, leveraging server components for improved performance. The application uses PostgreSQL for data storage and implements a RESTful API for client-server communication.',
      challenges: [
        {
          challenge:
            'Creating an effective matching algorithm that considers multiple factors',
          solution:
            'Developed a weighted scoring system that considers subject expertise, teaching style, past ratings, and availability patterns',
        },
        {
          challenge: 'Handling complex scheduling with timezone differences',
          solution:
            'Implemented a robust scheduling system that handles timezone conversions automatically and prevents double-bookings',
        },
        {
          challenge: 'Ensuring secure and reliable payment processing',
          solution:
            'Integrated Stripe with a custom payment flow that handles various scenarios including cancellations, refunds, and recurring payments',
        },
      ],
    },
    completedDate: 'October 2023',
    duration: '3 months',
    outcome:
      'Matmajka has successfully connected over 500 students with qualified tutors in its first six months of operation. The platform has received positive feedback from both students and tutors, with many reporting significant improvements in academic performance.',
    demoUrl: 'https://matmajka.shirone.xyz',
    githubUrl: 'https://github.com/shirone/matmajka',
    featured: true,
  },
  {
    id: 'toriime',
    slug: 'toriime',
    title: 'Toriime',
    summary:
      'A streaming platform for finding and watching anime series and movies with Polish subtitles.',
    description: [
      'Toriime is a specialized streaming platform created to serve the Polish anime community by providing a comprehensive library of anime content with high-quality Polish subtitles. The platform was developed in response to the limited availability of legally subtitled anime content in Polish.',
      "The project involved not only building a robust streaming platform but also establishing a community of translators and subtitle editors who could provide accurate and culturally appropriate translations. This community aspect has become one of the platform's most distinctive features.",
      'The technical implementation of Toriime required solving several challenges, including efficient video streaming, subtitle synchronization, and content management. The platform also includes social features such as user reviews, recommendations, and discussion forums to foster community engagement.',
    ],
    image: '/placeholder.svg?height=400&width=600',
    gallery: [
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Toriime Homepage',
        caption: 'The homepage featuring trending and recommended anime',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Video Player',
        caption:
          'Custom video player with subtitle controls and quality options',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Anime Details Page',
        caption:
          'Detailed anime information page with episodes, reviews, and related content',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Community Forum',
        caption: 'Active community discussion forums for anime fans',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Translator Dashboard',
        caption: 'Specialized dashboard for community translators',
      },
    ],
    technologies: [
      'NextJS',
      'Shadcn',
      'TypeScript',
      'Tailwind',
      'MongoDB',
      'Prisma',
    ],
    features: [
      'Extensive library of anime with Polish subtitles',
      'Custom video player with advanced subtitle controls',
      'User profiles with watch history and favorites',
      'Community translation tools and workflow',
      'Recommendation engine based on viewing habits',
      'Discussion forums for each anime series',
      'Mobile-responsive design for on-the-go viewing',
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
        'CloudFront',
        'FFmpeg',
        'WebVTT',
      ],
      architecture:
        'Toriime uses a microservices architecture with Next.js for the frontend and dedicated services for video processing, subtitle management, and user authentication. Content is stored in MongoDB with media files hosted on AWS S3 and delivered via CloudFront CDN.',
      challenges: [
        {
          challenge: 'Efficient video streaming with multiple subtitle tracks',
          solution:
            'Implemented adaptive bitrate streaming with HLS and custom subtitle rendering for optimal performance across devices',
        },
        {
          challenge: 'Managing a community translation workflow',
          solution:
            'Developed a specialized translation management system with review processes, version control, and quality assurance tools',
        },
        {
          challenge: 'Content recommendation at scale',
          solution:
            'Created a hybrid recommendation system combining collaborative filtering and content-based approaches with real-time user preference updates',
        },
      ],
    },
    completedDate: 'August 2023',
    duration: '5 months',
    outcome:
      'Toriime has grown to become the largest Polish-language anime streaming platform, with over 10,000 active users and a library of more than 500 anime titles. The community translation aspect has been particularly successful, with over 100 volunteer translators contributing to the platform.',
    demoUrl: 'https://toriime.shirone.xyz',
    githubUrl: 'https://github.com/shirone/toriime',
    featured: true,
  },
  {
    id: 'portfolio',
    slug: 'portfolio',
    title: 'Portfolio Website',
    summary:
      'My personal portfolio website built with Next.js and Tailwind CSS to showcase my projects and skills.',
    description: [
      'This portfolio website serves as a digital showcase of my work, skills, and professional journey. Built with modern web technologies, it reflects not only my technical abilities but also my design sensibilities and attention to detail.',
      'The site was designed with a focus on user experience, accessibility, and performance. I wanted to create a platform that would effectively communicate my value proposition to potential clients and employers while also serving as a playground for implementing new technologies and design patterns.',
      'The development process involved careful planning of the information architecture, creating wireframes and mockups, and iteratively refining the design based on feedback. The result is a clean, responsive website that effectively presents my work and professional identity.',
    ],
    image: '/placeholder.svg?height=400&width=600',
    gallery: [
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Portfolio Homepage',
        caption: 'The welcoming homepage with animated elements',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Projects Overview',
        caption: 'Projects section showcasing my work',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'About Page',
        caption: 'About page with personal information and skills',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Contact Form',
        caption: 'Interactive contact form with animations',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Dark Mode Toggle',
        caption: 'Theme toggle with smooth transition animations',
      },
    ],
    technologies: [
      'NextJS',
      'TypeScript',
      'Tailwind',
      'Framer Motion',
      'Shadcn',
    ],
    features: [
      'Responsive design that works seamlessly across all devices',
      'Dark and light mode with smooth transitions',
      'Animated UI elements using Framer Motion',
      'Optimized performance with Next.js',
      'Accessible design following WCAG guidelines',
      'Detailed project showcases with comprehensive information',
      'Interactive contact form with validation',
    ],
    techDetails: {
      stack: [
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'Framer Motion',
        'Shadcn UI',
        'Vercel',
        'React',
        'ESLint',
      ],
      architecture:
        'The portfolio is built as a static site using Next.js, with client-side interactivity added through React hooks and Framer Motion. The site is deployed on Vercel for optimal performance and reliability.',
      challenges: [
        {
          challenge: 'Creating smooth animations without affecting performance',
          solution:
            'Used Framer Motion with careful optimization, including lazy loading and animation orchestration to maintain 60fps even on mobile devices',
        },
        {
          challenge: 'Implementing a seamless dark/light mode transition',
          solution:
            'Developed a theme system using CSS variables and context API with smooth transitions between modes',
        },
        {
          challenge: 'Ensuring accessibility across all interactive elements',
          solution:
            'Implemented ARIA attributes, keyboard navigation, and focus management while maintaining the visual design',
        },
      ],
    },
    completedDate: 'March 2024',
    duration: '2 weeks',
    outcome:
      'The portfolio website has effectively served as a professional showcase, leading to new client inquiries and positive feedback from the developer community. It continues to evolve with regular updates and refinements.',
    demoUrl: 'https://shirone.xyz',
    githubUrl: 'https://github.com/shirone/portfolio',
    featured: false,
  },
  {
    id: 'weather-app',
    slug: 'weather-app',
    title: 'Weather App',
    summary:
      'A simple yet powerful weather application that provides current conditions and forecasts for any location.',
    description: [
      'This weather application was developed as a practical solution for checking weather conditions and forecasts for any location around the world. While there are many weather apps available, I wanted to create one that combined simplicity with comprehensive data in an aesthetically pleasing interface.',
      'The app uses the OpenWeather API to fetch accurate weather data, including current conditions, hourly forecasts, and 7-day predictions. Users can search for locations by city name or use geolocation to get weather information for their current position.',
      'Beyond just displaying temperature and conditions, the app includes additional useful metrics such as humidity, wind speed and direction, visibility, and UV index. The interface changes dynamically based on the current weather conditions and time of day, providing a more immersive experience.',
    ],
    image: '/placeholder.svg?height=400&width=600',
    gallery: [
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Weather App Homepage',
        caption: 'Main interface showing current weather conditions',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Weekly Forecast',
        caption: '7-day forecast with detailed information',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Hourly Forecast',
        caption: 'Hourly forecast with temperature trends',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Location Search',
        caption: 'Location search interface with autocomplete',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Weather Details',
        caption: 'Detailed weather metrics and information',
      },
    ],
    technologies: ['React', 'CSS', 'OpenWeather API', 'Geolocation API'],
    features: [
      'Current weather conditions with visual representations',
      '7-day forecast with detailed information',
      'Hourly forecast with temperature trends',
      'Location search with autocomplete',
      'Geolocation support for current position',
      'Dynamic backgrounds based on weather and time',
      'Detailed weather metrics (humidity, wind, pressure, etc.)',
    ],
    techDetails: {
      stack: [
        'React',
        'CSS Modules',
        'OpenWeather API',
        'Geolocation API',
        'LocalStorage',
        'Axios',
        'React Icons',
      ],
      architecture:
        'The Weather App is built as a single-page application using React. It uses a component-based architecture with state management through React hooks. Data is fetched from the OpenWeather API and cached in localStorage for improved performance.',
      challenges: [
        {
          challenge: 'Handling rate limits of the free OpenWeather API tier',
          solution:
            'Implemented intelligent caching with localStorage and request throttling to stay within API limits while maintaining data freshness',
        },
        {
          challenge:
            'Creating dynamic visuals that accurately represent weather conditions',
          solution:
            'Developed a comprehensive mapping system between weather codes and visual assets, with time-of-day variations',
        },
        {
          challenge:
            'Ensuring accurate location detection across different devices',
          solution:
            'Combined IP-based geolocation with browser Geolocation API, with fallbacks and error handling for optimal user experience',
        },
      ],
    },
    completedDate: 'January 2023',
    duration: '3 weeks',
    outcome:
      'The Weather App has been well-received by users who appreciate its clean interface and comprehensive data presentation. It serves as a practical tool while also demonstrating front-end development capabilities.',
    demoUrl: 'https://weather.shirone.xyz',
    githubUrl: 'https://github.com/shirone/weather-app',
    featured: false,
  },
  {
    id: 'todo-app',
    slug: 'todo-app',
    title: 'Todo App',
    summary:
      'A feature-rich task management application with authentication and database storage.',
    description: [
      'While a todo app might seem like a simple project, this implementation goes beyond the basics to create a fully-featured task management system. The application includes user authentication, persistent storage, and a range of productivity features designed to help users effectively manage their tasks.',
      'The app was built with a focus on user experience, ensuring that adding, organizing, and completing tasks is as frictionless as possible. The interface is clean and intuitive, with thoughtful touches like keyboard shortcuts, drag-and-drop reordering, and subtle animations that make the app a pleasure to use.',
      'On the technical side, the application demonstrates implementation of authentication flows, database integration, and state management in a Next.js application. It serves as a practical example of building a full-stack application with modern web technologies.',
    ],
    image: '/placeholder.svg?height=400&width=600',
    gallery: [
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Todo App Dashboard',
        caption: 'Main dashboard showing task lists and categories',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Task Creation',
        caption: 'Task creation interface with priority and due date options',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Task Categories',
        caption: 'Category management for organizing tasks',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Authentication Screen',
        caption: 'User authentication interface',
      },
      {
        src: '/placeholder.svg?height=800&width=1200',
        alt: 'Mobile View',
        caption: 'Responsive mobile interface for on-the-go task management',
      },
    ],
    technologies: ['NextJS', 'Tailwind', 'Prisma', 'PostgreSQL', 'NextAuth'],
    features: [
      'User authentication with email/password and social login options',
      'Task creation with title, description, priority, and due date',
      'Task categorization and tagging',
      'Drag-and-drop reordering of tasks',
      'Filtering and sorting options',
      'Dark and light mode support',
      'Responsive design for all devices',
    ],
    techDetails: {
      stack: [
        'Next.js',
        'Tailwind CSS',
        'Prisma ORM',
        'PostgreSQL',
        'NextAuth.js',
        'React DnD',
        'date-fns',
        'Zod',
      ],
      architecture:
        'The Todo App uses a full-stack architecture with Next.js. The frontend is built with React components and Tailwind CSS, while the backend uses Next.js API routes with Prisma ORM for database operations. Authentication is handled by NextAuth.js.',
      challenges: [
        {
          challenge:
            'Implementing secure authentication with multiple providers',
          solution:
            'Used NextAuth.js with careful configuration of JWT handling and session management for secure multi-provider authentication',
        },
        {
          challenge:
            'Creating a responsive drag-and-drop interface that works on mobile',
          solution:
            'Implemented React DnD with custom touch handlers and fallback interfaces for devices without drag support',
        },
        {
          challenge: 'Optimizing database queries for performance',
          solution:
            "Used Prisma's relation queries and pagination to minimize database load, with strategic caching for frequently accessed data",
        },
      ],
    },
    completedDate: 'November 2023',
    duration: '4 weeks',
    outcome:
      'The Todo App demonstrates how a seemingly simple concept can be elevated through thoughtful design and robust implementation. It serves both as a practical tool and as a showcase of full-stack development capabilities.',
    demoUrl: 'https://todo.shirone.xyz',
    githubUrl: 'https://github.com/shirone/todo-app',
    featured: false,
  },
]
