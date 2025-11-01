import { vi } from 'vitest'

/**
 * Mock Resend email service
 */
export const mockResendSuccess = () => {
  return {
    data: {
      id: 'test-email-id',
    },
    error: null,
  }
}

export const mockResendError = (message = 'Failed to send email') => {
  return {
    data: null,
    error: {
      message,
      name: 'ResendError',
    },
  }
}

/**
 * Mock the Resend client
 */
export const createMockResendClient = () => {
  return {
    emails: {
      send: vi.fn().mockResolvedValue(mockResendSuccess()),
    },
  }
}

/**
 * Mock the Resend module
 */
export const mockResend = () => {
  const mockClient = createMockResendClient()

  vi.mock('@/lib/resend', () => ({
    resend: mockClient,
  }))

  return mockClient
}
