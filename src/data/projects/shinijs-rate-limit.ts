import { Project } from '@/types'

export const shiniJsRateLimit: Project = {
  id: 'shinijs-rate-limit',
  slug: 'shinijs-rate-limit',
  title: '@shinijs/rate-limit',
  summary:
    'A flexible rate limiting solution for NestJS applications with Redis support and automatic memory-based fallback for distributed systems.',
  description: [
    '@shinijs/rate-limit is a comprehensive rate limiting library designed for NestJS applications that need to scale horizontally. Built with Redis as the primary backend, it provides distributed rate limiting across multiple application instances while gracefully falling back to in-memory storage when Redis is unavailable, making it perfect for both development and production environments.',
    "The library offers three flexible integration patterns: decorators combined with guards for route-level protection, interceptors that automatically add rate limit headers to responses, or direct service usage for fine-grained control. Each pattern is fully type-safe and integrates seamlessly with NestJS's dependency injection system. The built-in health monitoring ensures you can track Redis connectivity status and handle failures gracefully.",
    'With support for custom time windows (seconds, minutes, hours, days), per-route rate limits, and comprehensive test coverage (33+ passing tests), the library is battle-tested and production-ready. It integrates seamlessly with @shinijs/logger for consistent application logging and provides a robust foundation for API protection in modern distributed systems.',
  ],
  projectType: 'library',
  gallery: [],
  technologies: [
    'NestJS',
    'TypeScript',
    'Redis',
    'ioredis',
    'RxJS',
    'VitePress',
    'Jest',
  ],
  features: [
    'Distributed rate limiting using Redis',
    'Automatic fallback to memory when Redis unavailable',
    'Multiple integration patterns (decorators, guards, interceptors)',
    'Full TypeScript support with type safety',
    'Per-route customizable rate limits',
    'Flexible time window formats (s, m, h, d)',
    'Built-in health monitoring for Redis connectivity',
    'Rate limit headers in responses (with interceptor)',
    'Custom logger support (@shinijs/logger integration)',
    'Battle-tested with comprehensive test coverage (33+ tests)',
    'RxJS-based reactive patterns',
    'Environment-based configuration (REDIS_URL)',
    'Global module pattern (import once, use everywhere)',
    'Comprehensive VitePress documentation',
    'Graceful degradation for single-instance apps',
  ],
  techDetails: {
    stack: [
      'NestJS 11.0+',
      'TypeScript 5',
      'ioredis 5.0+',
      'RxJS 7.8+',
      '@nestjs/config 4.0+',
      'Reflect-metadata',
      'VitePress',
      'Jest',
    ],
    architecture:
      '@shinijs/rate-limit is architected as a NestJS global module with a sophisticated fallback mechanism. The primary storage backend uses ioredis for distributed rate limiting across horizontal scaling scenarios, with an in-memory Map as a fallback when Redis is unavailable. The module exposes three integration patterns: decorator + guard pattern for declarative route protection, interceptor pattern for automatic rate limit headers, and direct service injection for programmatic control. Configuration is environment-based using REDIS_URL, with automatic detection and fallback. The health check system continuously monitors Redis connectivity, allowing the application to respond appropriately to infrastructure failures. Time window parsing supports flexible formats (10s, 5m, 1h, 7d) for intuitive rate limit configuration.',
    challenges: [
      {
        challenge:
          'Implementing distributed rate limiting that works across multiple application instances',
        solution:
          'Built the core storage layer on Redis with atomic operations using ioredis, ensuring accurate rate limit tracking across horizontally scaled deployments while maintaining high performance with efficient key-value operations',
      },
      {
        challenge: 'Providing graceful degradation when Redis is unavailable',
        solution:
          'Implemented automatic fallback to in-memory storage with the same interface, detecting Redis failures during initialization and runtime, allowing developers to work without Redis in development and providing resilience in production',
      },
      {
        challenge:
          'Supporting multiple integration patterns for different use cases',
        solution:
          'Designed three distinct patterns: decorators with guards for declarative route protection, interceptors for automatic response headers, and direct service usage for complex scenarios, all sharing the same underlying rate limiting logic',
      },
      {
        challenge: 'Testing rate limiting behavior with Redis dependencies',
        solution:
          'Created comprehensive test suite with 33+ tests using mocked Redis clients and in-memory storage, validating distributed behavior, fallback mechanisms, time window parsing, and health monitoring across all integration patterns',
      },
    ],
  },
  completedDate: 'November 2025',
  duration: '1 day',
  demoUrl: 'https://shinijs.github.io/rate-limit/',
  githubUrl: 'https://github.com/shinijs/rate-limit',
  featured: false,
}
