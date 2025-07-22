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
