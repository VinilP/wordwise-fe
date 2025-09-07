import React, { useState, useEffect } from "react";
// import { SearchFilters } from '../../types';

// Temporary type definition
interface SearchFilters {
  query?: string;
  genres?: string[];
  minRating?: number;
  publishedYear?: number;
}

interface BookSearchProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
  className?: string;
}

export const BookSearch: React.FC<BookSearchProps> = ({
  onSearch,
  initialFilters = {},
  className = "",
}) => {
  const [query, setQuery] = useState(initialFilters.query || "");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    initialFilters.genres || [],
  );
  const [minRating, setMinRating] = useState<number | undefined>(
    initialFilters.minRating,
  );
  const [publishedYear, setPublishedYear] = useState<number | undefined>(
    initialFilters.publishedYear,
  );
  const [showFilters, setShowFilters] = useState(false);

  // Available genres (in a real app, this might come from an API)
  const availableGenres = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Fantasy",
    "Biography",
    "History",
    "Self-Help",
    "Business",
    "Technology",
    "Health",
  ];

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, selectedGenres, minRating, publishedYear]);

  const handleSearch = () => {
    const filters: SearchFilters = {
      query: query.trim() || "",
      genres: selectedGenres.length > 0 ? selectedGenres : undefined,
      minRating: minRating || undefined,
      publishedYear: publishedYear || undefined,
    };
    onSearch(filters);
  };

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedGenres([]);
    setMinRating(undefined);
    setPublishedYear(undefined);
  };

  const hasActiveFilters =
    query || selectedGenres.length > 0 || minRating || publishedYear;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
      role="search"
      aria-label="Book search and filters"
    >
      {/* Header with search and filter controls */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <label htmlFor="book-search" className="sr-only">
              Search books by title or author
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              id="book-search"
              type="text"
              placeholder="Search books by title or author..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              aria-describedby="search-help"
              data-testid="search-input"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              data-testid="search-button"
              aria-label="Search books"
            >
              <svg
                className="h-5 w-5 text-gray-400 hover:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <div id="search-help" className="sr-only">
              Type to search for books by title or author. Results will update
              automatically.
            </div>
          </div>

          {/* Filter controls */}
          <div className="flex items-center gap-3">
            {/* Active filters indicator */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                <div className="flex items-center gap-1">
                  {query && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Search: "{query}"
                    </span>
                  )}
                  {selectedGenres.length > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {selectedGenres.length} genre
                      {selectedGenres.length > 1 ? "s" : ""}
                    </span>
                  )}
                  {minRating && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {minRating}+ stars
                    </span>
                  )}
                  {publishedYear && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {publishedYear}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Filter toggle and clear buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-3 py-2 border border-gray-300 hover:border-gray-400"
                aria-expanded={showFilters}
                aria-controls="filters-panel"
                aria-label={`${showFilters ? "Hide" : "Show"} search filters`}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span>Filters</span>
                {hasActiveFilters && (
                  <span
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    aria-label="Active filters"
                  >
                    {
                      [
                        query,
                        selectedGenres.length,
                        minRating,
                        publishedYear,
                      ].filter(Boolean).length
                    }
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md px-3 py-2 border border-red-300 hover:border-red-400"
                  aria-label="Clear all search filters"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div
          id="filters-panel"
          className="p-4"
          role="region"
          aria-label="Search filters"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Genre filter */}
            <div className="md:col-span-2">
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-3">
                  Genres
                </legend>
                <div
                  className="flex flex-wrap gap-2"
                  role="group"
                  aria-label="Select genres"
                >
                  {availableGenres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        selectedGenres.includes(genre)
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                      }`}
                      aria-pressed={selectedGenres.includes(genre)}
                      aria-label={`${selectedGenres.includes(genre) ? "Remove" : "Add"} ${genre} filter`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* Rating and Year filters */}
            <div className="space-y-4">
              {/* Rating filter */}
              <div>
                <label
                  htmlFor="min-rating"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Minimum Rating
                </label>
                <select
                  id="min-rating"
                  value={minRating || ""}
                  onChange={(e) =>
                    setMinRating(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  aria-label="Select minimum rating filter"
                >
                  <option value="">Any rating</option>
                  <option value="1">⭐ 1+ stars</option>
                  <option value="2">⭐⭐ 2+ stars</option>
                  <option value="3">⭐⭐⭐ 3+ stars</option>
                  <option value="4">⭐⭐⭐⭐ 4+ stars</option>
                  <option value="5">⭐⭐⭐⭐⭐ 5 stars</option>
                </select>
              </div>

              {/* Published year filter */}
              <div>
                <label
                  htmlFor="published-year"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Published Year
                </label>
                <input
                  id="published-year"
                  type="number"
                  placeholder="e.g., 2020"
                  min="1000"
                  max={new Date().getFullYear()}
                  value={publishedYear || ""}
                  onChange={(e) =>
                    setPublishedYear(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Enter published year filter"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
