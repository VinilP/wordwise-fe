import React, { useState } from "react";

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Topics", icon: "📚" },
    { id: "getting-started", name: "Getting Started", icon: "🚀" },
    { id: "account", name: "Account & Profile", icon: "👤" },
    { id: "recommendations", name: "Recommendations", icon: "🎯" },
    { id: "reviews", name: "Reviews & Ratings", icon: "⭐" },
    { id: "technical", name: "Technical Issues", icon: "🔧" },
    { id: "billing", name: "Billing & Subscription", icon: "💳" },
  ];

  const helpArticles = [
    {
      id: 1,
      title: "How to create an account",
      category: "getting-started",
      content:
        "Learn how to sign up for WordWise and start your reading journey.",
      tags: ["account", "signup", "registration"],
    },
    {
      id: 2,
      title: "How to rate and review books",
      category: "reviews",
      content: "Discover how to share your thoughts on books you've read.",
      tags: ["reviews", "ratings", "books"],
    },
    {
      id: 3,
      title: "Understanding personalized recommendations",
      category: "recommendations",
      content: "Learn how our AI-powered recommendation system works.",
      tags: ["recommendations", "AI", "personalization"],
    },
    {
      id: 4,
      title: "Managing your reading list",
      category: "account",
      content: "Organize your books with reading lists and favorites.",
      tags: ["reading-list", "favorites", "organization"],
    },
    {
      id: 5,
      title: "Troubleshooting login issues",
      category: "technical",
      content: "Common solutions for login and authentication problems.",
      tags: ["login", "password", "authentication"],
    },
    {
      id: 6,
      title: "Privacy and data security",
      category: "account",
      content: "Learn how we protect your personal information.",
      tags: ["privacy", "security", "data"],
    },
    {
      id: 7,
      title: "Finding books by genre",
      category: "getting-started",
      content: "Explore books by genre and discover new categories.",
      tags: ["genres", "search", "discovery"],
    },
    {
      id: 8,
      title: "Updating your profile information",
      category: "account",
      content: "Keep your profile up to date with current information.",
      tags: ["profile", "settings", "update"],
    },
  ];

  const filteredArticles = helpArticles.filter((article) => {
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesCategory && matchesSearch;
  });

  const popularTopics = [
    { title: "How to get book recommendations?", views: 1250 },
    { title: "Can I change my book ratings?", views: 980 },
    { title: "How to delete my account?", views: 750 },
    { title: "Why can't I see my reviews?", views: 620 },
    { title: "How to contact support?", views: 580 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find answers to common questions and learn how to make the most of
            WordWise.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Browse by Category
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 ${
                      selectedCategory === category.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Popular Topics */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Popular Topics
              </h3>
              <div className="space-y-3">
                {popularTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <span className="text-gray-700">{topic.title}</span>
                    <span className="text-sm text-gray-500">
                      {topic.views} views
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Help Articles */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Help Articles
                {selectedCategory !== "all" && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({filteredArticles.length} articles)
                  </span>
                )}
              </h3>

              {filteredArticles.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-gray-500">
                    No articles found matching your search.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        {article.title}
                      </h4>
                      <p className="text-gray-600 mb-3">{article.content}</p>
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Support */}
            <div className="bg-blue-50 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Still need help?
              </h3>
              <p className="text-gray-600 mb-4">
                Can't find what you're looking for? Our support team is here to
                help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 text-center"
                >
                  Contact Support
                </a>
                <a
                  href="/faq"
                  className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-600 hover:text-white transition-colors duration-200 text-center"
                >
                  View FAQ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
