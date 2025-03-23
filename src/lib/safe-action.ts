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
      return 'Something went wrong'
    }
  },
}).use(async ({ next, clientInput, metadata }) => {
  console.log('LOGGING MIDDLEWARE')

  const startTime = performance.now()

  const result = await next()

  const endTime = performance.now()

  console.log('Result ->', result)
  console.log('Client input ->', clientInput)
  console.log('Metadata ->', metadata)
  console.log('Action execution took', endTime - startTime, 'ms')

  // And then return the result of the awaited action.
  return result
})

export { unauthenticatedAction }
