import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { bookService, reviewService } from '../../services';
import { useAuth } from '../../contexts/AuthContext';
import FavoriteButton from './FavoriteButton';
import ReviewForm from '../reviews/ReviewForm';
import ReviewList from '../reviews/ReviewList';
import ReviewEditModal from '../reviews/ReviewEditModal';
import { useBookReviews } from '../../hooks/useReviews';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { hasRating, getRatingValue, getReviewCount, generateStarRating } from '../../utils/ratingUtils';

export const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [editingReview, setEditingReview] = useState<any>(null);
  const [isEditingReview, setIsEditingReview] = useState(false);

  const {
    data: book,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['book', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Book ID is required');
      }
      return bookService.getBookById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add timeout for slow-loading images
  useEffect(() => {
    if (book) {
      console.log('📖 Book data updated, setting image URL:', book.coverImageUrl);
      setCurrentImageUrl(book.coverImageUrl);
      setImageLoading(true);
      setImageError(false);
    }
  }, [book]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (imageLoading && book) {
        console.log(`Image loading timeout for book: ${book.title}`);
        setImageLoading(false);
        setImageError(true);
      }
    }, 3000); // 3 second timeout

    return () => clearTimeout(timer);
  }, [imageLoading, book]);

  // Function to try fallback image URLs
  const tryFallbackImage = (originalUrl: string) => {
    console.log('🔄 tryFallbackImage called with:', originalUrl);
    // Try medium size instead of large
    if (originalUrl.includes('-L.jpg')) {
      const mediumUrl = originalUrl.replace('-L.jpg', '-M.jpg');
      console.log('📏 Trying medium size:', mediumUrl);
      setCurrentImageUrl(mediumUrl);
      setImageLoading(true);
      setImageError(false);
    } else if (originalUrl.includes('-M.jpg')) {
      // Try small size
      const smallUrl = originalUrl.replace('-M.jpg', '-S.jpg');
      console.log('📏 Trying small size:', smallUrl);
      setCurrentImageUrl(smallUrl);
      setImageLoading(true);
      setImageError(false);
    } else {
      // No more fallbacks, show placeholder
      console.log('🚫 No more fallback sizes available');
      setImageLoading(false);
      setImageError(true);
    }
  };

  const {
    reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
    refetch: refetchReviews,
  } = useBookReviews(id);

  const handleReviewSubmit = async (reviewData: any) => {
    if (!id) return;
    
    console.log('🚀 Starting review submission...');
    setIsSubmittingReview(true);
    try {
      console.log('Submitting review:', {
        bookId: id,
        rating: reviewData.rating,
        content: reviewData.content,
      });
      
      const review = await reviewService.createReview({
        bookId: id,
        rating: reviewData.rating,
        content: reviewData.content,
      });
      
      console.log('✅ Review created successfully:', review);
      setShowReviewForm(false);
      
      console.log('🔄 Refreshing data...');
      // Refresh data without causing page reload
      await Promise.all([
        refetchReviews(), // Refresh reviews list
        refetch() // Refresh book data to update rating
      ]);
      
      // Invalidate books list queries to ensure updated ratings show on books page
      await queryClient.invalidateQueries({ queryKey: ['books'] });
      console.log('✅ Data refresh completed');
    } catch (error) {
      console.error('❌ Failed to submit review:', error);
      // You could add a toast notification here
      alert(`Failed to submit review: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmittingReview(false);
      console.log('🏁 Review submission process completed');
    }
  };

  const handleEditReview = (review: any) => {
    setEditingReview(review);
  };

  const handleUpdateReview = async (reviewId: string, updateData: any) => {
    setIsEditingReview(true);
    try {
      console.log('🔄 Updating review:', reviewId, updateData);
      await reviewService.updateReview(reviewId, updateData);
      console.log('✅ Review updated successfully');
      
      // Refresh data
      await Promise.all([
        refetchReviews(),
        refetch()
      ]);
      
      // Invalidate books list queries to ensure updated ratings show on books page
      await queryClient.invalidateQueries({ queryKey: ['books'] });
      
      setEditingReview(null);
    } catch (error) {
      console.error('❌ Failed to update review:', error);
      alert(`Failed to update review: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsEditingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      console.log('🗑️ Deleting review:', reviewId);
      await reviewService.deleteReview(reviewId);
      console.log('✅ Review deleted successfully');
      
      // Refresh data
      await Promise.all([
        refetchReviews(),
        refetch()
      ]);
      
      // Invalidate books list queries to ensure updated ratings show on books page
      await queryClient.invalidateQueries({ queryKey: ['books'] });
    } catch (error) {
      console.error('❌ Failed to delete review:', error);
      alert(`Failed to delete review: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const renderStars = (rating: number | null) => {
    if (!hasRating(rating)) {
      return null;
    }

    const starRating = generateStarRating(rating);
    return starRating.map((starType, index) => {
      switch (starType) {
        case 'full':
          return (
            <span key={index} className="text-yellow-400 text-xl">
              ★
            </span>
          );
        case 'half':
          return (
            <span key={index} className="text-yellow-400 text-xl">
              ☆
            </span>
          );
        default:
          return (
            <span key={index} className="text-gray-300 text-xl">
              ☆
            </span>
          );
      }
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
              <div className="aspect-[3/4] bg-gray-300 rounded-lg"></div>
            </div>
            <div className="lg:w-2/3 space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg
              className="h-12 w-12 mx-auto mb-4"
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
            Failed to load book details
          </h3>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'Something went wrong while loading the book.'}
          </p>
          <div className="space-x-4">
            <button
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/books"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Books
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Book not found
          </h3>
          <p className="text-gray-600 mb-4">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/books"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link to="/books" className="hover:text-gray-700">
              Books
            </Link>
          </li>
          <li>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </li>
          <li className="text-gray-900 truncate">{book.title}</li>
        </ol>
      </nav>

      {/* Book details */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Book cover */}
        <div className="lg:w-1/3">
          <div className="sticky top-8">
            <div className="relative aspect-[3/4] max-w-md mx-auto rounded-lg shadow-lg overflow-hidden bg-gray-100">
              {/* Loading skeleton */}
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <LoadingSpinner size="lg" text="Loading cover..." className="text-gray-400" />
                </div>
              )}
              
              {/* Book cover image */}
              <img
                src={currentImageUrl}
                alt={`Cover of ${book.title}`}
                className={`w-full h-full object-cover ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => {
                  console.log('🖼️ Image loaded successfully:', currentImageUrl);
                  setImageLoading(false);
                  setImageError(false);
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.log('❌ Image failed to load:', target.src);
                  // Try fallback images first
                  if (target.src !== '/placeholder-book-cover.jpg') {
                    console.log('🔄 Trying fallback image...');
                    tryFallbackImage(target.src);
                  } else {
                    // No more fallbacks, show placeholder
                    console.log('🚫 No more fallbacks, showing placeholder');
                    setImageLoading(false);
                    setImageError(true);
                  }
                }}
              />
              
              {/* Placeholder for missing images */}
              {imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-500">
                  <svg
                    className="w-16 h-16 mb-4"
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
                  <span className="text-sm text-center px-4">No Cover Available</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Book information */}
        <div className="lg:w-2/3">
          <div className="space-y-6">
            {/* Title and author */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="book-title">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4" data-testid="book-author">
                by {book.author}
              </p>
              
              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {hasRating(book.averageRating) ? (
                    <>
                      <div className="flex mr-2">
                        {renderStars(typeof book.averageRating === 'string' ? parseFloat(book.averageRating) : book.averageRating)}
                      </div>
                      <span className="text-lg font-medium text-gray-900">
                        {getRatingValue(book.averageRating)}
                      </span>
                      <span className="text-gray-600 ml-2">
                        ({getReviewCount(book.reviewCount)} {getReviewCount(book.reviewCount) === 1 ? 'review' : 'reviews'})
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500">No ratings yet</span>
                  )}
                </div>
              </div>
            </div>

            {/* Genres */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {book.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Publication info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Publication Info</h3>
              <p className="text-gray-600">Published in {book.publishedYear}</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {book.description}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
              {isAuthenticated ? (
                <button 
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  data-testid="write-review-button"
                >
                  {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                </button>
              ) : (
                <Link 
                  to="/login"
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Login to Write Review
                </Link>
              )}
              
              {book && (
                <FavoriteButton 
                  book={book} 
                  size="lg" 
                  showText={true}
                  onFavoriteChange={() => {
                    // Optional: Add any callback when favorite status changes
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
        
        {/* Review Form */}
        {showReviewForm && isAuthenticated && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
            <ReviewForm
              bookId={id}
              onSubmit={handleReviewSubmit}
              isLoading={isSubmittingReview}
              onCancel={() => setShowReviewForm(false)}
              showCancel={true}
            />
          </div>
        )}

        {/* Reviews List */}
        {reviewsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading reviews...</p>
          </div>
        ) : reviewsError ? (
          <div className="text-center py-8 text-red-600">
            <p>Failed to load reviews. Please try again.</p>
            <button 
              onClick={() => refetchReviews()}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Retry
            </button>
          </div>
        ) : reviews && reviews.length > 0 ? (
          <ReviewList 
            reviews={reviews} 
            onEditReview={handleEditReview}
            onDeleteReview={handleDeleteReview}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No reviews yet. Be the first to review this book!</p>
          </div>
        )}
      </div>

      {/* Review Edit Modal */}
      <ReviewEditModal
        review={editingReview}
        isOpen={!!editingReview}
        onClose={() => setEditingReview(null)}
        onSubmit={handleUpdateReview}
        isLoading={isEditingReview}
      />
    </div>
  );
};