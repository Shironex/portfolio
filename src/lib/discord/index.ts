import { env } from '@/env/server'
import { FullDiscordEmbed } from '@/types'

export const sendDiscordWebhook = async (embed: FullDiscordEmbed) => {
  const response = await fetch(env.DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [embed],
      // Prevent `@everyone`, `@here`, role, and user mentions from
      // being triggered by attacker-controlled embed text.
      allowed_mentions: { parse: [] },
    }),
  })

  if (!response.ok) {
    throw new Error(
      `Discord webhook failed: ${response.status} ${response.statusText}`
    )
  }

  return response
}
