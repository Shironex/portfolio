import { render } from '@react-email/render'

import { ContactFormSchema } from '@/app/contact/_components/validation'

import ContactFormEmail from '../templates/contact-form'

export async function renderContactFormEmail(
  data: Omit<ContactFormSchema, 'turnstileToken' | 'verify'>
) {
  return await render(<ContactFormEmail data={data} />)
}
