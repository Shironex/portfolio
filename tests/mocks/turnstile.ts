import { vi } from 'vitest'

/**
 * Mock Cloudflare Turnstile verification responses
 */
export const mockTurnstileSuccess = () => {
  return {
    success: true,
    challenge_ts: new Date().toISOString(),
    hostname: 'localhost',
  }
}

export const mockTurnstileFailure = () => {
  return {
    success: false,
    'error-codes': ['invalid-input-response'],
  }
}

/**
 * Mock fetch for Turnstile verification
 */
export const mockTurnstileFetch = (shouldSucceed = true) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: shouldSucceed,
    json: async () =>
      shouldSucceed ? mockTurnstileSuccess() : mockTurnstileFailure(),
  } as Response)
}

/**
 * Reset Turnstile fetch mock
 */
export const resetTurnstileMock = () => {
  if (global.fetch && vi.isMockFunction(global.fetch)) {
    vi.mocked(global.fetch).mockReset()
  }
}
