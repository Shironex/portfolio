import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { env } from '@/env/server'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  return new Date(`${dateString}T00:00:00Z`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

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
    throw new Error('There was an error when veryfing captcha')
  }
}
