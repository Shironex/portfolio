import * as Sentry from '@sentry/nextjs'
import axios from 'axios'
import FormData from 'form-data'

import { env } from '@/env/server'
import { FullDiscordEmbed } from '@/types'

export const sendDiscordWebhook = async (
  embed: FullDiscordEmbed,
  formData?: FormData
) => {
  return await Sentry.startSpan(
    {
      name: 'Discord Webhook API Call',
      op: 'http.client',
      attributes: {
        'http.method': 'POST',
        'http.url': 'discord.webhook',
        'webhook.has_attachment': !!formData,
      },
    },
    async (span) => {
      try {
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

          span.setAttributes({
            'http.status_code': response.status,
            'response.ok': response.status >= 200 && response.status < 300,
          })

          return response
        } else {
          const response = await axios.post(env.DISCORD_WEBHOOK_URL, {
            embeds: [embed],
          })

          span.setAttributes({
            'http.status_code': response.status,
            'response.ok': response.status >= 200 && response.status < 300,
          })

          return response
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          span.setAttributes({
            'http.status_code': error.response?.status || 0,
            'error.type': 'axios_error',
            'error.message': error.message,
          })
        }

        Sentry.captureException(error, {
          tags: {
            source: 'discord_webhook',
            errorType: 'api_call_failed',
          },
          extra: {
            embedTitle: embed.title,
            hasFormData: !!formData,
            statusCode: axios.isAxiosError(error)
              ? error.response?.status
              : undefined,
          },
        })

        throw error
      }
    }
  )
}
