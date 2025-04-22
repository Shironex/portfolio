/* eslint-disable n/no-process-env */
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production', 'test']),
    RESEND_API_KEY: z.string().min(1),
    RESEND_MAIL_TO: z.string().min(1),
    TURNSTILE_SECRET_KEY: z.string().min(1),
    REDIS_HOST: z.string().min(1),
    SENTRY_URL: z.string().min(1),
    SENTRY_DSN: z.string().min(1),
  },
  onValidationError: (issues) => {
    console.error('❌ Invalid environment variables:', issues)
    throw new Error('Invalid environment variables')
  },
  // Called when server variables are accessed on the client.
  onInvalidAccess: (variable: string) => {
    throw new Error(
      `❌ Attempted to access a server-side environment variable: ${variable} on the client`
    )
  },
  isServer: typeof window === 'undefined',
  emptyStringAsUndefined: false,
  experimental__runtimeEnv: process.env,
})
