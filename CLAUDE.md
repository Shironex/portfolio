# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `pnpm dev` - Start development server with Turbo mode
- `pnpm dev:email` - Start email development server on port 3001
- `docker-compose up -d` - Start Redis and Mailhog services

### Build & Production

- `pnpm build` - Build the project with Turbo mode
- `pnpm start` - Start production server
- `pnpm typecheck` - Run TypeScript type checking

### Code Quality

- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

### Git & Release

- `pnpm commit` - Use commitizen for conventional commits
- `pnpm release` - Create a new release with standard-version
- Pre-commit hooks run automatically via Husky

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 15 with App Router and Turbo mode
- **Language**: TypeScript with strict mode
- **Styling**: TailwindCSS with custom animations
- **UI Components**: Shadcn UI + Radix UI primitives
- **Form Handling**: React Hook Form + Zod validation
- **State Management**: Next Safe Action for server actions
- **Email**: Resend + React Email templates
- **Queue**: BullMQ with Redis for background jobs
- **Monitoring**: Sentry for error tracking
- **Security**: Cloudflare Turnstile for bot protection

### Project Structure

- `/src/app/` - Next.js App Router pages and layouts
- `/src/components/` - Reusable React components
  - `/ui/` - Shadcn UI components
  - `/layout/` - Layout components (navbar, footer)
  - `/sections/` - Page sections
  - `/card/` - Card components
- `/src/lib/` - Core utilities and integrations
  - `/discord/` - Discord webhook integration
  - `/mail/` - Email templates and rendering
  - `/queue/` - BullMQ job queue setup
  - `/ratelimit/` - Redis-based rate limiting
  - `/workers/` - Background job workers
- `/src/content/` - MDX content for articles
- `/src/env/` - Type-safe environment variables (client.ts, server.ts)

### Key Patterns

1. **Server Actions**: Uses Next Safe Action for type-safe server mutations
2. **Environment Variables**: Validated with Zod through @t3-oss/env-nextjs
3. **Error Handling**: Custom error classes in `/lib/errors/`
4. **Background Jobs**: Discord notifications sent via BullMQ queue
5. **MDX Processing**: Articles use MDX with syntax highlighting and custom components
6. **Image Optimization**: Project screenshots stored in `/public/projects/`

### Important Considerations

- Node.js >= 22.11.0 and pnpm >= 10.9.0 required
- Environment variables must be set based on `.env.example`
- Redis and mail server run via Docker Compose
- File/folder naming uses kebab-case (enforced by ESLint)
- No process.env access allowed (use typed env imports)
- Sentry integration for production error tracking

## Sentry Integration

### Configuration Files

- **Client-side**: `instrumentation-client.ts`
- **Server-side**: `sentry.server.config.ts`
- **Edge runtime**: `sentry.edge.config.ts`

Import Sentry in other files using: `import * as Sentry from "@sentry/nextjs"`

### Exception Handling

Use `Sentry.captureException(error)` in try-catch blocks to capture and log errors:

```javascript
try {
  // Your code here
} catch (error) {
  Sentry.captureException(error)
}
```

### Performance Monitoring with Spans

Create spans for meaningful actions like API calls, button clicks, and function executions:

#### Component Actions Example

```javascript
function TestComponent() {
  const handleTestButtonClick = () => {
    Sentry.startSpan(
      {
        op: 'ui.click',
        name: 'Test Button Click',
      },
      (span) => {
        span.setAttribute('config', 'some config')
        span.setAttribute('metric', 'some metric')
        doSomething()
      }
    )
  }

  return (
    <button type="button" onClick={handleTestButtonClick}>
      Test Sentry
    </button>
  )
}
```

#### API Calls Example

```javascript
async function fetchUserData(userId) {
  return Sentry.startSpan(
    {
      op: 'http.client',
      name: `GET /api/users/${userId}`,
    },
    async () => {
      const response = await fetch(`/api/users/${userId}`)
      const data = await response.json()
      return data
    }
  )
}
```

### Logging

Enable logging in Sentry configuration:

```javascript
Sentry.init({
  dsn: 'your-dsn-here',
  _experiments: {
    enableLogs: true,
  },
  integrations: [
    // Optionally send console logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ['log', 'error', 'warn'] }),
  ],
})
```

Use structured logging with the Sentry logger:

```javascript
const { logger } = Sentry

logger.trace('Starting database connection', { database: 'users' })
logger.debug(logger.fmt`Cache miss for user: ${userId}`)
logger.info('Updated profile', { profileId: 345 })
logger.warn('Rate limit reached for endpoint', {
  endpoint: '/api/results/',
  isEnterprise: false,
})
logger.error('Failed to process payment', {
  orderId: 'order_123',
  amount: 99.99,
})
logger.fatal('Database connection pool exhausted', {
  database: 'users',
  activeConnections: 100,
})
```

### Best Practices

- Use meaningful `name` and `op` properties for spans
- Add relevant attributes to spans for better context
- Use `logger.fmt` template literals for structured logging with variables
- Child spans can be nested within parent spans for detailed tracing
