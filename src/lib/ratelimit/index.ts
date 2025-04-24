import Redis from 'ioredis'

import { env } from '@/env/server'

import redisClient from '../redis'

type Result = {
  limit: number
  remaining: number
  success: boolean
}

const rateLimiter = async (
  client: Redis,
  keyword: string,
  limit: number,
  duration: number
): Promise<Result> => {
  if (env.NODE_ENV === 'test' || env.NODE_ENV === 'development') {
    return { limit, remaining: limit, success: true } as Result
  }

  const key = `rate_limit:${keyword}`
  const currentCount = await client.get(key)
  const count = parseInt(currentCount as string, 10) || 0

  if (count >= limit) {
    return { limit, remaining: limit - count, success: false }
  }

  await client.incr(key)
  await client.expire(key, duration)

  return { limit, remaining: limit - (count + 1), success: true }
}

/**
 * Rate limits actions based on a unique keyword.
 *
 * @param keyword - A unique identifier for the rate limit (e.g., user ID or IP address).
 *
 * @param limit - The maximum number of allowed actions within the specified duration.
 *
 * @param duration - The time window in seconds for which the limit is applied.
 * @returns A promise that resolves to a Result object indicating the rate limit status.
 * @example
 * const result = await rateLimitByKey('user123', 100, 3600);
 * if (!result.success) {
 *   console.log('Rate limit exceeded');
 * }
 */
export const rateLimitByKey = async (
  keyword: string,
  limit: number,
  duration: number
): Promise<Result> => {
  const result = await rateLimiter(redisClient, keyword, limit, duration)

  return result
}

export const rateLimitBot = async (
  keyword: string,
  duration: number
): Promise<void> => {
  if (env.NODE_ENV === 'test' || env.NODE_ENV === 'development') {
    return
  }

  const key = `rate_limit:${keyword}`

  await redisClient.incr(key)
  await redisClient.expire(key, duration)
}

export default rateLimiter
