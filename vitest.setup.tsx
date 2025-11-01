import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeAll, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Set test environment
beforeAll(() => {
  process.env.NODE_ENV = 'test'
})

// Mock server-only module
vi.mock('server-only', () => ({}))

// Mock environment variables
vi.mock('@/env/server', () => ({
  env: {
    NODE_ENV: 'test',
    REDIS_HOST: 'redis://localhost:6379',
    RESEND_API_KEY: 'test_key',
    RESEND_MAIL_TO: 'test@example.com',
    TURNSTILE_SECRET_KEY: 'test_secret',
    DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/test',
    ANALYTIC_URL: 'https://analytics.example.com',
    ANALYTIC_ID: 'test_id',
    CI: false,
  },
}))

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  notFound: vi.fn(),
  redirect: vi.fn(),
}))

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  startSpan: vi.fn((options, callback) => {
    // Execute the callback with a mock span
    const mockSpan = {
      setAttribute: vi.fn(),
      setAttributes: vi.fn(),
      end: vi.fn(),
    }
    return callback(mockSpan)
  }),
  withScope: vi.fn((callback) => callback({ setTag: vi.fn(), setExtra: vi.fn() })),
  logger: {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
    fmt: (strings: TemplateStringsArray, ...values: unknown[]) =>
      strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), ''),
  },
}))

// Mock Motion (Framer Motion fork)
vi.mock('motion/react', () => ({
  motion: new Proxy(
    {},
    {
      get: () => {
        const Component = ({ children, ...props }: any) => {
          // Remove motion-specific props
          const { initial, animate, exit, transition, variants, whileHover, whileTap, ...restProps } = props
          return children ? <div {...restProps}>{children}</div> : <div {...restProps} />
        }
        Component.displayName = 'motion.div'
        return Component
      },
    },
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useScroll: () => ({ scrollYProgress: { get: () => 0, on: vi.fn(), destroy: vi.fn() } }),
  useTransform: () => ({ get: () => 0, on: vi.fn(), destroy: vi.fn() }),
  useSpring: () => ({ get: () => 0, on: vi.fn(), destroy: vi.fn() }),
  useMotionValue: () => ({ get: () => 0, on: vi.fn(), destroy: vi.fn(), set: vi.fn() }),
  useInView: () => true,
}))

// Mock next-safe-action (will be overridden in specific tests)
vi.mock('next-safe-action', () => ({
  createSafeActionClient: vi.fn(() => ({
    use: vi.fn(() => ({
      use: vi.fn(() => ({
        use: vi.fn(() => ({
          schema: vi.fn(() => vi.fn()),
        })),
        schema: vi.fn(() => vi.fn()),
      })),
      schema: vi.fn(() => vi.fn()),
    })),
    schema: vi.fn(() => vi.fn()),
  })),
  DEFAULT_SERVER_ERROR_MESSAGE: 'Something went wrong',
}))

// Suppress console errors in tests (optional)
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
}
