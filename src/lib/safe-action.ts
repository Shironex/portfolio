import * as Sentry from '@sentry/nextjs'
import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'

import { env } from '@/env/server'

import { PublicError } from './errors'

// Base client.
const unauthenticatedAction = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    })
  },
  async handleServerError(err, utils) {
    const isAllowedError = err instanceof PublicError
    const isDev = env.NODE_ENV === 'development'

    if (isAllowedError || isDev) {
      console.error(err)
      return `${!isAllowedError && isDev ? 'DEV ONLY ENABLED - ' : ''}${err.message}`
    } else {
      console.error(err)
      Sentry.captureException(err, {
        tags: {
          source: 'server_action',
          actionName: utils?.metadata?.actionName || 'unknown',
        },
      })
      return 'Something went wrong'
    }
  },
}).use(async ({ next, metadata }) => {
  const startTime = performance.now()

  return await Sentry.startSpan(
    {
      name: `Server Action: ${metadata?.actionName || 'Unknown Action'}`,
      op: 'server.action',
    },
    async () => {
      const result = await next()

      const endTime = performance.now()
      console.log(
        `Action "${metadata?.actionName}" completed in ${Math.round(endTime - startTime)}ms`
      )

      return result
    }
  )
})

export { unauthenticatedAction }
