'use server'

import { createServerAction } from 'zsa'

import { sendMail } from '@/lib/mail'
import ContactFormEmail from '@/lib/mail/templates/contact-form'
import { rateLimitByKey } from '@/lib/ratelimit'
import { verifyTurnstile } from '@/lib/utils'

import { env } from '@/env/server'

import { contactFormSchema } from './validation'

export const sendEmailAction = createServerAction()
  .input(contactFormSchema)
  .handler(async ({ input }) => {
    //? 5 requests per 2 minutes
    const result = await rateLimitByKey(
      `${input.name}-${input.email}-contact`,
      5,
      120
    )

    if (!result.success) {
      throw new Error('Rate limit exceeded. Try again in 2 minutes')
    }

    await verifyTurnstile(input.turnstileToken)

    if (input.verify) {
      console.log('Wykryto robota', input)
      throw new Error('Robot detected')
    }

    const body = ContactFormEmail({ data: input })

    try {
      await sendMail({
        subject: 'New contact form submission',
        to: env.RESEND_MAIL_TO,
        body,
      })
    } catch (error) {
      console.error(error)
      throw new Error(
        'There was an error when sending email. Plase try again later.'
      )
    }

    return { data: 'Email sent' }
  })
