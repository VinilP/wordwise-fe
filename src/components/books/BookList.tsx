import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookCard } from "./BookCard";
import { BookSearch } from "./BookSearch";
import { Pagination } from "../ui/Pagination";
import { ErrorMessage } from "../ui/ErrorMessage";
import { BookCardSkeleton } from "../ui/BookCardSkeleton";
import { bookService } from "../../services";
import { useResponsive } from "../../hooks/useAccessibility";
import type { SearchFilters, PaginationParams } from "@/types";

interface BookListProps {
  className?: string;
}

export const BookList: React.FC<BookListProps> = ({ className = "" }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const { isMobile, isTablet } = useResponsive();

  // Responsive books per page
  const booksPerPage = isMobile ? 6 : isTablet ? 9 : 12;

  const pagination: PaginationParams = {
    page: currentPage,
    limit: booksPerPage,
  };

  // React Query for fetching books
  const {
    data: booksData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["books", pagination, filters],
    queryFn: () => bookService.getBooks(pagination, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isError) {
    return (
      <div
        className={`text-center py-12 ${className}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="max-w-md mx-auto">
          <ErrorMessage
            error={
              error instanceof Error
                ? error.message
                : "Something went wrong while loading the books."
            }
            variant="banner"
            className="mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load books
          </h3>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Retry loading books"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Search and filters */}
      <BookSearch
        onSearch={handleSearch}
        initialFilters={filters}
        className="mb-6"
      />

      {/* Loading state */}
      {isLoading && (
        <div
          className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
          role="grid"
          aria-label="Loading books"
        >
          {Array.from({ length: booksPerPage }).map((_, index) => (
            <div key={index} className="w-full">
              <BookCardSkeleton />
            </div>
          ))}
        </div>
      )}

      {/* Books grid */}
      {!isLoading && booksData && (
        <>
          {/* Results summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
            <p className="text-gray-600" role="status" aria-live="polite">
              {!booksData.totalCount || booksData.totalCount === 0 ? (
                "No results found"
              ) : (
                <>
                  Showing {(currentPage - 1) * booksPerPage + 1} to{" "}
                  {Math.min(currentPage * booksPerPage, booksData.totalCount)}{" "}
                  of {booksData.totalCount} books
                </>
              )}
            </p>

            {booksData.totalCount > 0 && booksData.totalPages && (
              <p className="text-sm text-gray-500">
                Page {currentPage} of {booksData.totalPages}
              </p>
            )}
          </div>

          {/* Books grid */}
          {booksData.books && booksData.books.length > 0 ? (
            <div
              className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
              role="grid"
              aria-label="Books grid"
              data-testid="book-grid"
            >
              {booksData.books
                .filter((book) => book && book.id)
                .map((book, index) => (
                  <div
                    key={book.id}
                    role="gridcell"
                    aria-rowindex={
                      Math.floor(index / (isMobile ? 1 : isTablet ? 2 : 4)) + 1
                    }
                    className="w-full"
                  >
                    <BookCard book={book} />
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12" role="status" aria-live="polite">
              <div className="text-gray-400 mb-4" aria-hidden="true">
                <svg
                  className="h-12 w-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No books found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters.
              </p>
              <button
                onClick={() => handleSearch({})}
                className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
                aria-label="Clear all search filters"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {booksData.totalPages && booksData.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={booksData.totalPages}
              onPageChange={handlePageChange}
              hasNextPage={booksData.hasNextPage}
              hasPreviousPage={booksData.hasPreviousPage}
              className="mt-8"
            />
          )}
        </>
      )}
    </div>
  );
};
