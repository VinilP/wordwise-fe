import React from 'react';
import { RecommendationList } from '../../components/recommendations/RecommendationList';
import { RecommendationErrorBoundary } from '../../components/recommendations/RecommendationErrorBoundary';
import { useRecommendations } from '../../hooks';

export const RecommendationsPage: React.FC = () => {
  const {
    recommendations,
    message,
    isLoading,
    isError,
    error,
    isFetching,
    lastUpdated,
    refresh: handleRefresh
  } = useRecommendations();

  return (
    <RecommendationErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AI-Powered Recommendations
              </h1>
              <p className="mt-2 text-gray-600">
                Discover books tailored to your reading preferences using advanced AI analysis.
              </p>
            </div>
            
            {/* Last Updated Info */}
            {lastUpdated && !isLoading && (
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
                {isFetching && (
                  <p className="text-xs text-blue-600 mt-1">
                    Updating...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* AI Processing Info */}
        {isLoading && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  AI is analyzing your preferences
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Our AI is reviewing your reading history and preferences to generate personalized recommendations. This may take a few moments.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Failed to load recommendations
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Content */}
        <RecommendationList
          recommendations={recommendations}
          isLoading={isLoading}
          error={error}
          onRefresh={handleRefresh}
        />

        {/* How It Works Section */}
        {!isLoading && !isError && (
          <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              How Our AI Recommendations Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Analyze Your Reviews</h3>
                <p className="text-sm text-gray-600">
                  We analyze your book reviews, ratings, and reading patterns to understand your preferences.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">AI Processing</h3>
                <p className="text-sm text-gray-600">
                  Advanced AI algorithms process your data to identify patterns and predict books you'll love.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Personalized Results</h3>
                <p className="text-sm text-gray-600">
                  Get book recommendations with explanations and confidence scores tailored just for you.
                </p>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </RecommendationErrorBoundary>
  );
};
