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
  async handleServerError(err) {
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
})

export { unauthenticatedAction }
