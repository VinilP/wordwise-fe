import React from 'react';
import { Link } from 'react-router-dom';
import type { Recommendation } from '@/types';
import { hasRating, getRatingValue, getReviewCount, generateStarRating } from '../../utils/ratingUtils';

interface RecommendationCardProps {
  recommendation: Recommendation;
  className?: string;
  'data-testid'?: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation, 
  className = '',
  ...props
}) => {
  const { book, reason, confidence } = recommendation;

  const renderStars = (rating: number | null) => {
    if (!hasRating(rating)) {
      return (
        <span className="text-gray-400 text-sm">No ratings yet</span>
      );
    }

    const starRating = generateStarRating(rating);
    return starRating.map((starType, index) => {
      switch (starType) {
        case 'full':
          return (
            <span key={index} className="text-yellow-400">
              ★
            </span>
          );
        case 'half':
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 border-l-4 border-blue-500 ${className}`} data-testid={props['data-testid']}>
      <Link to={`/books/${book.id}`} className="block">
        <div className="aspect-[3/4] overflow-hidden relative">
          <img
            src={book.coverImageUrl}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-book-cover.jpg';
            }}
          />
          
          {/* Confidence Badge */}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(confidence)}`}>
              {getConfidenceLabel(confidence)} Match
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
            {book.title}
          </h3>
          
          <p className="text-gray-600 mb-2 line-clamp-1">
            by {book.author}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              <div className="flex">
                {hasRating(book.averageRating) ? (
                  renderStars(book.averageRating)
                ) : (
                  <span className="text-gray-400 text-sm">No ratings yet</span>
                )}
              </div>
              {hasRating(book.averageRating) && (
                <span className="text-sm text-gray-600 ml-1">
                  ({getReviewCount(book.reviewCount)})
                </span>
              )}
            </div>
            
            {hasRating(book.averageRating) && (
              <span className="text-sm font-medium text-gray-700">
                {getRatingValue(book.averageRating)}
              </span>
            )}
          </div>
          
          <div className="mb-3 flex flex-wrap gap-1">
            {book.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {genre}
              </span>
            ))}
            {book.genres.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{book.genres.length - 2}
              </span>
            )}
          </div>

          {/* AI Recommendation Reason */}
          <div className="border-t pt-3">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0">
                <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {reason}
                </p>
              </div>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-500">Confidence Score</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    confidence >= 0.8 ? 'bg-green-500' : 
                    confidence >= 0.6 ? 'bg-yellow-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${confidence * 100}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium text-gray-600">
                {Math.round(confidence * 100)}%
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
