import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PublicError } from '@/lib/errors'
import { verifyTurnstile } from '@/lib/utils/cloudflare'

describe('verifyTurnstile', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should successfully verify a valid turnstile token', async () => {
    // Mock successful turnstile response
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        challenge_ts: '2024-01-15T10:30:00Z',
        hostname: 'localhost',
      }),
    } as Response)

    await expect(verifyTurnstile('valid-token')).resolves.not.toThrow()

    expect(global.fetch).toHaveBeenCalledWith(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('valid-token'),
      })
    )
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('should throw PublicError when turnstile verification fails', async () => {
    // Mock failed turnstile response
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: false,
        'error-codes': ['invalid-input-response'],
      }),
    } as Response)

    await expect(verifyTurnstile('invalid-token')).rejects.toThrow(PublicError)
    await expect(verifyTurnstile('invalid-token')).rejects.toThrow(
      'There was an error when veryfing captcha. Please try again.'
    )
  })

  it('should throw PublicError when turnstile API returns unsuccessful response', async () => {
    // Mock unsuccessful API response
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: false,
        'error-codes': ['timeout-or-duplicate'],
      }),
    } as Response)

    await expect(verifyTurnstile('timeout-token')).rejects.toThrow(PublicError)
  })

  it('should handle network errors gracefully', async () => {
    // Mock network error
    vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'))

    await expect(verifyTurnstile('token-with-network-error')).rejects.toThrow(
      'Network error'
    )
  })

  it('should handle malformed JSON response', async () => {
    // Mock malformed JSON response
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON')
      },
    } as Response)

    await expect(verifyTurnstile('token-with-invalid-json')).rejects.toThrow(
      'Invalid JSON'
    )
  })

  it('should send correct request body with secret and response token', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
      }),
    } as Response)

    await verifyTurnstile('test-token-123')

    const fetchCall = vi.mocked(global.fetch).mock.calls[0]
    const requestBody = JSON.parse(fetchCall[1]?.body as string)

    expect(requestBody).toHaveProperty('secret')
    expect(requestBody).toHaveProperty('response', 'test-token-123')
  })
})
