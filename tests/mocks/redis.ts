import RedisMock from 'ioredis-mock'

/**
 * Create a mock Redis client for testing
 * This uses ioredis-mock to simulate Redis behavior in-memory
 */
export const createMockRedisClient = () => {
  return new RedisMock()
}

/**
 * Mock the Redis module to return our mock client
 */
export const mockRedis = () => {
  const mockClient = createMockRedisClient()

  // Mock the redis module
  vi.mock('@/lib/redis', () => ({
    redis: mockClient,
  }))

  return mockClient
}
