import React, { useEffect, useRef } from "react";
import type { Review, UpdateReviewRequest } from "../../types";
import ReviewForm from "./ReviewForm";

interface ReviewEditModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewId: string, data: UpdateReviewRequest) => Promise<void>;
  isLoading?: boolean;
}

const ReviewEditModal: React.FC<ReviewEditModalProps> = ({
  review,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (data: UpdateReviewRequest) => {
    if (review) {
      await onSubmit(review.id, data);
      onClose();
    }
  };

  if (!isOpen || !review) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Review</h2>
            {review.book && (
              <p className="text-sm text-gray-600 mt-1">
                for "{review.book.title}" by {review.book.author}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
            aria-label="Close modal"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <ReviewForm
            initialData={{
              rating: review.rating,
              content: review.content,
            }}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            submitButtonText="Update Review"
            showCancel={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewEditModal;
