import { TransportOptions, createTransport } from 'nodemailer'
import 'server-only'

import { env } from '@/env/server'
import { MessageInfo } from '@/types'

import { EMAIL_SENDER } from '../constants'
import { resend } from '../resend'

const smtpConfig = {
  host: env.SMTP_HOST,
  port: parseInt(env.SMTP_PORT),
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
}

interface MailOptions {
  from: string
  to: string
  subject: string
}

const transporter = createTransport(smtpConfig as TransportOptions)

export const sendMail = async (message: MessageInfo) => {
  const { to, subject, body } = message

  const mailOptions: MailOptions = {
    from: EMAIL_SENDER,
    to,
    subject,
  }

  if (env.RESEND_ENABLED) {
    console.log('Sending email with Resend')
    return resend.emails.send({
      ...mailOptions,
      react: body,
    })
  }

  transporter.verify((error) => {
    if (error) {
      console.error('Error connecting to transporter:', error)
      throw new Error('Error connecting to transporter')
    }
  })

  console.log('Sending email with SMTP')

  return transporter.sendMail({
    ...mailOptions,
    html: body as string,
  })
}
