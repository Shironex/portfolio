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
- `pnpm release` - Local standard-version release (real releases come from semantic-release on push to `master`)
- Pre-commit hooks run automatically via Husky

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 16 with App Router and Turbo mode
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS 4 with custom animations
- **UI Components**: Shadcn UI + Radix UI primitives
- **Form Handling**: React Hook Form + Zod validation
- **State Management**: Next Safe Action for server actions
- **Email**: Resend + React Email templates
- **Security**: Cloudflare Turnstile for bot protection

### Project Structure

- `/src/app/` - Next.js App Router pages and layouts
- `/src/components/` - Reusable React components
  - `/ui/` - Shadcn UI components
  - `/os/` - ShiroOS desktop shell (windows, apps, taskbar, command palette)
  - `/icons/` - Icon components
- `/src/lib/` - Core utilities and integrations
  - `/discord/` - Discord webhook integration
  - `/mail/` - Email templates and rendering
  - `/ratelimit/` - Redis-based rate limiting
- `/src/data/` - Project and skills data
- `/src/env/` - Type-safe environment variables (client.ts, server.ts)

### Key Patterns

1. **Server Actions**: Uses Next Safe Action for type-safe server mutations
2. **Environment Variables**: Validated with Zod through @t3-oss/env-nextjs
3. **Error Handling**: Custom error classes in `/lib/errors/`
4. **Image Optimization**: Project screenshots stored in `/public/projects/`

### Important Considerations

- Node.js >= 22.13.0 and pnpm >= 10.9.0 required
- Environment variables must be set based on `.env.example`
- Redis and mail server run via Docker Compose
- File/folder naming uses kebab-case (enforced by ESLint)
- No process.env access allowed (use typed env imports)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
