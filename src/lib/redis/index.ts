import Redis from 'ioredis'

import { env } from '@/env/server'

const redisClient = new Redis(env.REDIS_HOST)

export default redisClient
