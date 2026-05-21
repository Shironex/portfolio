import { PostHog } from 'posthog-node'

// NEXT_PUBLIC_POSTHOG_* vars must stay in @/env/client because Next.js only
// inlines NEXT_PUBLIC_ prefixed vars at build time; they're safe to read
// server-side too, so we reuse the client env module here intentionally.
import { env } from '@/env/client'

let posthogClient: PostHog | null = null

export function getPostHogClient() {
  if (!posthogClient) {
    posthogClient = new PostHog(env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
      host: env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    })
  }
  return posthogClient
}
