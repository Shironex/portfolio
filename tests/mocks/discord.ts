import { vi } from 'vitest'

/**
 * Mock Discord webhook response
 */
export const mockDiscordWebhookSuccess = () => {
  return {
    status: 204,
    statusText: 'No Content',
    data: '',
  }
}

export const mockDiscordWebhookError = (
  message = 'Failed to send Discord webhook'
) => {
  return {
    response: {
      status: 500,
      statusText: 'Internal Server Error',
      data: { message },
    },
  }
}

/**
 * Mock axios for Discord webhook calls
 */
export const mockAxios = () => {
  const mockAxiosInstance = {
    post: vi.fn().mockResolvedValue(mockDiscordWebhookSuccess()),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  }

  vi.mock('axios', () => ({
    default: mockAxiosInstance,
  }))

  return mockAxiosInstance
}
