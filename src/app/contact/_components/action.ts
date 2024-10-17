'use server'

import { createServerAction } from 'zsa'

import { sendMail } from '@/lib/mail'
import ContactFormEmail from '@/lib/mail/templates/contact-form'

import { env } from '@/env/server'

import { contactFormSchema } from './validation'

export const sendEmailAction = createServerAction()
  .input(contactFormSchema)
  .handler(async ({ input }) => {
    //TODO: Rate limiting and Turnstile verification

    const body = ContactFormEmail({ data: input })

    try {
      await sendMail({
        subject: 'New contact form submission',
        to: env.RESEND_MAIL_TO,
        body,
      })
    } catch (error) {
      console.error(error)
      throw error
    }

    return { data: 'Email sent' }
  })
