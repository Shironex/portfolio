import Redis from 'ioredis'

import { env } from '@/env/server'

const redisClient = new Redis(env.REDIS_HOST, {
  // ioredis 6 switched the default retry backoff from linear to exponential,
  // which stretches time-to-failure during a Redis outage from roughly 10s to
  // over a minute. The contact form awaits the rate limiter before doing
  // anything else, so keep the v5 linear backoff and fail fast instead.
  retryStrategy: (times) => Math.min(times * 50, 2000),
})

export default redisClient
