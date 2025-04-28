import { Worker } from 'bullmq'

import { ContactFormSchema } from '@/app/contact/_components/validation'

import { sendDiscordWebhook } from '../discord'
import { generateDefaultEmbed } from '../discord/embeds'
import redisClient from '../redis'

type DiscordJobData = {
  data: ContactFormSchema
}

const discordWorker = new Worker(
  'discord-webhook',
  async (job) => {
    try {
      const { data } = job.data as DiscordJobData
      console.log('Discord worker started for contact form')

      // const png = await emailFormToPng(data)

      // const form = new FormData()
      // form.append('file', png, { filename: 'contact.png' })

      const embed = generateDefaultEmbed({
        title: 'New contact form submission',
        message: `new contact form submission`,
        // image: `attachment://contact.png`,
        fields: [
          {
            name: 'Name',
            value: data.name,
            inline: true,
          },
          {
            name: 'Email',
            value: data.email,
            inline: true,
          },
          {
            name: 'Message',
            value: data.message,
            inline: false,
          },
        ],
      })

      // const response = await sendDiscordWebhook(embed, form)
      const response = await sendDiscordWebhook(embed)

      if (response.status !== 200 && response.status !== 204) {
        throw new Error(
          `Request failed with status: ${response.status} - ${response.statusText}`
        )
      }
    } catch (error) {
      console.error(error)
    }
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
})

export default discordWorker
