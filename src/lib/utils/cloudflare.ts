import 'server-only'
import { z } from 'zod'

import { env } from '@/env/server'

import { PublicError } from '../errors'

const TURNSTILE_TIMEOUT_MS = 10_000

const TurnstileResponseSchema = z.object({
  success: z.boolean(),
  'error-codes': z.array(z.string()).optional(),
  hostname: z.string().optional(),
  action: z.string().optional(),
  cdata: z.string().optional(),
})

const CAPTCHA_ERROR_MESSAGE =
  'There was an error when veryfing captcha. Please try again.'

export async function verifyTurnstile(token: string): Promise<void> {
  const turnstileResponse = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
      signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
    }
  )

  if (!turnstileResponse.ok) {
    throw new PublicError(CAPTCHA_ERROR_MESSAGE)
  }

  const turnstileData = TurnstileResponseSchema.safeParse(
    await turnstileResponse.json()
  )

  if (!turnstileData.success || !turnstileData.data.success) {
    throw new PublicError(CAPTCHA_ERROR_MESSAGE)
  }
}
