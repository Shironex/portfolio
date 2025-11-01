import FormData from 'form-data'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { sendDiscordWebhook } from '@/lib/discord'

import type { FullDiscordEmbed } from '@/types'

// Mock axios using vi.hoisted
const { mockAxiosPost } = vi.hoisted(() => ({
  mockAxiosPost: vi.fn(),
}))

vi.mock('axios', () => ({
  default: {
    post: mockAxiosPost,
    isAxiosError: (error: any) => error?.isAxiosError === true,
  },
}))

describe('sendDiscordWebhook', () => {
  const mockEmbed: FullDiscordEmbed = {
    author: {
      name: 'Test Author',
      icon_url: 'https://example.com/icon.png',
    },
    title: 'Test Embed Title',
    description: 'Test embed description',
    fields: [
      { name: 'Field 1', value: 'Value 1', inline: true },
      { name: 'Field 2', value: 'Value 2', inline: false },
    ],
    color: 0x00ff00,
    timestamp: new Date().toISOString(),
    footer: {
      text: 'Footer text',
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('without attachments', () => {
    it('should successfully send Discord webhook without formData', async () => {
      mockAxiosPost.mockResolvedValue({
        status: 204,
        statusText: 'No Content',
      })

      const result = await sendDiscordWebhook(mockEmbed)

      expect(mockAxiosPost).toHaveBeenCalledTimes(1)
      expect(mockAxiosPost).toHaveBeenCalledWith(
        expect.any(String), // webhook URL
        {
          embeds: [mockEmbed],
        }
      )
      expect(result.status).toBe(204)
    })

    it('should send embed with all fields', async () => {
      mockAxiosPost.mockResolvedValue({
        status: 204,
        statusText: 'No Content',
      })

      await sendDiscordWebhook(mockEmbed)

      const callArgs = mockAxiosPost.mock.calls[0]
      const embedData = callArgs[1]

      expect(embedData.embeds).toHaveLength(1)
      expect(embedData.embeds[0]).toEqual(mockEmbed)
      expect(embedData.embeds[0].author.name).toBe('Test Author')
      expect(embedData.embeds[0].fields).toHaveLength(2)
    })
  })

  describe('with attachments', () => {
    it('should successfully send Discord webhook with formData', async () => {
      mockAxiosPost.mockResolvedValue({
        status: 204,
        statusText: 'No Content',
      })

      const formData = new FormData()
      formData.append('file', Buffer.from('test file content'), 'test.png')

      const result = await sendDiscordWebhook(mockEmbed, formData)

      expect(mockAxiosPost).toHaveBeenCalledTimes(1)
      expect(mockAxiosPost).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.any(Object),
        })
      )
      expect(result.status).toBe(204)
    })

    it('should append payload_json to formData', async () => {
      mockAxiosPost.mockResolvedValue({
        status: 204,
      })

      const formData = new FormData()
      const appendSpy = vi.spyOn(formData, 'append')

      await sendDiscordWebhook(mockEmbed, formData)

      expect(appendSpy).toHaveBeenCalledWith(
        'payload_json',
        expect.stringContaining('"embeds"')
      )
      expect(appendSpy).toHaveBeenCalledWith(
        'payload_json',
        expect.stringContaining('Test Embed Title')
      )
    })

    it('should include formData headers in request', async () => {
      mockAxiosPost.mockResolvedValue({
        status: 204,
      })

      const formData = new FormData()
      await sendDiscordWebhook(mockEmbed, formData)

      expect(mockAxiosPost).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.any(Object),
        })
      )
    })
  })

  describe('error handling', () => {
    it('should throw error when webhook fails', async () => {
      const axiosError = {
        isAxiosError: true,
        message: 'Request failed',
        response: {
          status: 500,
          statusText: 'Internal Server Error',
        },
      }

      mockAxiosPost.mockRejectedValue(axiosError)

      await expect(sendDiscordWebhook(mockEmbed)).rejects.toThrow()
    })

    it('should throw error on network failure', async () => {
      mockAxiosPost.mockRejectedValue(new Error('Network error'))

      await expect(sendDiscordWebhook(mockEmbed)).rejects.toThrow(
        'Network error'
      )
    })

    it('should throw error on 400 status code', async () => {
      const axiosError = {
        isAxiosError: true,
        message: 'Bad request',
        response: {
          status: 400,
          statusText: 'Bad Request',
        },
      }

      mockAxiosPost.mockRejectedValue(axiosError)

      await expect(sendDiscordWebhook(mockEmbed)).rejects.toThrow()
    })

    it('should throw error on timeout', async () => {
      const axiosError = {
        isAxiosError: true,
        message: 'Timeout exceeded',
        code: 'ECONNABORTED',
      }

      mockAxiosPost.mockRejectedValue(axiosError)

      await expect(sendDiscordWebhook(mockEmbed)).rejects.toThrow()
    })
  })

  describe('embed variations', () => {
    it('should handle minimal embed', async () => {
      mockAxiosPost.mockResolvedValue({ status: 204 })

      const minimalEmbed: FullDiscordEmbed = {
        author: {
          name: 'Author',
        },
        fields: [],
        color: 0x000000,
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Footer',
        },
      }

      await sendDiscordWebhook(minimalEmbed)

      expect(mockAxiosPost).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          embeds: [minimalEmbed],
        })
      )
    })

    it('should handle embed with image', async () => {
      mockAxiosPost.mockResolvedValue({ status: 204 })

      const embedWithImage: FullDiscordEmbed = {
        ...mockEmbed,
        image: {
          url: 'https://example.com/image.png',
        },
      }

      await sendDiscordWebhook(embedWithImage)

      const callArgs = mockAxiosPost.mock.calls[0]
      expect(callArgs[1].embeds[0].image?.url).toBe(
        'https://example.com/image.png'
      )
    })

    it('should handle embed with URL', async () => {
      mockAxiosPost.mockResolvedValue({ status: 204 })

      const embedWithUrl: FullDiscordEmbed = {
        ...mockEmbed,
        url: 'https://example.com',
      }

      await sendDiscordWebhook(embedWithUrl)

      const callArgs = mockAxiosPost.mock.calls[0]
      expect(callArgs[1].embeds[0].url).toBe('https://example.com')
    })
  })

  describe('response handling', () => {
    it('should return response on success', async () => {
      const mockResponse = {
        status: 204,
        statusText: 'No Content',
        data: '',
      }

      mockAxiosPost.mockResolvedValue(mockResponse)

      const result = await sendDiscordWebhook(mockEmbed)

      expect(result.status).toBe(204)
      expect(result.statusText).toBe('No Content')
    })

    it('should handle 200 status code', async () => {
      mockAxiosPost.mockResolvedValue({
        status: 200,
        statusText: 'OK',
      })

      const result = await sendDiscordWebhook(mockEmbed)

      expect(result.status).toBe(200)
    })
  })
})
