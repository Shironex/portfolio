'use server'

import { PublicError } from '@/lib/errors'
import { sendMail } from '@/lib/mail'
import ContactFormEmail from '@/lib/mail/templates/contact-form'
import { rateLimitBot, rateLimitByKey } from '@/lib/ratelimit'
import { unauthenticatedAction } from '@/lib/safe-action'
import { verifyTurnstile } from '@/lib/utils'

import { env } from '@/env/server'

import { contactFormSchema } from './validation'

export const sendEmailAction = unauthenticatedAction
  .metadata({
    actionName: 'send Email Action',
  })
  .schema(contactFormSchema)
  .action(async ({ parsedInput }) => {
    //? 5 requests per 2 minutes
    const result = await rateLimitByKey(
      `${parsedInput.name}-${parsedInput.email}-contact`,
      5,
      120
    )

    if (!result.success) {
      throw new PublicError('Rate limit exceeded. Try again in 2 minutes')
    }

    await verifyTurnstile(parsedInput.turnstileToken)

    if (parsedInput.verify) {
      console.log('Wykryto robota', parsedInput)
      await rateLimitBot(
        `${parsedInput.name}-${parsedInput.email}-contact`,
        1,
        9999
      )
      throw new PublicError('Robot detected')
    }

    const body = ContactFormEmail({ data: parsedInput })

    try {
      await sendMail({
        subject: 'New contact form submission',
        to: env.RESEND_MAIL_TO,
        body,
      })
    } catch (error) {
      console.error(error)
      throw new PublicError(
        'There was an error when sending email. Plase try again later.'
      )
    }
  })
