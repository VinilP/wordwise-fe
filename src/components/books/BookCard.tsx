import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import {
  hasRating,
  getRatingValue,
  getReviewCount,
  generateStarRating,
} from "../../utils/ratingUtils";
import type { Book } from "@/types";

interface BookCardProps {
  book: Book;
  className?: string;
}

export const BookCard: React.FC<BookCardProps> = ({ book, className = "" }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(book.coverImageUrl);

  // Add timeout for slow-loading images
  useEffect(() => {
    const timer = setTimeout(() => {
      if (imageLoading) {
        console.log(`Image loading timeout for book: ${book.title}`);
        setImageLoading(false);
        setImageError(true);
      }
    }, 3000); // 3 second timeout

    return () => clearTimeout(timer);
  }, [imageLoading, book.title]);

  // Function to try fallback image URLs
  const tryFallbackImage = (originalUrl: string) => {
    // Try medium size instead of large
    if (originalUrl.includes("-L.jpg")) {
      const mediumUrl = originalUrl.replace("-L.jpg", "-M.jpg");
      setCurrentImageUrl(mediumUrl);
      setImageLoading(true);
      setImageError(false);
    } else if (originalUrl.includes("-M.jpg")) {
      // Try small size
      const smallUrl = originalUrl.replace("-M.jpg", "-S.jpg");
      setCurrentImageUrl(smallUrl);
      setImageLoading(true);
      setImageError(false);
    } else {
      // No more fallbacks, show placeholder
      setImageLoading(false);
      setImageError(true);
    }
  };

  const renderStars = (rating: number | null) => {
    if (!hasRating(rating)) {
      return <span className="text-gray-400 text-sm">No ratings yet</span>;
    }

    const starRating = generateStarRating(rating);
    return starRating.map((starType, index) => {
      switch (starType) {
        case "full":
          return (
            <span key={index} className="text-yellow-400">
              ★
            </span>
          );
        case "half":
          return (
            <span key={index} className="text-yellow-400">
              ☆
            </span>
          );
        default:
          return (
            <span key={index} className="text-gray-300">
              ☆
            </span>
          );
      }
    });
  };

  return (
    <div
      className={`tooltip group relative w-full ${className}`}
      data-testid="book-card"
    >
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 w-full">
        <Link
          to={`/books/${book.id}`}
          className="block focus:outline-none w-full"
          aria-label={`View details for ${book.title} by ${book.author}`}
        >
          <div
            className="aspect-[3/4] overflow-hidden relative bg-gray-100 w-full"
            style={{
              minHeight: "200px",
              maxHeight: "300px",
            }}
          >
            {/* Loading skeleton */}
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <LoadingSpinner
                  size="md"
                  text="Loading..."
                  className="text-gray-400"
                />
              </div>
            )}

            {/* Book cover image */}
            <img
              src={currentImageUrl}
              alt={`Cover of ${book.title} by ${book.author}`}
              className={`w-full h-full object-cover hover:scale-105 transition-all duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              loading="lazy"
              onLoad={() => {
                setImageLoading(false);
                setImageError(false);
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                // Try fallback images first
                if (target.src !== "/placeholder-book-cover.jpg") {
                  tryFallbackImage(target.src);
                } else {
                  // No more fallbacks, show placeholder
                  setImageLoading(false);
                  setImageError(true);
                }
              }}
            />

            {/* Placeholder for missing images */}
            {imageError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-500">
                <svg
                  className="w-12 h-12 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span className="text-xs text-center px-2">No Cover</span>
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
              {book.title}
            </h3>

            <p className="text-gray-600 mb-2 line-clamp-1">by {book.author}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <div
                  className="flex"
                  role="img"
                  aria-label={`${getRatingValue(book.averageRating)} out of 5 stars`}
                >
                  {renderStars(book.averageRating)}
                </div>
                {hasRating(book.averageRating) && (
                  <span
                    className="text-sm text-gray-600 ml-1"
                    aria-label={`${getReviewCount(book.reviewCount)} reviews`}
                  >
                    ({getReviewCount(book.reviewCount)})
                  </span>
                )}
              </div>

              {hasRating(book.averageRating) && (
                <span
                  className="text-sm font-medium text-gray-700"
                  aria-label={`Average rating: ${getRatingValue(book.averageRating)}`}
                >
                  {getRatingValue(book.averageRating)}
                </span>
              )}
            </div>

            <div
              className="mt-2 flex flex-wrap gap-1"
              role="list"
              aria-label="Book genres"
            >
              {book.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  role="listitem"
                >
                  {genre}
                </span>
              ))}
              {book.genres.length > 2 && (
                <span
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  role="listitem"
                  aria-label={`${book.genres.length - 2} more genres`}
                >
                  +{book.genres.length - 2}
                </span>
              )}
            </div>

            {/* Favorite Button */}
            <div className="mt-3 flex justify-end">
              <FavoriteButton book={book} size="sm" />
            </div>
          </div>
        </Link>
      </article>
      <div className="tooltip-content group-hover:opacity-100 group-hover:visible">
        {book.title}
      </div>
    </div>
  );
};
