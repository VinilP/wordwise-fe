import { useState, useEffect } from "react";
import type { Review, UpdateReviewRequest } from "@/types";
import { reviewService } from "../services";

export const useUserReviews = (userId: string | undefined) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const userReviews = await reviewService.getReviewsByUser(userId);
      setReviews(userReviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const updateReview = async (reviewId: string, data: UpdateReviewRequest) => {
    try {
      const updatedReview = await reviewService.updateReview(reviewId, data);
      setReviews((prev) =>
        prev.map((review) => (review.id === reviewId ? updatedReview : review)),
      );
    } catch (err) {
      throw err;
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      await reviewService.deleteReview(reviewId);
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [userId]);

  return {
    reviews,
    isLoading,
    error,
    refetch: fetchReviews,
    updateReview,
    deleteReview,
  };
};

export const useBookReviews = (bookId: string | undefined) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    if (!bookId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const bookReviews = await reviewService.getReviewsByBook(bookId);
      setReviews(bookReviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [bookId]);

  return {
    reviews,
    isLoading,
    error,
    refetch: fetchReviews,
  };
};
