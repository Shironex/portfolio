import { z } from 'zod'

import { UPSTREAM_USER_AGENT } from '@/lib/feed-cache'

import { env } from '@/env/server'

/** GitHub login whose activity and contributions the site shows. */
export const GITHUB_USERNAME = 'shironex'

const GITHUB_TIMEOUT_MS = 10_000

const GraphQLErrorsSchema = z.object({
  errors: z.array(z.object({ message: z.string() })).optional(),
})

/**
 * POST a query to GitHub's GraphQL API with the configured token and return
 * the raw JSON body. Throws on a non-2xx status and when the body carries
 * GraphQL `errors`, so callers only parse `data` with their own Zod schema.
 *
 * `signal` lets a caller put one budget on a chain of requests; each request
 * still has its own timeout.
 */
export async function githubGraphql(
  query: string,
  variables: Record<string, unknown>,
  signal?: AbortSignal
): Promise<unknown> {
  if (!env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN not configured')
  }

  const timeout = AbortSignal.timeout(GITHUB_TIMEOUT_MS)
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': UPSTREAM_USER_AGENT,
    },
    body: JSON.stringify({ query, variables }),
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  })

  if (!res.ok) {
    throw new Error(`GitHub GraphQL returned ${res.status}`)
  }

  const json: unknown = await res.json()
  const { errors } = GraphQLErrorsSchema.parse(json)
  if (errors?.length) {
    throw new Error(errors[0].message)
  }

  return json
}
