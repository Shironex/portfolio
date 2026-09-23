import { env } from '@/env/server'
import { FullDiscordEmbed } from '@/types'

const DISCORD_WEBHOOK_TIMEOUT_MS = 10_000

export const sendDiscordWebhook = async (embed: FullDiscordEmbed) => {
  // eslint-disable-next-line noctcore-security/no-user-controlled-fetch-url -- operator-set webhook URL from validated server env, not request input
  const response = await fetch(env.DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [embed],
      // Prevent `@everyone`, `@here`, role, and user mentions from
      // being triggered by attacker-controlled embed text.
      allowed_mentions: { parse: [] },
    }),
    signal: AbortSignal.timeout(DISCORD_WEBHOOK_TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new Error(
      `Discord webhook failed: ${response.status} ${response.statusText}`
    )
  }

  return response
}
