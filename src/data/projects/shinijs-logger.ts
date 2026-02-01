import { Project } from '@/types'

export const shiniJsLogger: Project = {
  id: 'shinijs-logger',
  slug: 'shinijs-logger',
  title: '@shinijs/logger',
  summary:
    'A Pino-based structured logger for NestJS applications with file rotation, pretty printing, and comprehensive TypeScript support.',
  description: [
    '@shinijs/logger is a fast, low-overhead structured logging solution designed specifically for the NestJS ecosystem. Built on top of Pino, one of the fastest logging libraries in the Node.js ecosystem, it provides beautiful colorized console output during development and efficient JSON-structured logging for production environments.',
    'The library seamlessly integrates with NestJS through dependency injection, offering both traditional NestJS LoggerService patterns and a flexible LoggerFactory approach. It includes automatic daily log file rotation, ensuring your logs are organized and manageable over time. The context-aware logging system allows you to create scoped loggers that automatically tag all messages with relevant context information for better debugging and tracing.',
    'Built with TypeScript-first principles, the library provides full type safety and IntelliSense support throughout. Configuration is entirely environment-based with sensible defaults, making it trivial to switch between development and production logging modes. The library also integrates seamlessly with other @shinijs packages, particularly @shinijs/rate-limit, for comprehensive application monitoring.',
  ],
  projectType: 'library',
  gallery: [],
  technologies: [
    'NestJS',
    'TypeScript',
    'Pino',
    'Pino Pretty',
    'VitePress',
    'Jest',
  ],
  features: [
    'Fast, low-overhead structured logging powered by Pino',
    'Seamless NestJS integration via dependency injection',
    'Beautiful colorized console output with pino-pretty',
    'Automatic daily log file rotation',
    'Environment-based configuration with sensible defaults',
    'Full TypeScript support with type safety',
    'Context-aware logging for better tracing',
    'Multiple logger patterns (DI and Factory)',
    'Structured JSON output for production',
    'Multiple log levels (trace, debug, info, warn, error, fatal)',
    'Simultaneous console and file logging',
    'Global module pattern (import once, use everywhere)',
    'Integration with @nestjs/config for configuration',
    'Comprehensive VitePress documentation site',
    'Battle-tested with Jest test coverage',
  ],
  techDetails: {
    stack: [
      'NestJS 11.0+',
      'TypeScript 5',
      'Pino 10.0+',
      'Pino-pretty 13.0+',
      '@nestjs/config 4.0+',
      'Reflect-metadata',
      'VitePress',
      'Jest',
    ],
    architecture:
      '@shinijs/logger follows a modular architecture designed for the NestJS ecosystem. The core LoggerModule is a global module that can be imported once in your root module and used throughout your application. It provides two primary patterns: a traditional dependency injection approach using the LoggerService interface, and a factory pattern using LoggerFactory for more flexible use cases. The library uses environment variables for configuration (LOG_LEVEL, LOG_PRETTY_PRINT, LOG_FILE_ENABLED, LOG_FILE_PATH), allowing seamless transitions between development and production environments. File logging uses daily rotation to prevent log files from growing unbounded, with timestamps in filenames for easy organization.',
    challenges: [
      {
        challenge:
          'Balancing performance with feature richness in NestJS logging',
        solution:
          'Chose Pino as the underlying engine for its exceptional performance (low overhead and fast JSON serialization) while building an ergonomic NestJS wrapper around it with features like context support and pretty printing',
      },
      {
        challenge:
          'Providing both pretty development logs and structured production logs',
        solution:
          'Implemented environment-based configuration that automatically switches between pino-pretty colorized output for development and raw JSON structured logging for production, with all settings controlled via environment variables',
      },
      {
        challenge:
          'Creating a flexible logger that works with different NestJS patterns',
        solution:
          'Designed dual integration patterns: LoggerService for traditional dependency injection (following NestJS conventions) and LoggerFactory for factory pattern usage, giving developers flexibility in how they consume the logger',
      },
      {
        challenge:
          'Managing log file growth in long-running production applications',
        solution:
          'Implemented automatic daily log file rotation with timestamp-based filenames, preventing unbounded file growth while maintaining organized historical logs that can be archived or cleaned up based on retention policies',
      },
    ],
  },
  completedDate: 'November 2025',
  duration: '1 day',
  demoUrl: 'https://shinijs.github.io/logger/',
  githubUrl: 'https://github.com/shinijs/logger',
  featured: false,
}
