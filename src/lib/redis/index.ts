import createRedisClient from 'ioredis'

import { env } from '@/env/server'

const redisClient = new createRedisClient(env.REDIS_HOST)

export default redisClient
