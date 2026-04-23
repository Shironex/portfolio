'use server'

import * as Sentry from '@sentry/nextjs'

import { sendDiscordWebhook } from '@/lib/discord'
import { generateDefaultEmbed } from '@/lib/discord/embeds'
import { PublicError } from '@/lib/errors'
import { sendMail } from '@/lib/mail'
import ContactFormEmail from '@/lib/mail/templates/contact-form'
import { getPostHogClient } from '@/lib/posthog-server'
import { rateLimitBot, rateLimitByKey } from '@/lib/ratelimit'
import { unauthenticatedAction } from '@/lib/safe-action'
import { verifyTurnstile } from '@/lib/utils/cloudflare'

import { env } from '@/env/server'

import { contactFormSchema } from './validation'

export const sendEmailAction = unauthenticatedAction
  .metadata({
    actionName: 'send Email Action',
  })
  .inputSchema(contactFormSchema)
  .action(async ({ parsedInput }) => {
    //? 5 requests per 1 hour
    const result = await rateLimitByKey(
      `${parsedInput.name}-${parsedInput.email}-contact`,
      5,
      3600
    )

    if (!result.success) {
      throw new PublicError('Rate limit exceeded. Try again in 1 hour')
    }

    await verifyTurnstile(parsedInput.turnstileToken)

    if (parsedInput.verify) {
      Sentry.captureMessage('Bot detection - honeypot field filled', {
        level: 'warning',
        tags: {
          type: 'security_alert',
          feature: 'contact_form',
          action: 'bot_detected',
        },
        extra: {
          name: parsedInput.name,
          email: parsedInput.email,
          messageLength: parsedInput.message?.length || 0,
        },
      })

      await rateLimitBot(`${parsedInput.name}-${parsedInput.email}-contact`, 1)

      throw new PublicError('Robot detected')
    }

    const body = ContactFormEmail({ data: parsedInput })

    try {
      await sendMail({
        subject: 'New contact form submission',
        to: env.RESEND_MAIL_TO,
        body,
      })

      // Send Discord notification (fire-and-forget, don't block the response)
      const embed = generateDefaultEmbed({
        title: 'New contact form submission',
        message: `New message from ${parsedInput.name}`,
        fields: [
          {
            name: 'From',
            value: parsedInput.name,
            inline: true,
          },
          {
            name: 'Email',
            value: parsedInput.email,
            inline: true,
          },
          {
            name: 'Quick Preview',
            value:
              parsedInput.message.substring(0, 200) +
              (parsedInput.message.length > 200 ? '...' : ''),
            inline: false,
          },
        ],
      })

      const posthog = getPostHogClient()
      posthog.capture({
        distinctId: parsedInput.email,
        event: 'contact_form_sent',
        properties: {
          name: parsedInput.name,
          message_length: parsedInput.message.length,
        },
      })
      await posthog.flush()

      sendDiscordWebhook(embed).catch((error) => {
        Sentry.captureException(error, {
          tags: {
            source: 'discord_webhook',
            feature: 'contact_form',
          },
        })
      })
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          feature: 'contact_form',
          action: 'send_mail',
          errorType: 'mail_service_error',
        },
        extra: {
          hasName: !!parsedInput.name,
          hasEmail: !!parsedInput.email,
          hasMessage: !!parsedInput.message,
          hasCaptcha: !!parsedInput.turnstileToken,
          hasVerify: !!parsedInput.verify,
        },
      })

      console.error(error)

      throw new PublicError(
        'There was an error when sending email. Please try again later.'
      )
    }
  })
