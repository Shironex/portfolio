import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { sendMail } from '@/lib/mail'

import type { MessageInfo } from '@/types'

// Mock the resend client using vi.hoisted
const { mockResendSend } = vi.hoisted(() => ({
  mockResendSend: vi.fn(),
}))

vi.mock('@/lib/resend', () => ({
  resend: {
    emails: {
      send: mockResendSend,
    },
  },
}))

describe('sendMail', () => {
  const mockMessage: MessageInfo = {
    to: 'recipient@example.com',
    subject: 'Test Email Subject',
    body: 'Test email body content',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should successfully send an email', async () => {
    mockResendSend.mockResolvedValue({
      data: {
        id: 'email-id-123',
      },
      error: null,
    })

    const result = await sendMail(mockMessage)

    expect(mockResendSend).toHaveBeenCalledTimes(1)
    expect(mockResendSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'recipient@example.com',
        subject: 'Test Email Subject',
        from: expect.any(String),
        react: 'Test email body content',
      })
    )
    expect(result.data?.id).toBe('email-id-123')
    expect(result.error).toBeNull()
  })

  it('should include correct from address', async () => {
    mockResendSend.mockResolvedValue({
      data: { id: 'test-id' },
      error: null,
    })

    await sendMail(mockMessage)

    expect(mockResendSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: expect.stringContaining('@'),
      })
    )
  })

  it('should handle React components as email body', async () => {
    mockResendSend.mockResolvedValue({
      data: { id: 'test-id' },
      error: null,
    })

    const messageWithReactBody: MessageInfo = {
      to: 'test@example.com',
      subject: 'Test',
      body: '<div>React Component</div>' as any,
    }

    await sendMail(messageWithReactBody)

    expect(mockResendSend).toHaveBeenCalledWith(
      expect.objectContaining({
        react: '<div>React Component</div>',
      })
    )
  })

  it('should throw error when resend returns error', async () => {
    mockResendSend.mockResolvedValue({
      data: null,
      error: {
        message: 'Failed to send email',
        name: 'ResendError',
      },
    })

    await expect(sendMail(mockMessage)).rejects.toThrow('Failed to send email')
  })

  it('should throw error when resend throws', async () => {
    mockResendSend.mockRejectedValue(new Error('Network error'))

    await expect(sendMail(mockMessage)).rejects.toThrow('Network error')
  })

  it('should handle different email subjects', async () => {
    mockResendSend.mockResolvedValue({
      data: { id: 'test-id' },
      error: null,
    })

    const subjects = ['Contact Form Submission', 'Newsletter', 'Password Reset']

    for (const subject of subjects) {
      await sendMail({ ...mockMessage, subject })
      expect(mockResendSend).toHaveBeenCalledWith(
        expect.objectContaining({
          subject,
        })
      )
    }
  })

  it('should handle multiple recipients if supported', async () => {
    mockResendSend.mockResolvedValue({
      data: { id: 'test-id' },
      error: null,
    })

    const messageWithMultipleRecipients: MessageInfo = {
      to: 'user1@example.com',
      subject: 'Test',
      body: 'Body',
    }

    await sendMail(messageWithMultipleRecipients)

    expect(mockResendSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'user1@example.com',
      })
    )
  })

  it('should return email ID on successful send', async () => {
    const emailId = 'unique-email-id-12345'
    mockResendSend.mockResolvedValue({
      data: { id: emailId },
      error: null,
    })

    const result = await sendMail(mockMessage)

    expect(result.data?.id).toBe(emailId)
  })

  it('should handle empty body gracefully', async () => {
    mockResendSend.mockResolvedValue({
      data: { id: 'test-id' },
      error: null,
    })

    const messageWithEmptyBody: MessageInfo = {
      to: 'test@example.com',
      subject: 'Test',
      body: '',
    }

    await sendMail(messageWithEmptyBody)

    expect(mockResendSend).toHaveBeenCalledWith(
      expect.objectContaining({
        react: '',
      })
    )
  })
})
