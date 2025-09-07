import { useQuery } from '@tanstack/react-query';
import { popularBooksService } from '@/services/popular-books.service';
import type { Book } from '../types';

export const usePopularBooks = () => {
  const { data: popularBooksData, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['popular-books'],
    queryFn: async () => {
      console.log('🔄 Frontend: Fetching popular books...');
      const result = await popularBooksService.getPopularBooks();
      console.log('📥 Frontend: Received popular books:', result);
      return result;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  return {
    popularBooks: popularBooksData?.books || [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  };
};
