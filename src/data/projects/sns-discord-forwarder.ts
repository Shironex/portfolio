import { Project } from '@/types'

export const snsDiscordForwarder: Project = {
  id: 'sns-discord-forwarder',
  slug: 'sns-discord-forwarder',
  title: 'AWS SNS Discord Forwarder',
  summary:
    'Lightweight Node.js service that monitors email deliverability and server security by forwarding AWS SNS notifications and RKHunter security scans to Discord.',
  description: [
    'AWS SNS Discord Forwarder is a production-ready monitoring service built with TypeScript and Express that provides real-time notifications for critical infrastructure events. The service integrates AWS Simple Email Service (SES) events and RKHunter security scan reports, forwarding structured alerts to Discord webhooks with rich embeds and color-coded severity levels.',
    'The service handles AWS SNS notifications with cryptographic signature verification to prevent spoofing, processing email bounce, complaint, and delivery events from SES. It parses and formats these events into actionable Discord messages, allowing teams to monitor email deliverability issues directly from their Discord servers.',
    'For security monitoring, the service accepts RKHunter log uploads, automatically parsing scan results to extract warnings, suspicious files, and system information. The parsed data is formatted into color-coded Discord embeds with full log file attachments, providing comprehensive security visibility. Built-in rate limiting, request validation, and health monitoring ensure reliable operation in production environments.',
  ],
  projectType: 'api',
  gallery: [],
  technologies: [
    'Node.js',
    'TypeScript',
    'Express',
    'AWS SNS',
    'AWS SES',
    'Discord Webhooks',
    'Multer',
    'Axios',
    'Jest',
    'ESLint',
    'Prettier',
  ],
  features: [
    'AWS SNS signature verification for security',
    'SES event handling (Bounces, Complaints, Deliveries)',
    'RKHunter security scan log parsing',
    'Rich Discord embeds with color-coded severity levels',
    'Multi-server support via custom headers',
    'Rate limiting (10 requests/hour for SNS endpoint)',
    'File upload support with 10MB size limit',
    'Automated health check endpoint with HTML/JSON responses',
    'Cron job integration for automated RKHunter scans',
    'Full log file attachments for security reports',
    'Timestamp and uptime tracking',
    'Request body size limiting',
    'Environment-based configuration',
    'Comprehensive unit test coverage',
    'Development and production modes',
  ],
  techDetails: {
    stack: [
      'Node.js >= 22.11.0',
      'TypeScript 5.9',
      'Express 5.1',
      'AWS SNS SDK',
      'Multer 2.0 (file uploads)',
      'Axios 1.12 (Discord webhooks)',
      'Express Rate Limit 8.1',
      'Jest 30.1 (testing)',
      'ESLint 9.35',
      'Prettier 3.6',
      'ts-node 10.9',
      'tsup 8.5 (build)',
    ],
    architecture:
      'The service follows a modular Express architecture with separation of concerns. Routes handle endpoint logic (/sns for AWS notifications, /report for RKHunter uploads, /health for monitoring). Utility modules provide reusable functionality: discordNotifier handles webhook integration, verifySignature validates SNS messages, and parser functions extract structured data from logs. Middleware includes body-parser for JSON/text, multer for file uploads, and express-rate-limit for abuse protection. The build process uses tsup for fast TypeScript compilation with public assets copied to the dist directory.',
    challenges: [
      {
        challenge: 'Securing SNS endpoint against unauthorized requests',
        solution:
          'Implemented AWS SNS signature verification with cryptographic validation of message signatures, topics, and certificates. Added rate limiting (10 requests/hour) to prevent abuse while allowing legitimate AWS notifications',
      },
      {
        challenge: 'Parsing unstructured RKHunter log files reliably',
        solution:
          'Built regex-based parser that extracts structured data from plain-text logs, handling variations in log formats. Extracts timestamps, warnings, suspicious files, and system info with fallback values for missing fields',
      },
      {
        challenge:
          'Creating actionable Discord notifications from raw event data',
        solution:
          'Designed rich embed formatting system with color-coded severity levels (green for success, orange for warnings, red for critical). Structured fields show relevant metadata while full log attachments provide complete context',
      },
      {
        challenge: 'Supporting multiple servers with single service instance',
        solution:
          'Added custom header support (x-server) for server identification in multi-server deployments. Cron jobs include hostname in requests, allowing centralized monitoring of distributed infrastructure',
      },
    ],
  },
  completedDate: 'April 2024',
  duration: '1 week',
  demoUrl: '',
  githubUrl: 'https://github.com/Shironex/sns-discord-forwarder',
  featured: false,
}
