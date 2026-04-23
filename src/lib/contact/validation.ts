import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name is required' })
    .max(100, { message: 'Name must be at most 100 characters' }),
  email: z
    .string()
    .email({ message: 'Email is required' })
    .max(254, { message: 'Email must be at most 254 characters' }),
  message: z
    .string()
    .min(1, { message: 'Message is required' })
    .max(5000, { message: 'Message must be at most 5000 characters' }),
  turnstileToken: z.string().min(1, 'field-turnstileToken-required'),
  verify: z.string().optional(),
})

export type ContactFormSchema = z.infer<typeof contactFormSchema>
