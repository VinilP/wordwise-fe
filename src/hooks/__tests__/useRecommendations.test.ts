import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useRecommendations } from '../useRecommendations';
import { recommendationService } from '../../services/recommendation.service';

// Mock the recommendation service
vi.mock('../../services/recommendation.service', () => ({
  recommendationService: {
    getRecommendations: vi.fn(),
    clearCache: vi.fn(),
  },
}));

const mockRecommendationService = vi.mocked(recommendationService);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useRecommendations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return recommendations successfully', async () => {
    const mockRecommendations = [
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
    ];

    mockRecommendationService.getRecommendations.mockResolvedValue({
      recommendations: mockRecommendations,
      message: 'Recommendations loaded successfully',
    });

    const { result } = renderHook(() => useRecommendations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.recommendations).toEqual(mockRecommendations);
    expect(result.current.message).toBe('Recommendations loaded successfully');
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle loading state', () => {
    mockRecommendationService.getRecommendations.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useRecommendations(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.recommendations).toEqual([]);
    expect(result.current.isError).toBe(false);
  });

  it('should handle error state', async () => {
    const errorMessage = 'Failed to load recommendations';
    mockRecommendationService.getRecommendations.mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useRecommendations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.recommendations).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle API error response', async () => {
    const apiError = {
      response: {
        data: {
          error: {
            message: 'API Error',
          },
        },
      },
    };

    mockRecommendationService.getRecommendations.mockRejectedValue(apiError);

    const { result } = renderHook(() => useRecommendations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe('API Error');
  });

  it('should refresh recommendations successfully', async () => {
    const mockRecommendations = [
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
    ];

    mockRecommendationService.getRecommendations.mockResolvedValue({
      recommendations: mockRecommendations,
      message: 'Fresh recommendations',
    });

    mockRecommendationService.clearCache.mockResolvedValue();

    const { result } = renderHook(() => useRecommendations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.refresh();

    expect(mockRecommendationService.clearCache).toHaveBeenCalled();
    expect(mockRecommendationService.getRecommendations).toHaveBeenCalledTimes(2);
  });

  it('should handle refresh error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockRecommendationService.getRecommendations.mockResolvedValue({
      recommendations: [],
      message: 'Recommendations loaded',
    });

    mockRecommendationService.clearCache.mockRejectedValue(
      new Error('Cache clear failed')
    );

    const { result } = renderHook(() => useRecommendations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.refresh();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to refresh recommendations:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('should force refresh recommendations', async () => {
    const mockRecommendations = [
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
    ];

    mockRecommendationService.getRecommendations.mockResolvedValue({
      recommendations: mockRecommendations,
      message: 'Force refreshed recommendations',
    });

    mockRecommendationService.clearCache.mockResolvedValue();

    const { result } = renderHook(() => useRecommendations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.forceRefresh();

    expect(mockRecommendationService.clearCache).toHaveBeenCalled();
    expect(mockRecommendationService.getRecommendations).toHaveBeenCalledTimes(2);
  });

  it('should not retry on authentication errors', async () => {
    const authError = new Error('Authentication required');
    mockRecommendationService.getRecommendations.mockRejectedValue(authError);

    const { result } = renderHook(() => useRecommendations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Should only be called once (no retries)
    expect(mockRecommendationService.getRecommendations).toHaveBeenCalledTimes(1);
  });

  it('should update lastUpdated timestamp on success', async () => {
    const mockRecommendations = [
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
    ];

    mockRecommendationService.getRecommendations.mockResolvedValue({
      recommendations: mockRecommendations,
      message: 'Recommendations loaded',
    });

    const { result } = renderHook(() => useRecommendations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.lastUpdated).toBeInstanceOf(Date);
  });
});

