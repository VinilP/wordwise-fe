import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
  className = "",
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages();

  return (
    <nav
      className={`flex items-center justify-center space-x-1 ${className}`}
      aria-label="Pagination Navigation"
      role="navigation"
    >
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          hasPreviousPage
            ? "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            : "text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed"
        }`}
        aria-label={`Go to previous page, page ${currentPage - 1}`}
        aria-disabled={!hasPreviousPage}
      >
        <span className="sr-only">Previous page</span>
        <span aria-hidden="true">Previous</span>
      </button>

      {/* Page numbers */}
      <div className="flex space-x-1" role="group" aria-label="Page numbers">
        {visiblePages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="px-3 py-2 text-gray-500"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isCurrentPage = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isCurrentPage
                  ? "bg-blue-600 text-white border border-blue-600"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isCurrentPage ? "page" : undefined}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          hasNextPage
            ? "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            : "text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed"
        }`}
        aria-label={`Go to next page, page ${currentPage + 1}`}
        aria-disabled={!hasNextPage}
      >
        <span className="sr-only">Next page</span>
        <span aria-hidden="true">Next</span>
      </button>
    </nav>
  );
};
