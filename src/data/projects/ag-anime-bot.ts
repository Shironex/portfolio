import { Project } from '@/types'

export const agAnimeBot: Project = {
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
      caption: 'Cache statistics showing priority distribution and job status',
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
}
