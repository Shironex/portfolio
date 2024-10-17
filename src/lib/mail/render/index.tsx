import { render } from '@react-email/render'

import { ContactFormSchema } from '@/app/contact/_components/validation'

import ContactFormEmail from '../templates/contact-form'

export function renderContactFormEmail(data: ContactFormSchema) {
  return render(<ContactFormEmail data={data} />)
}
