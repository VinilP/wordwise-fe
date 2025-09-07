import React, { useState } from "react";
import type { Review } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import RatingDisplay from "./RatingDisplay";

interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  showBookInfo?: boolean;
  className?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onEdit,
  onDelete,
  showBookInfo = false,
  className = "",
}) => {
  const { user } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = user?.id === review.userId;
  const reviewDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(review.id);
    }
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(review);
    }
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm ${className}`}
    >
      {/* Header with user info and rating */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">
                {review.user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              {review.user?.name || "Anonymous User"}
            </h4>
            <p className="text-sm text-gray-500">{reviewDate}</p>
          </div>
        </div>
        <RatingDisplay rating={review.rating} size="sm" />
      </div>

      {/* Book info (if showing) */}
      {showBookInfo && review.book && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <h5 className="text-sm font-medium text-gray-900 mb-1">
            {review.book.title}
          </h5>
          <p className="text-sm text-gray-600">by {review.book.author}</p>
        </div>
      )}

      {/* Review content */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{review.content}</p>
      </div>

      {/* Action buttons for owner */}
      {isOwner && (onEdit || onDelete) && (
        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
          {onEdit && (
            <button
              onClick={handleEditClick}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
            >
              Delete
            </button>
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                Delete Review
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
