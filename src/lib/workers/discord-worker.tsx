import * as Sentry from '@sentry/nextjs'
import { Worker } from 'bullmq'
import FormData from 'form-data'

import { ContactFormSchema } from '@/app/contact/_components/validation'

import { sendDiscordWebhook } from '../discord'
import { generateDefaultEmbed } from '../discord/embeds'
import { renderContactFormEmail } from '../mail/render'
import { emailHtmlToImage } from '../mail/snapshot'
import redisClient from '../redis'

type DiscordJobData = {
  data: ContactFormSchema
}

const discordWorker = new Worker(
  'discord-webhook',
  async (job) => {
    return await Sentry.startSpan(
      {
        name: `Discord Webhook Worker: ${job.name}`,
        op: 'queue.process',
        attributes: {
          'job.id': job.id,
          'job.name': job.name,
          'job.attemptsMade': job.attemptsMade,
        },
      },
      async () => {
        try {
          const { data } = job.data as DiscordJobData
          console.log('Discord worker started for contact form')

          // Render the email HTML
          const emailHtml = await renderContactFormEmail({
            name: data.name,
            email: data.email,
            message: data.message,
          })

          // Convert HTML to PNG
          const pngBuffer = await emailHtmlToImage(emailHtml)

          // Create form data with the image
          const form = new FormData()
          form.append('file', pngBuffer, { filename: 'contact-email.png' })

          const embed = generateDefaultEmbed({
            title: 'New contact form submission',
            message: `New message from ${data.name}`,
            image: `attachment://contact-email.png`,
            fields: [
              {
                name: 'From',
                value: data.name,
                inline: true,
              },
              {
                name: 'Email',
                value: data.email,
                inline: true,
              },
              {
                name: 'Quick Preview',
                value: data.message.substring(0, 200) + (data.message.length > 200 ? '...' : ''),
                inline: false,
              },
            ],
          })

          const response = await sendDiscordWebhook(embed, form)

          if (response.status !== 200 && response.status !== 204) {
            throw new Error(
              `Request failed with status: ${response.status} - ${response.statusText}`
            )
          }
        } catch (error) {
          Sentry.captureException(error, {
            tags: {
              source: 'discord_worker',
              jobName: job.name,
            },
            extra: {
              jobId: job.id,
              jobData: job.data,
              attemptsMade: job.attemptsMade,
            },
          })
          console.error(error)
          throw error // Re-throw to let BullMQ handle retries
        }
      }
    )
  },
  {
    connection: redisClient,
  }
)

discordWorker.on('completed', (job) => {
  console.log(
    `discord-webhook Job ${job?.id} completed with result: ${job?.returnvalue}`
  )
})

discordWorker.on('failed', (job, err) => {
  console.error(`discord-webhook Job ${job?.id} failed with error: ${err}`)
  Sentry.captureException(err, {
    tags: {
      source: 'discord_worker',
      event: 'job_failed',
    },
    extra: {
      jobId: job?.id,
      jobName: job?.name,
      failedReason: job?.failedReason,
      attemptsMade: job?.attemptsMade,
    },
  })
})

export default discordWorker
