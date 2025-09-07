import React, { useState } from "react";

const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index],
    );
  };

  const faqCategories = [
    {
      title: "Getting Started",
      icon: "🚀",
      questions: [
        {
          question: "How do I create an account on WordWise?",
          answer:
            'Creating an account is easy! Click the "Sign Up" button in the top right corner, fill in your name, email, and password, and you\'ll be ready to start discovering great books.',
        },
        {
          question: "Is WordWise free to use?",
          answer:
            "Yes! WordWise is completely free to use. You can browse books, read reviews, rate books, and get personalized recommendations without any cost.",
        },
        {
          question: "How do I find books I'm interested in?",
          answer:
            "You can search for books by title, author, or genre using our search bar. You can also browse by categories, check out trending books, or explore our curated collections.",
        },
        {
          question: "Do I need to download an app?",
          answer:
            "No download required! WordWise is a web-based platform that works on any device with a modern web browser. You can access it from your computer, tablet, or smartphone.",
        },
      ],
    },
    {
      title: "Recommendations",
      icon: "🎯",
      questions: [
        {
          question: "How does the recommendation system work?",
          answer:
            "Our AI-powered recommendation system analyzes your reading history, ratings, and preferences to suggest books you're likely to enjoy. The more you rate and review books, the better our recommendations become.",
        },
        {
          question: "Why am I not getting personalized recommendations?",
          answer:
            "To get personalized recommendations, you need to rate at least 5-10 books. This helps our system understand your preferences and provide better suggestions.",
        },
        {
          question: "Can I get recommendations for specific genres?",
          answer:
            "Yes! You can filter recommendations by genre, and our system will learn your preferences within each genre to provide more targeted suggestions.",
        },
        {
          question: "How often are recommendations updated?",
          answer:
            "Recommendations are updated in real-time as you rate more books. We also refresh our recommendation algorithms regularly to ensure you get the most relevant suggestions.",
        },
      ],
    },
    {
      title: "Reviews & Ratings",
      icon: "⭐",
      questions: [
        {
          question: "How do I rate a book?",
          answer:
            "To rate a book, go to the book's detail page and click on the star rating system. You can rate from 1 to 5 stars, with 5 being the highest rating.",
        },
        {
          question: "Can I edit or delete my reviews?",
          answer:
            "Yes, you can edit or delete your reviews at any time. Go to your profile page, find the review you want to modify, and use the edit or delete options.",
        },
        {
          question: "What makes a good book review?",
          answer:
            "A good review is honest, constructive, and helpful to other readers. Include what you liked or didn't like about the book, who might enjoy it, and avoid spoilers.",
        },
        {
          question: "Can I see who wrote a review?",
          answer:
            "Yes, all reviews show the reviewer's name and profile. You can click on a reviewer's name to see their other reviews and reading preferences.",
        },
      ],
    },
    {
      title: "Account & Profile",
      icon: "👤",
      questions: [
        {
          question: "How do I update my profile information?",
          answer:
            'Go to your profile page and click the "Edit Profile" button. You can update your name, bio, reading preferences, and other information.',
        },
        {
          question: "Can I change my email address?",
          answer:
            "Yes, you can change your email address in your account settings. You'll need to verify the new email address before the change takes effect.",
        },
        {
          question: "How do I delete my account?",
          answer:
            'To delete your account, go to your profile settings and look for the "Delete Account" option. Please note that this action is permanent and cannot be undone.',
        },
        {
          question: "Is my personal information secure?",
          answer:
            "Yes, we take your privacy seriously. Your personal information is encrypted and stored securely. We never share your data with third parties without your consent.",
        },
      ],
    },
    {
      title: "Technical Issues",
      icon: "🔧",
      questions: [
        {
          question: "The website is loading slowly. What should I do?",
          answer:
            "Try refreshing the page or clearing your browser cache. If the problem persists, check your internet connection or try using a different browser.",
        },
        {
          question: "I can't log into my account. What's wrong?",
          answer:
            "Make sure you're using the correct email and password. If you've forgotten your password, use the \"Forgot Password\" link on the login page to reset it.",
        },
        {
          question: "Why can't I see book cover images?",
          answer:
            "Book cover images are loaded from external sources. If images aren't showing, it might be due to slow internet connection or temporary issues with the image servers.",
        },
        {
          question: "The website doesn't work on my mobile device.",
          answer:
            "WordWise is designed to work on all devices. Make sure you're using a modern web browser and have a stable internet connection. Try refreshing the page or clearing your browser cache.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find quick answers to the most common questions about WordWise.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQ..."
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

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <span className="mr-3 text-2xl">{category.icon}</span>
                  {category.title}
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {category.questions.map((item, itemIndex) => {
                  const globalIndex = categoryIndex * 100 + itemIndex;
                  const isOpen = openItems.includes(globalIndex);

                  return (
                    <div key={itemIndex} className="px-6 py-4">
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-2 -m-2"
                      >
                        <h3 className="text-lg font-medium text-gray-900 pr-4">
                          {item.question}
                        </h3>
                        <svg
                          className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {isOpen && (
                        <div className="mt-4 pl-2">
                          <p className="text-gray-600 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="bg-blue-600 rounded-lg p-8 text-center text-white mt-12">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-xl mb-6 opacity-90">
            Our support team is here to help you with any questions or issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Contact Support
            </a>
            <a
              href="/help"
              className="border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              Help Center
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
