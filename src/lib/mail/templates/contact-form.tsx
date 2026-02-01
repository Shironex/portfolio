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
            <div style={headerOverlay} />
            <Row>
              <Column>
                <Heading style={logo}>Shirone</Heading>
                <Text style={headerSubtext}>Portfolio</Text>
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
              <div style={detailsHeader}>
                <Text style={detailsTitle}>Contact Information</Text>
              </div>
              <div style={detailsContent}>
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
              </div>
            </Section>

            {/* Message content */}
            <Section style={messageContainer}>
              <div style={detailsHeader}>
                <Text style={messageHeading}>Message</Text>
              </div>
              <div style={detailsContent}>
                <Text style={messageText}>{data.message}</Text>
              </div>
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

// Styles - Matching portfolio design system
const main = {
  backgroundColor: 'hsl(240, 10%, 3.9%)', // Exact portfolio background
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '40px 20px',
  minHeight: '100vh',
}

const container = {
  backgroundColor: 'hsl(240, 10%, 3.9%)', // Same as main background
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '8px', // Portfolio border radius
  overflow: 'hidden',
  border: '1px solid hsl(240, 3.7%, 15.9%)', // Portfolio border color
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)', // Deeper shadow for impact
}

const headerSection = {
  background:
    'linear-gradient(135deg, hsl(240, 3.7%, 15.9%) 0%, hsl(240, 10%, 8%) 100%)',
  padding: '40px 40px 30px',
  textAlign: 'center' as const,
  borderBottom: '1px solid hsl(240, 3.7%, 15.9%)',
  position: 'relative' as const,
}

const headerOverlay = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background:
    'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(184, 148, 255, 0.15), rgba(255,255,255,0))',
  pointerEvents: 'none' as const,
}

const logo = {
  fontSize: '36px',
  fontWeight: '700' as const,
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
  background:
    'linear-gradient(to right, hsl(252, 87%, 67%), hsl(277, 100%, 75%))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  color: 'transparent',
  letterSpacing: '-0.025em',
}

const headerSubtext = {
  fontSize: '14px',
  fontWeight: '500' as const,
  margin: '0',
  color: 'hsl(240, 5%, 64.9%)', // Muted foreground
  textAlign: 'center' as const,
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
}

const contentSection = {
  padding: '40px',
}

const heading = {
  color: 'hsl(0, 0%, 98%)', // Portfolio foreground
  fontSize: '28px',
  fontWeight: '700' as const,
  margin: '0 0 12px 0',
  letterSpacing: '-0.025em',
  background:
    'linear-gradient(to right, hsl(0, 0%, 98%), hsl(252, 87%, 67%), hsl(277, 100%, 75%))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

const subheading = {
  color: 'hsl(240, 5%, 64.9%)', // Portfolio muted foreground
  fontSize: '16px',
  margin: '0 0 32px 0',
  lineHeight: '1.6',
}

const divider = {
  borderColor: 'hsl(240, 3.7%, 15.9%)', // Portfolio border
  margin: '24px 0 32px',
  borderWidth: '1px',
}

const detailsContainer = {
  backgroundColor: 'hsl(240, 3.7%, 15.9%)', // Portfolio secondary background
  borderRadius: '8px',
  padding: '0',
  marginBottom: '32px',
  border: '1px solid hsl(240, 3.7%, 15.9%)',
}

const detailsHeader = {
  padding: '16px 24px',
  borderBottom: '1px solid hsl(240, 3.7%, 25%)',
  background:
    'linear-gradient(135deg, hsl(240, 3.7%, 18%) 0%, hsl(240, 3.7%, 15.9%) 100%)',
}

const detailsTitle = {
  fontSize: '14px',
  fontWeight: '600' as const,
  margin: '0',
  color: 'hsl(252, 87%, 67%)', // Primary color
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
}

const detailsContent = {
  padding: '24px',
}

const detailRow = {
  marginBottom: '16px',
}

const detailLabel = {
  color: 'hsl(240, 5%, 64.9%)', // Muted foreground
  fontSize: '14px',
  fontWeight: '500' as const,
  width: '80px',
  minWidth: '80px',
}

const detailValue = {
  color: 'hsl(0, 0%, 98%)', // Foreground
  fontSize: '14px',
  fontWeight: '500' as const,
}

const emailLink = {
  color: 'hsl(252, 87%, 67%)', // Primary color
  textDecoration: 'none',
  fontWeight: '500' as const,
}

const messageContainer = {
  backgroundColor: 'hsl(240, 3.7%, 15.9%)', // Portfolio secondary background
  borderRadius: '8px',
  padding: '0',
  marginBottom: '32px',
  border: '1px solid hsl(240, 3.7%, 15.9%)',
}

const messageHeading = {
  color: 'hsl(252, 87%, 67%)', // Primary color
  fontSize: '14px',
  fontWeight: '600' as const,
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
}

const messageText = {
  color: 'hsl(0, 0%, 98%)', // Foreground
  fontSize: '15px',
  lineHeight: '1.7',
  whiteSpace: 'pre-wrap' as const,
  margin: '0',
  fontWeight: '400' as const,
}

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '40px',
  paddingBottom: '8px',
}

const button = {
  background:
    'linear-gradient(135deg, hsl(252, 87%, 67%) 0%, hsl(277, 100%, 75%) 100%)',
  borderRadius: '8px',
  color: 'hsl(0, 0%, 98%)',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: '600' as const,
  padding: '14px 32px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  border: 'none',
  boxShadow: '0 4px 12px rgba(184, 148, 255, 0.3)',
  letterSpacing: '0.025em',
}

const footer = {
  backgroundColor: 'hsl(240, 10%, 8%)', // Slightly darker than main
  borderTop: '1px solid hsl(240, 3.7%, 15.9%)',
  padding: '32px 40px',
  textAlign: 'center' as const,
}

const footerText = {
  color: 'hsl(240, 5%, 64.9%)', // Muted foreground
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '6px 0',
  fontWeight: '400' as const,
}
