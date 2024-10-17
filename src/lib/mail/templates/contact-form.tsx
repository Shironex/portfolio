import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import { ContactFormSchema } from '@/app/contact/_components/validation'

export interface ContactFormEmailProps {
  data: ContactFormSchema
}

export const ContactFormEmail = ({ data }: ContactFormEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Formularz Kontaktowy</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Text
              style={{ ...h1Style, textAlign: 'center', marginBottom: '20px' }}
            >
              Shirone Portfolio Formularz Kontaktowy
            </Text>
            <Hr style={hr} />
            <Text style={paragraph}>
              <span>Imię i Nazwisko:</span>
              <span style={anchor}>{data.name}</span>
            </Text>
            <Text style={paragraph}>
              <span>Email:</span>
              <span style={anchor}>{data.email}</span>
            </Text>
            <Text style={paragraph}>
              <span>Wiadomość:</span>
              <span style={anchor}>{data.message}</span>
            </Text>
            <Hr style={hr} />
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

ContactFormEmail.PreviewProps = {
  data: {
    name: 'test',
    email: 'test@example.com',
    message: 'Hey i need new Landing Page for my business',
  },
} as unknown as ContactFormEmailProps

export default ContactFormEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const box = {
  padding: '0 48px',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  fontWeight: 'bold',
  textAlign: 'left' as const,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}

const anchor = {
  color: '#556cd6',
  fontWeight: 'normal',
}

const h1Style = {
  color: '#333333',
  fontSize: '32px',
  fontWeight: 'bold',
  lineHeight: '1.3',
  margin: '0',
}
