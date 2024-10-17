import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(3, { message: 'Name is required' }),
  email: z.string().email({ message: 'Email is required' }),
  message: z.string().min(1, { message: 'Message is required' }),
  turnstileToken: z.string().min(1, 'field-turnstileToken-required'),
  verify: z.string().optional(),
})

export type ContactFormSchema = z.infer<typeof contactFormSchema>
