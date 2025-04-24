import { Queue } from 'bullmq'

import redisClient from '../redis'

export const discordQueue = new Queue('discord-webhook', {
  connection: redisClient,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
})
