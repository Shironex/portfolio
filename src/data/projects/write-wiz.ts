import { Project } from '@/types'

export const writeWiz: Project = {
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
      caption: 'Events section with all the events coming from the API Webhook',
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
    'Changelog enhanced with AI suggestions and Markdown formatting with ability to integrate it with current project',
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
        solution: 'Used BullMQ for background processing of heavy computations',
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
}
