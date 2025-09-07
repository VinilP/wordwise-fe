import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { recommendationService } from '../services';
import type { Recommendation } from '@/types';

export const useRecommendations = () => {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const queryClient = useQueryClient();

  // React Query for fetching recommendations
  const {
    data: recommendationsData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      console.log('🔄 Frontend: Fetching recommendations...');
      const result = await recommendationService.getRecommendations();
      console.log('📥 Frontend: Received recommendations:', result);
      return result;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error?.message?.includes('Authentication required')) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onSuccess: () => {
      setLastUpdated(new Date());
    }
  });

  const handleRefresh = useCallback(async () => {
    try {
      // Clear the cache and fetch fresh recommendations
      await recommendationService.clearCache();
      await refetch();
    } catch (error) {
      console.error('Failed to refresh recommendations:', error);
      // Still try to refetch even if cache clearing fails
      await refetch();
    }
  }, [refetch]);

  const handleForceRefresh = useCallback(async () => {
    try {
      // Force refresh by invalidating the query cache
      await queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      await recommendationService.clearCache();
      await refetch();
    } catch (error) {
      console.error('Failed to force refresh recommendations:', error);
      await refetch();
    }
  }, [queryClient, refetch]);

  const getErrorMessage = useCallback((error: any): string => {
    if (error?.message) {
      return error.message;
    }
    if (error?.response?.data?.error?.message) {
      return error.response.data.error.message;
    }
    return 'An unexpected error occurred while loading recommendations.';
  }, []);

  return {
    recommendations: recommendationsData?.recommendations || [],
    message: recommendationsData?.message || '',
    isLoading,
    isError,
    error: isError ? getErrorMessage(error) : null,
    isFetching,
    lastUpdated,
    refresh: handleRefresh,
    forceRefresh: handleForceRefresh,
    refetch
  };
};
