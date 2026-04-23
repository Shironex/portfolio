import posthog from 'posthog-js'

import { env } from '@/env/client'

posthog.init(env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
  api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
  ui_host: 'https://us.posthog.com',
  defaults: '2026-01-30',
  capture_exceptions: true,
  debug: process.env.NODE_ENV === 'development',
})
