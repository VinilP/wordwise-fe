import React, { useState } from "react";
import { RecommendationList } from "@/components/recommendations/RecommendationList";
import { RecommendationErrorBoundary } from "@/components/recommendations/RecommendationErrorBoundary";
import { useRecommendations } from "@/hooks/useRecommendations";
import { usePopularBooks } from "@/hooks/usePopularBooks";
import { BookCard } from "@/components/books/BookCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { RefreshCw, Sparkles, TrendingUp } from "lucide-react";

type TabType = "ai" | "popular";

export const TabbedRecommendationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("ai");

  const {
    recommendations: aiRecommendations,
    isLoading: aiLoading,
    isError: aiError,
    error: aiErrorDetails,
    refetch: refetchAI,
    isFetching: aiFetching,
  } = useRecommendations();

  const {
    popularBooks,
    isLoading: popularLoading,
    isError: popularError,
    error: popularErrorDetails,
    refetch: refetchPopular,
    isFetching: popularFetching,
  } = usePopularBooks();

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleRefresh = () => {
    if (activeTab === "ai") {
      refetchAI();
    } else {
      refetchPopular();
    }
  };

  const isRefreshing = activeTab === "ai" ? aiFetching : popularFetching;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book Recommendations
          </h1>
          <p className="text-gray-600">
            Discover your next favorite book with personalized recommendations
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabChange("ai")}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === "ai"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Recommendations</span>
              </button>
              <button
                onClick={() => handleTabChange("popular")}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === "popular"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Popular Books</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === "ai" ? (
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
                  Personalized AI Recommendations
                </h2>
                <p className="text-gray-600">
                  Recommendations based on your reading history, reviews, and
                  favorite books
                </p>
              </div>

              <RecommendationErrorBoundary>
                {aiLoading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : aiError ? (
                  <div className="text-center py-12">
                    <div className="text-red-600 mb-4">
                      <p className="text-lg font-medium">
                        Failed to load recommendations
                      </p>
                      <p className="text-sm">
                        {aiErrorDetails?.message || "An error occurred"}
                      </p>
                    </div>
                    <button
                      onClick={() => refetchAI()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <RecommendationList recommendations={aiRecommendations} />
                )}
              </RecommendationErrorBoundary>
            </div>
          ) : (
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Popular & Top-Rated Books
                </h2>
                <p className="text-gray-600">
                  Discover the most popular and highly-rated books in our
                  community
                </p>
              </div>

              {popularLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : popularError ? (
                <div className="text-center py-12">
                  <div className="text-red-600 mb-4">
                    <p className="text-lg font-medium">
                      Failed to load popular books
                    </p>
                    <p className="text-sm">
                      {popularErrorDetails?.message || "An error occurred"}
                    </p>
                  </div>
                  <button
                    onClick={() => refetchPopular()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {popularBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      data-testid="recommendation-card"
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
