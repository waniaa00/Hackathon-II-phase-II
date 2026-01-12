/**
 * API Client Error Handling Tests - Better-Auth Integration
 *
 * Tests for verifying error handling in the API client, specifically for:
 * - Backend unavailability (503 errors)
 * - Network errors and timeouts
 * - Retry logic functionality
 */

// Mock the fetch function to simulate different error scenarios
global.fetch = jest.fn();

import { todoApi } from '@/lib/api/todos';

describe('API Client Error Handling', () => {
  beforeEach(() => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockClear();
  });

  describe('Backend Unavailability (503 Errors)', () => {
    it('should retry on 503 Service Unavailable errors', async () => {
      // Mock fetch to return 503 errors for the first 2 attempts, then success
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      let callCount = 0;

      mockFetch.mockImplementation(() => {
        callCount++;
        if (callCount <= 2) {
          // Return a mock Response with 503 status
          return Promise.resolve({
            ok: false,
            status: 503,
            statusText: 'Service Unavailable',
            json: () => Promise.resolve({ detail: 'Service temporarily unavailable' }),
          } as Response);
        } else {
          // Return success on 3rd attempt
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve([{ id: 1, title: 'Test Todo' }]),
          } as Response);
        }
      });

      // Call the API function - should succeed after retries
      const result = await todoApi.getTodos();

      // Should have been called 3 times (original + 2 retries)
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(result).toEqual([{ id: 1, title: 'Test Todo' }]);
    });

    it('should throw error after max retries for 503 errors', async () => {
      // Mock fetch to always return 503 errors
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValue({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        json: () => Promise.resolve({ detail: 'Service temporarily unavailable' }),
      } as Response);

      // Should throw error after max retries (3)
      await expect(todoApi.getTodos()).rejects.toThrow('API request failed: 503 Service Unavailable');
      expect(mockFetch).toHaveBeenCalledTimes(4); // Original + 3 retries
    });

    it('should distinguish between 503 and 400 errors (503 should retry, 400 should not)', async () => {
      // Test 503 - should retry
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      let callCount = 0;

      mockFetch.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // Return 400 error (should not retry)
          return Promise.resolve({
            ok: false,
            status: 400,
            statusText: 'Bad Request',
            json: () => Promise.resolve({ detail: 'Invalid request' }),
          } as Response);
        } else {
          // Should not reach here for 400 error
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve([]),
          } as Response);
        }
      });

      // 400 error should NOT retry
      await expect(todoApi.getTodos()).rejects.toThrow('Invalid request');
      expect(mockFetch).toHaveBeenCalledTimes(1); // Should only be called once for 400 error

      // Reset mock and test 503
      mockFetch.mockClear();
      callCount = 0;

      mockFetch.mockImplementation(() => {
        callCount++;
        if (callCount <= 2) {
          // Return 503 errors for first 2 attempts
          return Promise.resolve({
            ok: false,
            status: 503,
            statusText: 'Service Unavailable',
            json: () => Promise.resolve({ detail: 'Service temporarily unavailable' }),
          } as Response);
        } else {
          // Success on 3rd attempt
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve([{ id: 1, title: 'Test Todo' }]),
          } as Response);
        }
      });

      // 503 error should retry
      const result = await todoApi.getTodos();
      expect(mockFetch).toHaveBeenCalledTimes(3); // Called 3 times due to retries
      expect(result).toEqual([{ id: 1, title: 'Test Todo' }]);
    });
  });

  describe('Network Error Handling', () => {
    it('should retry on network errors', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch
        .mockRejectedValueOnce(new TypeError('Network request failed')) // First attempt fails
        .mockRejectedValueOnce(new TypeError('Network request failed')) // Second attempt fails
        .mockResolvedValue({ // Third attempt succeeds
          ok: true,
          status: 200,
          json: () => Promise.resolve([{ id: 1, title: 'Test Todo' }]),
        } as Response);

      const result = await todoApi.getTodos();

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(result).toEqual([{ id: 1, title: 'Test Todo' }]);
    });

    it('should retry on timeout errors', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch
        .mockRejectedValueOnce(new Error('timeout')) // First attempt fails
        .mockRejectedValueOnce(new Error('timeout')) // Second attempt fails
        .mockResolvedValue({ // Third attempt succeeds
          ok: true,
          status: 200,
          json: () => Promise.resolve([{ id: 1, title: 'Test Todo' }]),
        } as Response);

      const result = await todoApi.getTodos();

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(result).toEqual([{ id: 1, title: 'Test Todo' }]);
    });

    it('should throw error after max retries for network errors', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockRejectedValue(new TypeError('Network request failed'));

      await expect(todoApi.getTodos()).rejects.toThrow('Network request failed');
      expect(mockFetch).toHaveBeenCalledTimes(4); // Original + 3 retries
    });
  });
});