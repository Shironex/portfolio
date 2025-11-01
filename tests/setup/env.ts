/**
 * Test environment variables setup
 * This file sets up mock environment variables for testing
 */

// Set NODE_ENV to test
process.env.NODE_ENV = 'test'

// Server environment variables (from .env.test)
process.env.REDIS_HOST = 'redis://localhost:6379'
process.env.RESEND_API_KEY = 'test_resend_api_key_1234567890'
process.env.RESEND_MAIL_TO = 'test@example.com'
process.env.TURNSTILE_SECRET_KEY = 'test_turnstile_secret_key'
process.env.DISCORD_WEBHOOK_URL =
  'https://discord.com/api/webhooks/test/test_webhook_url'
process.env.ANALYTIC_URL = 'https://analytics.example.com'
process.env.ANALYTIC_ID = 'test_analytics_id'

// Client environment variables
process.env.NEXT_PUBLIC_PUBLIC_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = 'test_turnstile_site_key'

// Sentry (disabled in tests)
process.env.SENTRY_DSN = ''
process.env.SENTRY_ORG = ''
process.env.SENTRY_PROJECT = ''

// CI flag
process.env.CI = 'false'
