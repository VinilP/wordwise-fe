import React from "react";
import { Link } from "react-router-dom";

interface InsufficientDataFallbackProps {
  className?: string;
}

export const InsufficientDataFallback: React.FC<
  InsufficientDataFallbackProps
> = ({ className = "" }) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="max-w-2xl mx-auto">
        {/* Icon */}
        <div className="text-gray-400 mb-6">
          <svg
            className="h-16 w-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Insufficient data icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>

        {/* Main Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          We Need More Data to Personalize Your Recommendations
        </h2>

        <p className="text-lg text-gray-600 mb-6">
          Our AI needs to understand your reading preferences before it can
          suggest books you'll love. You can help by reviewing books or adding
          books to your favorites.
        </p>

        {/* Steps to Get Recommendations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Here's how to get personalized recommendations:
          </h3>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <p className="text-blue-800 font-medium">
                  Read and Review Books
                </p>
                <p className="text-blue-700 text-sm">
                  Start by reading books and leaving reviews with ratings. This
                  helps us understand your preferences.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <p className="text-blue-800 font-medium">
                  Rate Different Genres
                </p>
                <p className="text-blue-700 text-sm">
                  Try books from various genres and rate them. This gives our AI
                  more data to work with.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <p className="text-blue-800 font-medium">
                  Add Books to Favorites
                </p>
                <p className="text-blue-700 text-sm">
                  Mark books you love as favorites to help us understand your
                  taste better.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/books"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Browse Books
          </Link>

          <Link
            to="/profile"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            View Profile
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            <strong>Tip:</strong> We recommend reviewing at least 3-5 books from
            different genres or adding books to your favorites to get the most
            accurate personalized recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};
