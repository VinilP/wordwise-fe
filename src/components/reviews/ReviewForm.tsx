import React, { useState } from "react";
import type { CreateReviewRequest, UpdateReviewRequest } from "../../types";
import RatingInput from "./RatingInput";

interface ReviewFormProps {
  bookId?: string;
  initialData?: {
    rating: number;
    content: string;
  };
  onSubmit: (data: CreateReviewRequest | UpdateReviewRequest) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  submitButtonText?: string;
  showCancel?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  bookId,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitButtonText = "Submit Review",
  showCancel = false,
}) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [content, setContent] = useState(initialData?.content || "");
  const [errors, setErrors] = useState<{ rating?: string; content?: string }>(
    {},
  );

  const validateForm = (): boolean => {
    const newErrors: { rating?: string; content?: string } = {};

    if (rating === 0) {
      newErrors.rating = "Please select a rating";
    }

    if (content.trim().length < 10) {
      newErrors.content = "Review must be at least 10 characters long";
    }

    if (content.trim().length > 1000) {
      newErrors.content = "Review must be less than 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("📝 ReviewForm: Form submission started");

    if (!validateForm()) {
      console.log("❌ ReviewForm: Form validation failed");
      return;
    }

    try {
      const reviewData = bookId
        ? { bookId, rating, content: content.trim() }
        : { rating, content: content.trim() };

      console.log("📤 ReviewForm: Calling onSubmit with data:", reviewData);
      await onSubmit(reviewData);
      console.log("✅ ReviewForm: onSubmit completed successfully");

      // Reset form if it's a create form (has bookId)
      if (bookId) {
        setRating(0);
        setContent("");
        setErrors({});
        console.log("🔄 ReviewForm: Form reset completed");
      }
    } catch (error) {
      console.error("❌ ReviewForm: Error submitting review:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      data-testid="review-form"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating *
        </label>
        <RatingInput
          value={rating}
          onChange={setRating}
          disabled={isLoading}
          error={errors.rating}
        />
      </div>

      <div>
        <label
          htmlFor="review-content"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Review *
        </label>
        <textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isLoading}
          rows={6}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${errors.content ? "border-red-300" : "border-gray-300"}
            ${isLoading ? "bg-gray-50 cursor-not-allowed" : "bg-white"}
          `}
          placeholder="Share your thoughts about this book..."
          maxLength={1000}
          data-testid="review-content"
        />
        <div className="mt-1 flex justify-between">
          {errors.content && (
            <p className="text-sm text-red-600" role="alert">
              {errors.content}
            </p>
          )}
          <p className="text-sm text-gray-500 ml-auto">
            {content.length}/1000 characters
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {showCancel && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || rating === 0}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="submit-review-button"
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </div>
          ) : (
            submitButtonText
          )}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
