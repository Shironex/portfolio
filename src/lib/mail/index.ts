'use server'

import { JSX } from 'react'

import { Resend } from 'resend'

import { env } from '@/env/server'

const resend = new Resend(env.RESEND_API_KEY)

export type MessageInfo = {
  to: string
  subject: string
  body: JSX.Element
}

const EMAIL_SENDER = '"shirone" <noreply@shirone.xyz>'

export const sendMail = async (message: MessageInfo) => {
  const { to, subject, body } = message

  const mailOptions = {
    from: EMAIL_SENDER,
    to,
    subject,
    react: body,
  }

  return resend.emails.send(mailOptions)
}
