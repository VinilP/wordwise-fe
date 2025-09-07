import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { userService } from "@/services/user.service";
import { reviewService } from "@/services/review.service";
import type { Review } from "@/types";

interface ReviewHistoryProps {
  onReviewDeleted?: (reviewId: string) => void;
}

const ReviewHistory: React.FC<ReviewHistoryProps> = ({ onReviewDeleted }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const profileData = await userService.getProfileWithDetails();
      setReviews(profileData.reviews || []);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load review history",
      );
      console.error("Failed to load reviews:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewDeleted = (reviewId: string) => {
    setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    onReviewDeleted?.(reviewId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading your reviews...</span>
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
          Failed to load reviews
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadReviews}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (reviews.length === 0) {
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
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No reviews yet
        </h3>
        <p className="text-gray-600 mb-4">
          Start reading books and share your thoughts with reviews.
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
          Your Reviews ({reviews.length})
        </h2>
        <button
          onClick={loadReviews}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {reviews
          .filter((review) => review && review.id)
          .map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onReviewDeleted={handleReviewDeleted}
              data-testid="user-review"
            />
          ))}
      </div>
    </div>
  );
};

interface ReviewCardProps {
  review: Review;
  onReviewDeleted: (reviewId: string) => void;
  "data-testid"?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onReviewDeleted,
  ...props
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await reviewService.deleteReview(review.id);
      onReviewDeleted(review.id);
    } catch (error) {
      console.error("Failed to delete review:", error);
      alert("Failed to delete review. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
      data-testid={props["data-testid"]}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link
            to={`/books/${review.bookId}`}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {review.book?.title || "Unknown Book"}
          </Link>
          <p className="text-sm text-gray-600 mt-1">
            by {review.book?.author || "Unknown Author"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">{renderStars(review.rating)}</div>
          <span className="text-sm text-gray-500">{review.rating}/5</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{review.content}</p>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>
            Reviewed on {new Date(review.createdAt).toLocaleDateString()}
          </span>
          {review.updatedAt !== review.createdAt && (
            <span>
              Updated on {new Date(review.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewHistory;
