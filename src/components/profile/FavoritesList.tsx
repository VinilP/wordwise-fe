import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { userService } from "@/services/user.service";
import FavoriteButton from "@/components/books/FavoriteButton";
import { getRatingValue, getReviewCount } from "../../utils/ratingUtils";
import type { UserFavorite } from "@/types";

interface FavoritesListProps {
  onFavoriteRemoved?: (bookId: string) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ onFavoriteRemoved }) => {
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userFavorites = await userService.getFavorites();
      setFavorites(userFavorites);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load favorites");
      console.error("Failed to load favorites:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteRemoved = (bookId: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.bookId !== bookId));
    onFavoriteRemoved?.(bookId);
  };

  const handleFavoriteChange = (bookId: string, isFavorite: boolean) => {
    if (!isFavorite) {
      handleFavoriteRemoved(bookId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading your favorites...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Failed to load favorites
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadFavorites}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No favorites yet
        </h3>
        <p className="text-gray-600 mb-4">
          Start exploring books and add them to your favorites to see them here.
        </p>
        <Link
          to="/books"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
        >
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Your Favorites ({favorites.length})
        </h2>
        <button
          onClick={loadFavorites}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites
          .filter(
            (favorite) =>
              favorite && favorite.id && favorite.book && favorite.book.id,
          )
          .map((favorite) => (
            <FavoriteBookCard
              key={favorite.id}
              favorite={favorite}
              onFavoriteChange={handleFavoriteChange}
              data-testid="favorite-book"
            />
          ))}
      </div>
    </div>
  );
};

interface FavoriteBookCardProps {
  favorite: UserFavorite;
  onFavoriteChange: (bookId: string, isFavorite: boolean) => void;
  "data-testid"?: string;
}

const FavoriteBookCard: React.FC<FavoriteBookCardProps> = ({
  favorite,
  onFavoriteChange,
  ...props
}) => {
  const { book } = favorite;

  // Early return if book is not available
  if (!book || !book.id) {
    return null;
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
      data-testid={props["data-testid"]}
    >
      <Link to={`/books/${book.id}`} className="block">
        <div className="aspect-w-3 aspect-h-4 bg-gray-200">
          {book.coverImageUrl ? (
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
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
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <Link to={`/books/${book.id}`}>
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                {book.title}
              </h3>
            </Link>
            <p className="text-sm text-gray-600 mt-1 line-clamp-1">
              by {book.author}
            </p>
          </div>
          <div className="ml-2 flex-shrink-0">
            <FavoriteButton
              book={book}
              size="sm"
              onFavoriteChange={(isFavorite) =>
                onFavoriteChange(book.id, isFavorite)
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{getRatingValue(book.averageRating)}</span>
            <span className="mx-1">•</span>
            <span>{getReviewCount(book.reviewCount)} reviews</span>
          </div>
          <span>{book.publishedYear || "N/A"}</span>
        </div>

        {book.genres && book.genres.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {book.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
              >
                {genre}
              </span>
            ))}
            {book.genres.length > 2 && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                +{book.genres.length - 2}
              </span>
            )}
          </div>
        )}

        <div className="mt-2 text-xs text-gray-400">
          Added {new Date(favorite.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default FavoritesList;
