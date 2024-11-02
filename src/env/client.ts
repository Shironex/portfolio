/* eslint-disable n/no-process-env */
import { createEnv } from '@t3-oss/env-nextjs'
import { ZodError, z } from 'zod'

export const env = createEnv({
  client: {
    NEXT_PUBLIC_PUBLIC_URL: z.string().min(1),
    NEXT_PUBLIC_SKIP_EVENTS: z.string().optional(),
    NEXT_PUBLIC_WRITEWIZ_PROJECT_ID: z.string().optional(),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_PUBLIC_URL: process.env.NEXT_PUBLIC_PUBLIC_URL,
    NEXT_PUBLIC_SKIP_EVENTS: process.env.NEXT_PUBLIC_SKIP_EVENTS,
    NEXT_PUBLIC_WRITEWIZ_PROJECT_ID:
      process.env.NEXT_PUBLIC_WRITEWIZ_PROJECT_ID,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  },
  onValidationError: (error: ZodError) => {
    console.error(
      '❌ Invalid environment variables:',
      error.flatten().fieldErrors
    )
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
})