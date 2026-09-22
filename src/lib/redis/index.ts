import Redis from 'ioredis'

import { env } from '@/env/server'

/**
 * Two ioredis v6 defaults are pinned back to their v5 behaviour so the major
 * bump does not silently change how this client behaves under failure. Both are
 * safe to drop once the production Redis has been observed on v6.
 *
 * `retryStrategy` — v6 switched the default from linear (`times * 50`, capped
 * at 2s) to exponential with jitter (`2^(times-1) * 50`, capped at 5s). With
 * `maxRetriesPerRequest` left at its default of 20, that stretches the time a
 * command spends failing against a dead Redis from ~10.5s to ~73s. That matters
 * here: `rateLimitByKey` is awaited without a try/catch in the contact form
 * action, and a thrown `MaxRetriesPerRequestError` is not a `PublicError`, so it
 * surfaces as a blocking "Something went wrong" — after a wait long enough to
 * exceed most serverless function timeouts.
 *
 * `protocol` — v6 negotiates RESP3 (`HELLO 3`) by default. It auto-downgrades on
 * a `NOPROTO` reply, but treats any other handshake error as fatal. This client
 * only issues GET/INCR/EXPIRE, which behave identically under RESP2, so there is
 * nothing to gain here and a connection-time failure mode to avoid.
 */
const redisClient = new Redis(env.REDIS_HOST, {
  retryStrategy: (times) => Math.min(times * 50, 2000),
  protocol: 2,
})

export default redisClient
