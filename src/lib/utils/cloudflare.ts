import 'server-only'

import { env } from '@/env/server'

import { PublicError } from '../errors'

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
    }
  )

  const turnstileData = await turnstileResponse.json()

  if (!turnstileData.success) {
    throw new PublicError(
      'There was an error when veryfing captcha. Please try again.'
    )
  }
}
