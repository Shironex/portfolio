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

import { ContactFormSchema } from '@/lib/contact/validation'

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
          {/* Header */}
          <Section style={headerSection}>
            <Row>
              <Column>
                <Heading style={logo}>ShiroOS</Heading>
                <Text style={headerSubtext}>Portfolio inbox</Text>
              </Column>
            </Row>
          </Section>

          {/* Main content */}
          <Section style={contentSection}>
            <Heading style={heading}>New contact form submission</Heading>
            <Text style={subheading}>
              Someone just reached out via the portfolio.
            </Text>

            <Hr style={divider} />

            {/* Contact details */}
            <Section style={detailsContainer}>
              <div style={detailsHeader}>
                <Text style={detailsTitle}>Contact information</Text>
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
              © {currentYear} ShiroOS · Kacper Kozakiewicz
            </Text>
            <Text style={footerText}>
              Sent because someone submitted the contact form on your portfolio.
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

/*
 * Palette — ported from the ShiroOS @theme tokens so email chrome matches
 * the portfolio (warm paper light theme, teal primary).
 *   paper-0  #fbf7ed   surface / body
 *   paper-1  #f5ecd4   elevated surface
 *   paper-2  #eadfc1   outer frame
 *   rule     #e2d6b8   hairline
 *   rule-2   #cfc09b   stronger rule
 *   miku     #0f7c74   teal primary
 *   miku-2   #0a5954   teal pressed
 *   ink      #1b2a1c   near-black text
 *   ink-2    #3d4d40   body copy
 *   ink-4    #5d6e88   muted copy (WCAG AA on paper)
 *   ochre    #b87a1e   warm accent
 */
const main = {
  backgroundColor: '#eadfc1',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  padding: '40px 20px',
  minHeight: '100vh',
}

const container = {
  backgroundColor: '#fbf7ed',
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid #cfc09b',
  boxShadow: '0 8px 28px rgba(23, 40, 28, 0.08)',
}

const headerSection = {
  background: '#f5ecd4',
  padding: '32px 40px 24px',
  borderBottom: '1px solid #e2d6b8',
}

const logo = {
  fontSize: '28px',
  fontWeight: '700' as const,
  margin: '0 0 4px 0',
  color: '#0a5954',
  letterSpacing: '-0.015em',
}

const headerSubtext = {
  fontSize: '12px',
  fontWeight: '600' as const,
  margin: '0',
  color: '#5d6e88',
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
}

const contentSection = {
  padding: '36px 40px 24px',
}

const heading = {
  color: '#1b2a1c',
  fontSize: '22px',
  fontWeight: '700' as const,
  margin: '0 0 8px 0',
  letterSpacing: '-0.015em',
}

const subheading = {
  color: '#3d4d40',
  fontSize: '15px',
  margin: '0 0 24px 0',
  lineHeight: '1.55',
}

const divider = {
  borderColor: '#e2d6b8',
  margin: '0 0 24px 0',
  borderWidth: '1px',
}

const detailsContainer = {
  backgroundColor: '#f5ecd4',
  borderRadius: '10px',
  padding: '0',
  marginBottom: '20px',
  border: '1px solid #e2d6b8',
}

const detailsHeader = {
  padding: '12px 20px',
  borderBottom: '1px solid #e2d6b8',
  backgroundColor: '#eadfc1',
}

const detailsTitle = {
  fontSize: '11px',
  fontWeight: '700' as const,
  margin: '0',
  color: '#0a5954',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
}

const detailsContent = {
  padding: '18px 20px',
}

const detailRow = {
  marginBottom: '10px',
}

const detailLabel = {
  color: '#5d6e88',
  fontSize: '13px',
  fontWeight: '600' as const,
  width: '72px',
  minWidth: '72px',
}

const detailValue = {
  color: '#1b2a1c',
  fontSize: '14px',
  fontWeight: '500' as const,
}

const emailLink = {
  color: '#0f7c74',
  textDecoration: 'underline',
  textDecorationColor: 'rgba(15, 124, 116, 0.35)',
  textUnderlineOffset: '2px',
  fontWeight: '600' as const,
}

const messageContainer = {
  backgroundColor: '#f5ecd4',
  borderRadius: '10px',
  padding: '0',
  marginBottom: '28px',
  border: '1px solid #e2d6b8',
}

const messageHeading = detailsTitle

const messageText = {
  color: '#1b2a1c',
  fontSize: '14.5px',
  lineHeight: '1.65',
  whiteSpace: 'pre-wrap' as const,
  margin: '0',
  fontWeight: '400' as const,
}

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '8px',
  paddingBottom: '4px',
}

const button = {
  backgroundColor: '#0f7c74',
  borderRadius: '10px',
  color: '#fbf7ed',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '600' as const,
  padding: '12px 28px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  border: '1px solid #0a5954',
  letterSpacing: '0.01em',
}

const footer = {
  backgroundColor: '#f5ecd4',
  borderTop: '1px solid #e2d6b8',
  padding: '20px 40px 24px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#5d6e88',
  fontSize: '12px',
  lineHeight: '1.55',
  margin: '4px 0',
  fontWeight: '400' as const,
}
