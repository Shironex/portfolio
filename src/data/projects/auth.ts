import { Project } from '@/types'

export const auth: Project = {
  id: 'auth',
  slug: 'auth',
  title: '@noctcore/auth',
  summary:
    'Authentication for TypeScript servers, built as small modules you can read in an afternoon, each one tied to the attack it stops. An early preview on npm, not for production yet.',
  description: [
    'Most auth bugs are not exotic: a reset link that works twice, a session that survives a password change, a login form that tells an attacker which emails have accounts, a rate limit keyed on an IP the client chose itself. I wrote this library so that each of those has one small module whose first comment names the mistake, and whose code you can check against that comment.',
    'Sessions are opaque tokens stored only as a hash, with idle and absolute expiry and a revocation fence that a racing login cannot undo. Passwords use Argon2id with a rehash on login and a breached-password check. One-time tokens are single use, purpose bound and hashed at rest. Throttling is per door and fails closed, CSRF is checked by fetch metadata, origin and a signed token, client IPs trust only the proxy hops you run, and the captcha verifier treats an outage as a failure. Register, login and the reset request answer the same way whether or not an account exists.',
    'The app keeps its own routes: flows return results instead of throwing HTTP errors, and plugins (two-factor, membership, invitations) add functions, never endpoints. Five packages share one version: @noctcore/auth (the framework-free core), @noctcore/auth-redis and @noctcore/auth-prisma (stores), @noctcore/auth-nestjs (a closed-by-default session guard and CSRF middleware) and @noctcore/auth-trpc (guarded procedures). Any store that passes the conformance suite works, so Redis and Prisma are a starting point, not a requirement.',
    'It is an early preview, not for production: version 0.5.0 is on npm so people can try it, read the source and open issues, but the API may change in any release before 1.0. The docs site explains every defense in plain terms, and a threat model in the repo says what the library covers and what it leaves to the app.',
  ],
  image: '/projects/auth/thumbnail.webp',
  projectType: 'library',
  gallery: [
    {
      src: '/projects/auth/home.webp',
      alt: 'noctcore auth: Docs home',
      caption: 'Docs home: what the library defends against, module by module.',
    },
    {
      src: '/projects/auth/learn.webp',
      alt: 'noctcore auth: Revocation races and the epoch fence',
      caption:
        'A Learn page: why a racing login cannot undo a revocation, in plain terms.',
    },
    {
      src: '/projects/auth/build.webp',
      alt: 'noctcore auth: Use with NestJS guide',
      caption:
        'A Build guide: wiring the NestJS module, its session guard and CSRF middleware.',
    },
  ],
  technologies: ['TypeScript', 'Argon2id', 'Redis', 'Prisma', 'NestJS', 'tRPC'],
  features: [
    'One small module per attack, each starting with a comment that names the mistake it prevents',
    'Hashed session tokens with idle and absolute expiry, and revocation a racing login cannot undo',
    'Argon2id with rehash on login, a length-only policy and a breached-password check',
    'Single-use, purpose-bound, hashed tokens for verification codes and reset links',
    'Per-door throttling that fails closed, CSRF checks and spoof-proof client IPs',
    'Enumeration-safe register, login and reset flows',
    'Optional two-factor, membership and invitations plugins',
    'Five packages on one version: auth, auth-redis, auth-prisma, auth-nestjs, auth-trpc',
  ],
  techDetails: {
    stack: [
      'TypeScript',
      'Node.js 22+',
      '@node-rs/argon2',
      'ioredis',
      'Prisma 7',
      'NestJS',
      'tRPC + Zod',
      'Bun workspaces',
      'Astro Starlight (docs)',
      'GitHub Actions',
    ],
  },
  status: 'in-progress',
  duration: 'Ongoing',
  demoUrl: '',
  githubUrl: 'https://github.com/noctcore/auth',
  links: [
    {
      label: 'docs',
      url: 'https://noctcore.github.io/auth/',
      kind: 'docs',
    },
    {
      label: 'npm',
      url: 'https://www.npmjs.com/package/@noctcore/auth',
      kind: 'npm',
    },
    {
      label: 'releases',
      url: 'https://github.com/noctcore/auth/releases',
      kind: 'release',
    },
  ],
  featured: false,
}
