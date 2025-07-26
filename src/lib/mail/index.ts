import * as Sentry from '@sentry/nextjs'
import 'server-only'

import { MessageInfo } from '@/types'

import { EMAIL_SENDER } from '../constants'
import { resend } from '../resend'

interface MailOptions {
  from: string
  to: string
  subject: string
}

export const sendMail = async (message: MessageInfo) => {
  const { to, subject, body } = message

  const mailOptions: MailOptions = {
    from: EMAIL_SENDER,
    to,
    subject,
  }

  return await Sentry.startSpan(
    {
      name: `Send Email: ${subject}`,
      op: 'email.send',
      attributes: {
        'email.to': to,
        'email.subject': subject,
        'email.from': EMAIL_SENDER,
      },
    },
    async (span) => {
      try {
        const result = await resend.emails.send({
          ...mailOptions,
          react: body,
        })

        span.setAttributes({
          'email.sent': !result.error,
          'email.id': result.data?.id || '',
        })

        if (result.error) {
          throw new Error(result.error.message)
        }

        return result
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            source: 'email_service',
            service: 'resend',
          },
          extra: {
            to,
            subject,
            errorMessage:
              error instanceof Error ? error.message : 'Unknown error',
          },
        })

        throw error
      }
    }
  )
}
