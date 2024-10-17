'use server'

import { createServerAction } from 'zsa'

import { sendMail } from '@/lib/mail'
import ContactFormEmail from '@/lib/mail/templates/contact-form'
import { verifyTurnstile } from '@/lib/utils'

import { env } from '@/env/server'

import { contactFormSchema } from './validation'

export const sendEmailAction = createServerAction()
  .input(contactFormSchema)
  .handler(async ({ input }) => {
    //TODO: Rate limiting
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
