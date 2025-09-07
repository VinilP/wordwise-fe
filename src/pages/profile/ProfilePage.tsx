import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import UserProfileInfo from "@/components/profile/UserProfileInfo";
import ReviewHistory from "@/components/profile/ReviewHistory";
import FavoritesList from "@/components/profile/FavoritesList";
import type { UserProfile } from "@/types";

type TabType = "profile" | "reviews" | "favorites";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const tabs = [
    {
      id: "profile" as TabType,
      name: "Profile",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
    },
    {
      id: "reviews" as TabType,
      name: "Reviews",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
    {
      id: "favorites" as TabType,
      name: "Favorites",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
  ];

  const handleProfileUpdated = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  const handleFavoriteRemoved = () => {
    // Refresh profile to update favorite count
    if (profile) {
      setProfile((prev) =>
        prev ? { ...prev, favoriteCount: prev.favoriteCount - 1 } : null,
      );
    }
  };

  const handleReviewDeleted = () => {
    // Refresh profile to update review count
    if (profile) {
      setProfile((prev) =>
        prev ? { ...prev, reviewCount: prev.reviewCount - 1 } : null,
      );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in
          </h2>
          <p className="text-gray-600">
            You need to be logged in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <UserProfileInfo onProfileUpdated={handleProfileUpdated} />;
      case "reviews":
        return <ReviewHistory onReviewDeleted={handleReviewDeleted} />;
      case "favorites":
        return <FavoritesList onFavoriteRemoved={handleFavoriteRemoved} />;
      default:
        return <UserProfileInfo onProfileUpdated={handleProfileUpdated} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">
            Manage your profile information, reviews, and favorite books.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                    ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <span
                    className={`
                      mr-2 transition-colors duration-200
                      ${
                        activeTab === tab.id
                          ? "text-blue-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      }
                    `}
                  >
                    {tab.icon}
                  </span>
                  {tab.name}
                  {tab.id === "reviews" && profile && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {profile.reviewCount}
                    </span>
                  )}
                  {tab.id === "favorites" && profile && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {profile.favoriteCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
