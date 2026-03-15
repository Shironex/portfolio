import * as Sentry from '@sentry/nextjs'

import { env } from '@/env/server'
import { FullDiscordEmbed } from '@/types'

export const sendDiscordWebhook = async (embed: FullDiscordEmbed) => {
  return await Sentry.startSpan(
    {
      name: 'Discord Webhook API Call',
      op: 'http.client',
      attributes: {
        'http.method': 'POST',
        'http.url': 'discord.webhook',
      },
    },
    async (span) => {
      try {
        const response = await fetch(env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ embeds: [embed] }),
        })

        span.setAttributes({
          'http.status_code': response.status,
          'response.ok': response.ok,
        })

        if (!response.ok) {
          throw new Error(
            `Discord webhook failed: ${response.status} ${response.statusText}`
          )
        }

        return response
      } catch (error) {
        span.setAttributes({
          'error.type': 'fetch_error',
          'error.message':
            error instanceof Error ? error.message : 'Unknown error',
        })

        throw error
      }
    }
  )
}
