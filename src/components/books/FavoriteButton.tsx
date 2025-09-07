import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/user.service";
import type { Book } from "@/types";

interface FavoriteButtonProps {
  book: Book;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  onFavoriteChange?: (isFavorite: boolean) => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  book,
  size = "md",
  showText = false,
  onFavoriteChange,
}) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check initial favorite status
  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [user, book.id]);

  const checkFavoriteStatus = async () => {
    try {
      const status = await userService.checkFavoriteStatus(book.id);
      setIsFavorite(status);
    } catch (err) {
      console.error("Failed to check favorite status:", err);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      setError("Please log in to add favorites");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isFavorite) {
        await userService.removeFromFavorites(book.id);
        setIsFavorite(false);
        onFavoriteChange?.(false);
      } else {
        await userService.addToFavorites(book.id);
        setIsFavorite(true);
        onFavoriteChange?.(true);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to update favorites",
      );
      console.error("Failed to toggle favorite:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <button
        disabled
        className="flex items-center gap-2 text-gray-400 cursor-not-allowed"
        title="Please log in to add favorites"
      >
        <HeartIcon filled={false} size={size} />
        {showText && <span>Add to Favorites</span>}
      </button>
    );
  }

  const sizeClasses = {
    sm: "p-1",
    md: "p-2",
    lg: "p-3",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={`
          flex items-center gap-2 transition-all duration-200 rounded-lg
          ${sizeClasses[size]}
          ${
            isFavorite
              ? "text-red-500 hover:text-red-600"
              : "text-gray-400 hover:text-red-500"
          }
          ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}
        `}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        data-testid="favorite-button"
      >
        <HeartIcon filled={isFavorite} size={size} />
        {showText && (
          <span className="text-sm font-medium">
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </span>
        )}
        {isLoading && (
          <div className={`${iconSizes[size]} animate-spin`}>
            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </button>

      {error && (
        <p className="text-xs text-red-500 mt-1 text-center max-w-32">
          {error}
        </p>
      )}
    </div>
  );
};

interface HeartIconProps {
  filled: boolean;
  size: "sm" | "md" | "lg";
}

const HeartIcon: React.FC<HeartIconProps> = ({ filled, size }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  if (filled) {
    return (
      <svg
        className={sizeClasses[size]}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  return (
    <svg
      className={sizeClasses[size]}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
};

export default FavoriteButton;
