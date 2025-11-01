import type { ContactFormSchema } from '@/app/contact/_components/validation'

/**
 * Test fixtures for contact form data
 */

export const validContactFormData: ContactFormSchema = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  message: 'This is a test message for the contact form.',
  turnstileToken: 'valid-turnstile-token-12345',
  verify: '', // Honeypot field should be empty
}

export const contactFormDataWithHoneypot: ContactFormSchema = {
  name: 'Bot User',
  email: 'bot@example.com',
  message: 'This is a spam message.',
  turnstileToken: 'valid-turnstile-token-12345',
  verify: 'filled-by-bot', // Bot detected
}

export const invalidContactFormData = {
  emptyName: {
    name: '',
    email: 'test@example.com',
    message: 'Test message',
    turnstileToken: 'valid-token',
    verify: '',
  },
  invalidEmail: {
    name: 'John Doe',
    email: 'invalid-email',
    message: 'Test message',
    turnstileToken: 'valid-token',
    verify: '',
  },
  shortName: {
    name: 'Jo',
    email: 'test@example.com',
    message: 'Test message',
    turnstileToken: 'valid-token',
    verify: '',
  },
  emptyMessage: {
    name: 'John Doe',
    email: 'test@example.com',
    message: '',
    turnstileToken: 'valid-token',
    verify: '',
  },
  missingTurnstile: {
    name: 'John Doe',
    email: 'test@example.com',
    message: 'Test message',
    turnstileToken: '',
    verify: '',
  },
}

export const longContactFormData: ContactFormSchema = {
  name: 'A'.repeat(100),
  email: 'verylongemail@example.com',
  message: 'A'.repeat(5000),
  turnstileToken: 'valid-turnstile-token-12345',
  verify: '',
}
