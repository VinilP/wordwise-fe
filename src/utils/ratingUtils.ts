/**
 * Utility functions for handling book ratings
 */

export interface RatingDisplayOptions {
  showValue?: boolean;
  showCount?: boolean;
  fallbackText?: string;
}

/**
 * Get formatted rating value with proper null handling
 */
export const getRatingValue = (rating: number | string | null | undefined): string => {
  if (rating === null || rating === undefined) {
    return '0.0';
  }
  
  // Convert string to number if needed
  const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;
  
  if (isNaN(numericRating) || typeof numericRating !== 'number') {
    return '0.0';
  }
  
  return numericRating.toFixed(1);
};

/**
 * Check if a book has any ratings
 */
export const hasRating = (rating: number | string | null | undefined): boolean => {
  if (rating === null || rating === undefined) {
    return false;
  }
  
  // Convert string to number if needed
  const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;
  
  return typeof numericRating === 'number' && !isNaN(numericRating) && numericRating > 0;
};

/**
 * Get rating display text with count
 */
export const getRatingDisplayText = (
  rating: number | null | undefined,
  reviewCount: number | null | undefined,
  options: RatingDisplayOptions = {}
): string => {
  const { showValue = true, showCount = true, fallbackText = 'No ratings yet' } = options;
  
  if (!hasRating(rating)) {
    return fallbackText;
  }
  
  let text = '';
  if (showValue) {
    text += getRatingValue(rating);
  }
  
  if (showCount && reviewCount !== null && reviewCount !== undefined) {
    const countText = reviewCount === 1 ? 'review' : 'reviews';
    text += showValue ? ` (${reviewCount} ${countText})` : `${reviewCount} ${countText}`;
  }
  
  return text;
};

/**
 * Get safe review count
 */
export const getReviewCount = (count: number | null | undefined): number => {
  return count || 0;
};

/**
 * Generate star rating array for display
 */
export const generateStarRating = (rating: number | string | null | undefined, maxStars: number = 5): Array<'full' | 'half' | 'empty'> => {
  if (!hasRating(rating)) {
    return Array(maxStars).fill('empty');
  }
  
  const stars: Array<'full' | 'half' | 'empty'> = [];
  // Convert string to number if needed
  const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;
  const safeRating = numericRating as number; // We know it's a number from hasRating check
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 !== 0;
  
  for (let i = 0; i < maxStars; i++) {
    if (i < fullStars) {
      stars.push('full');
    } else if (i === fullStars && hasHalfStar) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }
  
  return stars;
};
