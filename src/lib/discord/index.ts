import axios from 'axios'
import FormData from 'form-data'

import { env } from '@/env/server'
import { FullDiscordEmbed } from '@/types'

export const sendDiscordWebhook = async (
  embed: FullDiscordEmbed,
  formData?: FormData
) => {
  if (formData) {
    formData.append(
      'payload_json',
      JSON.stringify({
        embeds: [embed],
      })
    )
    const response = await axios.post(env.DISCORD_WEBHOOK_URL, formData, {
      headers: formData.getHeaders(),
    })

    return response
  } else {
    const response = await axios.post(env.DISCORD_WEBHOOK_URL, {
      embeds: [embed],
    })

    return response
  }
}
