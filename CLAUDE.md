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

### Tests

- `pnpm test:e2e` - Playwright end to end tests (Chromium runs every spec, WebKit and Firefox run `pixel-crisp` only)
- `pnpm test:pixel` - Node unit tests of the pixel art scripts (`scripts/pixel/test/`)

### Code Quality

- `pnpm lint` - Run ESLint, then `tokens:check`, `art:check`, `art:fresh` and `test:pixel`
- `pnpm tokens` / `pnpm tokens:check` - Write or check the colour tokens and their contrast gate (`scripts/gen-tokens.mjs`)
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

### Pixel art

The Aseprite sources live outside the repo (`../aseprite-demo/`); their exports in `src/assets/pixel/` and every generated file are committed, so CI never needs Aseprite.

- `pnpm art:export` - Export the sheets from Aseprite (`--list`, `--only <name>`, `--dry-run`; locations at the top of `scripts/pixel/export-art.mjs`)
- `pnpm art:chrome`, `art:glyphs`, `art:cursors`, `art:icons`, `art:project-icons`, `art:wallpaper`, `art:pets`, `art:sprites` - Generate CSS, components and data from the sheets
- `pnpm art:check` - Gate on the sheets: palette, alpha, data and byte budgets (`scripts/pixel/art-manifest.mjs`)
- `pnpm art:fresh` - Fail if a generated file is stale
- `pnpm fonts:subset` - Subset the pixel fonts to WOFF2 in `src/app/fonts/` (needs uv; `--check`)
- `pnpm generate:og` - Copy the OG card bases and cut the icons into `src/app/_og/` (`--check`, `--og-dir`)
- `pnpm generate:icons` - Write the favicons and manifest icons from the README logo tile (`--check`)

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
  - `/os/` - ShiroOS desktop shell (windows, apps, taskbar, command palette, `pets/`, `wallpaper/`)
- `/src/assets/pixel/` - Exported pixel art sheets and their JSON (generated, committed)
- `/src/lib/` - Core utilities and integrations
  - `/discord/` - Discord webhook integration
  - `/og/` - Open Graph card layout and font metrics (Satori through `next/og`)
  - `/os/` - Shell state, tokens and the art pixel helpers
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
