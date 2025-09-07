import React from "react";
import { RecommendationCard } from "./RecommendationCard";
import { InsufficientDataFallback } from "./InsufficientDataFallback";
import type { Recommendation } from "@/types";

interface RecommendationListProps {
  recommendations: Recommendation[];
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  className?: string;
}

export const RecommendationList: React.FC<RecommendationListProps> = ({
  recommendations,
  isLoading = false,
  error = null,
  onRefresh,
  className = "",
}) => {
  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
            >
              <div className="aspect-[3/4] bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded mb-3 w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <div className="inline-flex items-center space-x-2 text-blue-600">
            <svg
              className="animate-spin h-5 w-5"
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
            <span className="text-sm font-medium">
              AI is analyzing your preferences...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
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
            Failed to load recommendations
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return <InsufficientDataFallback className={className} />;
  }

  return (
    <div className={className}>
      {/* Recommendations Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Recommended for You
          </h2>
          <p className="text-gray-600 mt-1">
            {recommendations.length} personalized recommendation
            {recommendations.length !== 1 ? "s" : ""} based on your reading
            history
          </p>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Refresh</span>
          </button>
        )}
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recommendations
          .filter(
            (recommendation) =>
              recommendation && recommendation.book && recommendation.book.id,
          )
          .map((recommendation, index) => (
            <RecommendationCard
              key={`${recommendation.book.id}-${index}`}
              recommendation={recommendation}
              className="transform hover:scale-105 transition-transform duration-200"
              data-testid="recommendation-card"
            />
          ))}
      </div>

      {/* Recommendations Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Recommendations are updated based on your reading activity and
          preferences.
        </p>
      </div>
    </div>
  );
};
