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

  return resend.emails.send({
    ...mailOptions,
    react: body,
  })
}
