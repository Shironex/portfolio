import Heading from '@/components/heading'
import Container from '@/components/layout/container'
import Paragraph from '@/components/paragraph'

import ContactForm from '@/app/contact/_components/contact-form'

const ContactPage = () => {
  return (
    <Container>
      <span className="text-4xl">✉️</span>
      <Heading className="mb-2 font-black">Contact Me</Heading>
      <Paragraph
        className="mb-10 max-w-xl"
        words="Reach out to me over email or fill up this contact form. I will get back
        to you ASAP - I promise."
      />
      <ContactForm />
    </Container>
  )
}

export default ContactPage
