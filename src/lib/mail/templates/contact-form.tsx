import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'

import { ContactFormSchema } from '@/app/contact/_components/validation'

export interface ContactFormEmailProps {
  data: Omit<ContactFormSchema, 'turnstileToken' | 'verify'>
}

export const ContactFormEmail = ({ data }: ContactFormEmailProps) => {
  const currentYear = new Date().getFullYear()

  return (
    <Html>
      <Head>
        <title>New Contact Form Submission</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Preview>New message from {data.name} via your portfolio website</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with logo and gradient */}
          <Section style={headerSection}>
            <Row>
              <Column>
                <Heading style={logo}>Shirone</Heading>
              </Column>
            </Row>
          </Section>

          {/* Main content */}
          <Section style={contentSection}>
            <Heading style={heading}>New Contact Form Submission</Heading>
            <Text style={subheading}>
              You've received a new message from your portfolio website.
            </Text>

            <Hr style={divider} />

            {/* Contact details */}
            <Section style={detailsContainer}>
              <Row style={detailRow}>
                <Column style={detailLabel}>From:</Column>
                <Column style={detailValue}>{data.name}</Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailLabel}>Email:</Column>
                <Column style={detailValue}>
                  <Link href={`mailto:${data.email}`} style={emailLink}>
                    {data.email}
                  </Link>
                </Column>
              </Row>
            </Section>

            {/* Message content */}
            <Section style={messageContainer}>
              <Heading as="h3" style={messageHeading}>
                Message:
              </Heading>
              <Text style={messageText}>{data.message}</Text>
            </Section>

            {/* Reply button */}
            <Section style={buttonContainer}>
              <Link href={`mailto:${data.email}`} style={button}>
                Reply to {data.name}
              </Link>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {currentYear} Shirone Portfolio. All rights reserved.
            </Text>
            <Text style={footerText}>
              This email was sent to you because someone submitted the contact
              form on your portfolio website.
            </Text>
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
    message:
      "Hello, I'm interested in discussing a potential project for my company. I need a new web application with modern design and functionality. Looking forward to hearing from you!",
  },
} as unknown as ContactFormEmailProps

export default ContactFormEmail

// Styles
const main = {
  backgroundColor: '#1e1e2f', // Dark background matching the site theme
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '40px 0',
}

const container = {
  backgroundColor: '#252538', // Slightly lighter than the background
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
}

const headerSection = {
  backgroundColor: '#1e1e2f',
  padding: '30px 40px',
  textAlign: 'center' as const,
  borderBottom: '1px solid rgba(120, 119, 198, 0.2)',
  backgroundImage:
    'linear-gradient(to right, rgba(120, 119, 198, 0.1), rgba(120, 119, 198, 0.3), rgba(120, 119, 198, 0.1))',
}

const logo = {
  color: '#c084fc', // Purple color matching the primary theme
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
  backgroundImage: 'linear-gradient(to right, #c084fc, #8b5cf6)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  MozBackgroundClip: 'text',
  MozTextFillColor: 'transparent',
}

const contentSection = {
  padding: '40px',
}

const heading = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
}

const subheading = {
  color: '#a1a1aa', // Muted text color
  fontSize: '16px',
  margin: '0 0 30px 0',
  lineHeight: '1.5',
}

const divider = {
  borderColor: 'rgba(120, 119, 198, 0.2)',
  margin: '20px 0 30px',
}

const detailsContainer = {
  backgroundColor: 'rgba(120, 119, 198, 0.05)',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '30px',
}

const detailRow = {
  marginBottom: '10px',
}

const detailLabel = {
  color: '#a1a1aa',
  fontSize: '14px',
  fontWeight: 'bold',
  width: '80px',
}

const detailValue = {
  color: '#ffffff',
  fontSize: '14px',
}

const emailLink = {
  color: '#c084fc',
  textDecoration: 'none',
}

const messageContainer = {
  backgroundColor: 'rgba(120, 119, 198, 0.05)',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '30px',
}

const messageHeading = {
  color: '#a1a1aa',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
}

const messageText = {
  color: '#ffffff',
  fontSize: '14px',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap' as const,
}

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '30px',
}

const button = {
  backgroundColor: '#8b5cf6',
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: 'bold',
  padding: '12px 24px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  transition: 'background-color 0.3s',
}

const footer = {
  backgroundColor: '#1e1e2f',
  borderTop: '1px solid rgba(120, 119, 198, 0.2)',
  padding: '30px 40px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#71717a',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '5px 0',
}
