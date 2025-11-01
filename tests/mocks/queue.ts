import { vi } from 'vitest'

/**
 * Mock BullMQ Queue
 */
export const createMockQueue = () => {
  return {
    add: vi.fn().mockResolvedValue({
      id: 'test-job-id',
      data: {},
      opts: {},
    }),
    close: vi.fn().mockResolvedValue(undefined),
    getJob: vi.fn(),
    getJobs: vi.fn().mockResolvedValue([]),
  }
}

/**
 * Mock the queue module
 */
export const mockQueue = () => {
  const mockQueueInstance = createMockQueue()

  vi.mock('@/lib/queue', () => ({
    discordWebhookQueue: mockQueueInstance,
  }))

  return mockQueueInstance
}
