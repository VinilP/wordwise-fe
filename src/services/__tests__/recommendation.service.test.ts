import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { recommendationService } from '../recommendation.service';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('recommendationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('mock-token');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getRecommendations', () => {
    it('should return recommendations successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            recommendations: [
              {
                book: {
                  id: '1',
                  title: 'Test Book',
                  author: 'Test Author',
                  description: 'Test description',
                  coverImageUrl: 'https://example.com/cover.jpg',
                  genres: ['Fiction'],
                  publishedYear: 2023,
                  averageRating: 4.5,
                  reviewCount: 10,
                  createdAt: '2023-01-01T00:00:00Z',
                  updatedAt: '2023-01-01T00:00:00Z',
                },
                reason: 'Based on your preferences',
                confidence: 0.85,
              },
            ],
            message: 'Recommendations loaded successfully',
          },
        },
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      const result = await recommendationService.getRecommendations();

      expect(result).toEqual({
        recommendations: mockResponse.data.data.recommendations,
        message: mockResponse.data.data.message,
      });
    });

    it('should throw error when API response is not successful', async () => {
      const mockResponse = {
        data: {
          success: false,
          error: {
            message: 'Failed to get recommendations',
          },
        },
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      await expect(recommendationService.getRecommendations()).rejects.toThrow(
        'Failed to get recommendations'
      );
    });

    it('should handle 401 authentication error', async () => {
      const error = {
        response: {
          status: 401,
        },
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockRejectedValue(error),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      await expect(recommendationService.getRecommendations()).rejects.toThrow(
        'Authentication required. Please log in to get recommendations.'
      );
    });

    it('should handle 429 rate limit error', async () => {
      const error = {
        response: {
          status: 429,
        },
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockRejectedValue(error),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      await expect(recommendationService.getRecommendations()).rejects.toThrow(
        'Too many requests. Please try again later.'
      );
    });

    it('should handle 500 service unavailable error', async () => {
      const error = {
        response: {
          status: 500,
          data: {
            error: {
              code: 'SERVICE_UNAVAILABLE',
            },
          },
        },
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockRejectedValue(error),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      await expect(recommendationService.getRecommendations()).rejects.toThrow(
        'Recommendation service temporarily unavailable. Please try again later.'
      );
    });

    it('should handle network error', async () => {
      const error = {
        code: 'NETWORK_ERROR',
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockRejectedValue(error),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      await expect(recommendationService.getRecommendations()).rejects.toThrow(
        'Network error. Please check your connection and try again.'
      );
    });
  });

  describe('clearCache', () => {
    it('should clear cache successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
        },
      };

      mockedAxios.create.mockReturnValue({
        delete: vi.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      await expect(recommendationService.clearCache()).resolves.toBeUndefined();
    });

    it('should handle 401 authentication error', async () => {
      const error = {
        response: {
          status: 401,
        },
      };

      mockedAxios.create.mockReturnValue({
        delete: vi.fn().mockRejectedValue(error),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      await expect(recommendationService.clearCache()).rejects.toThrow(
        'Authentication required. Please log in to clear cache.'
      );
    });

    it('should handle 500 error', async () => {
      const error = {
        response: {
          status: 500,
        },
      };

      mockedAxios.create.mockReturnValue({
        delete: vi.fn().mockRejectedValue(error),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      await expect(recommendationService.clearCache()).rejects.toThrow(
        'Failed to clear cache. Please try again later.'
      );
    });
  });

  describe('refreshRecommendations', () => {
    it('should refresh recommendations successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            recommendations: [],
            message: 'Fresh recommendations',
          },
        },
      };

      const mockAxiosInstance = {
        delete: vi.fn().mockResolvedValue({ data: { success: true } }),
        get: vi.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      };

      mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

      const result = await recommendationService.refreshRecommendations();

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/recommendations/cache');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/recommendations');
      expect(result).toEqual({
        recommendations: [],
        message: 'Fresh recommendations',
      });
    });

    it('should continue with recommendations even if cache clearing fails', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            recommendations: [],
            message: 'Recommendations loaded',
          },
        },
      };

      const mockAxiosInstance = {
        delete: vi.fn().mockRejectedValue(new Error('Cache clear failed')),
        get: vi.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      };

      mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = await recommendationService.refreshRecommendations();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to clear cache, but continuing with recommendation fetch'
      );
      expect(result).toEqual({
        recommendations: [],
        message: 'Recommendations loaded',
      });

      consoleSpy.mockRestore();
    });
  });
});

