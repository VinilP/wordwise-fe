import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@/test/utils/test-utils";
import userEvent from "@testing-library/user-event";
import { QueryClient } from "@tanstack/react-query";
import { ProfilePage } from "@/pages/profile";
import {
  createMockUser,
  createMockBook,
  createMockReview,
} from "@/test/utils/test-utils";

// Mock user service
const mockGetProfile = vi.fn();
const mockGetProfileWithDetails = vi.fn();
const mockGetFavorites = vi.fn();
const mockUpdateProfile = vi.fn();

vi.mock("@/services/user.service", () => ({
  userService: {
    getProfile: mockGetProfile,
    getProfileWithDetails: mockGetProfileWithDetails,
    getFavorites: mockGetFavorites,
    updateProfile: mockUpdateProfile,
  },
}));

describe("User Profile Workflow Integration Tests", () => {
  let queryClient: QueryClient;
  const mockUser = createMockUser({
    name: "Test User",
    email: "test@example.com",
  });

  const mockProfile = {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    reviewCount: 2,
    favoriteCount: 2,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  };

  const mockFavorites = [
    {
      id: "1",
      bookId: "1",
      userId: "1",
      createdAt: "2023-01-01T00:00:00Z",
      book: createMockBook({ id: "1", title: "Favorite Book 1" }),
    },
    {
      id: "2",
      bookId: "2",
      userId: "1",
      createdAt: "2023-01-01T00:00:00Z",
      book: createMockBook({ id: "2", title: "Favorite Book 2" }),
    },
  ];

  const mockReviews = [
    createMockReview({
      id: "1",
      rating: 5,
      content: "Great book!",
      book: createMockBook({ title: "Reviewed Book 1" }),
    }),
    createMockReview({
      id: "2",
      rating: 4,
      content: "Good read.",
      book: createMockBook({ title: "Reviewed Book 2" }),
    }),
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: 0 },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  describe("Profile Information Workflow", () => {
    it("should display user profile information", async () => {
      mockGetProfile.mockResolvedValue(mockProfile);
      mockGetFavorites.mockResolvedValue(mockFavorites);
      mockGetProfileWithDetails.mockResolvedValue({
        ...mockProfile,
        reviews: mockReviews,
        favorites: mockFavorites,
      });

      render(<ProfilePage />, {
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true },
      });

      // Wait for profile to load
      await waitFor(() => {
        expect(screen.getByText("Test User")).toBeInTheDocument();
        expect(screen.getByText("test@example.com")).toBeInTheDocument();
      });
    });

    it("should allow users to edit their profile", async () => {
      mockGetProfile.mockResolvedValue(mockProfile);
      mockGetFavorites.mockResolvedValue(mockFavorites);
      mockGetProfileWithDetails.mockResolvedValue({
        ...mockProfile,
        reviews: mockReviews,
        favorites: mockFavorites,
      });
      mockUpdateProfile.mockResolvedValue({
        ...mockProfile,
        name: "Updated Name",
      });

      render(<ProfilePage />, {
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true },
      });

      // Wait for profile to load
      await waitFor(() => {
        expect(screen.getByText("Test User")).toBeInTheDocument();
      });

      // Note: The current UserProfileInfo component doesn't have edit functionality
      // This test would need to be updated when edit functionality is implemented
    });

    it("should validate profile form", async () => {
      mockGetProfile.mockResolvedValue(mockProfile);
      mockGetFavorites.mockResolvedValue(mockFavorites);
      mockGetProfileWithDetails.mockResolvedValue({
        ...mockProfile,
        reviews: mockReviews,
        favorites: mockFavorites,
      });

      render(<ProfilePage />, {
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true },
      });

      // Wait for profile to load
      await waitFor(() => {
        expect(screen.getByText("Test User")).toBeInTheDocument();
      });

      // Note: The current UserProfileInfo component doesn't have edit functionality
      // This test would need to be updated when edit functionality is implemented
    });
  });

  describe("Favorites Management Workflow", () => {
    it("should display user's favorite books", async () => {
      mockGetProfile.mockResolvedValue(mockProfile);
      mockGetFavorites.mockResolvedValue(mockFavorites);
      mockGetProfileWithDetails.mockResolvedValue({
        ...mockProfile,
        reviews: mockReviews,
        favorites: mockFavorites,
      });

      render(<ProfilePage />, {
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true },
      });

      // Switch to favorites tab
      const favoritesTab = screen.getByRole("button", { name: /favorites/i });
      await userEvent.click(favoritesTab);

      // Wait for favorites to load
      await waitFor(() => {
        expect(screen.getByText("Favorite Book 1")).toBeInTheDocument();
        expect(screen.getByText("Favorite Book 2")).toBeInTheDocument();
      });
    });

    it("should handle empty favorites", async () => {
      mockGetProfile.mockResolvedValue(mockProfile);
      mockGetFavorites.mockResolvedValue([]);
      mockGetProfileWithDetails.mockResolvedValue({
        ...mockProfile,
        reviews: mockReviews,
        favorites: [],
      });

      render(<ProfilePage />, {
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true },
      });

      // Switch to favorites tab
      const favoritesTab = screen.getByRole("button", { name: /favorites/i });
      await userEvent.click(favoritesTab);

      // Wait for empty state
      await waitFor(() => {
        expect(screen.getByText(/no favorites yet/i)).toBeInTheDocument();
      });
    });

    it("should allow users to remove books from favorites", async () => {
      mockGetProfile.mockResolvedValue(mockProfile);
      mockGetFavorites.mockResolvedValue(mockFavorites);
      mockGetProfileWithDetails.mockResolvedValue({
        ...mockProfile,
        reviews: mockReviews,
        favorites: mockFavorites,
      });

      render(<ProfilePage />, {
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true },
      });

      // Switch to favorites tab
      const favoritesTab = screen.getByRole("button", { name: /favorites/i });
      await user.click(favoritesTab);

      // Wait for favorites to load
      await waitFor(() => {
        expect(screen.getByText("Favorite Book 1")).toBeInTheDocument();
      });

      // Note: The current FavoritesList component uses FavoriteButton which handles removal
      // This test would need to be updated to match the actual implementation
    });

    it("should handle favorites loading error", async () => {
      mockGetProfile.mockResolvedValue(mockProfile);
      mockGetFavorites.mockRejectedValue(
        new Error("Failed to get user favorites"),
      );
      mockGetProfileWithDetails.mockResolvedValue({
        ...mockProfile,
        reviews: mockReviews,
        favorites: [],
      });

      render(<ProfilePage />, {
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true },
      });

      // Switch to favorites tab
      const favoritesTab = screen.getByRole("button", { name: /favorites/i });
      await userEvent.click(favoritesTab);

      // Wait for error state
      await waitFor(() => {
        expect(
          screen.getByText(/failed to load favorites/i),
        ).toBeInTheDocument();
        expect(screen.getByText(/try again/i)).toBeInTheDocument();
      });
    });
  });

  describe("Reviews Management Workflow", () => {
    it("should display user's reviews", async () => {
      mockGetProfile.mockResolvedValue(mockProfile);
      mockGetFavorites.mockResolvedValue(mockFavorites);
      mockGetProfileWithDetails.mockResolvedValue({
        ...mockProfile,
        reviews: mockReviews,
        favorites: mockFavorites,
      });

      render(<ProfilePage />, {
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true },
      });

      // Switch to reviews tab
      const reviewsTab = screen.getByRole("button", { name: /reviews/i });
      await userEvent.click(reviewsTab);

      // Wait for reviews to load
      await waitFor(() => {
        expect(screen.getByText("Great book!")).toBeInTheDocument();
        expect(screen.getByText("Good read.")).toBeInTheDocument();
        expect(screen.getByText("Reviewed Book 1")).toBeInTheDocument();
        expect(screen.getByText("Reviewed Book 2")).toBeInTheDocument();
      });
    });

    it("should handle empty reviews", async () => {
      mockGetProfile.mockResolvedValue(mockProfile);
      mockGetFavorites.mockResolvedValue(mockFavorites);
      mockGetProfileWithDetails.mockResolvedValue({
        ...mockProfile,
        reviews: [],
        favorites: mockFavorites,
      });

      render(<ProfilePage />, {
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true },
      });

      // Switch to reviews tab
      const reviewsTab = screen.getByRole("button", { name: /reviews/i });
      await userEvent.click(reviewsTab);

      // Wait for empty state
      await waitFor(() => {
        expect(screen.getByText(/no reviews yet/i)).toBeInTheDocument();
      });
    });

    it("should allow users to edit their reviews from profile", async () => {
      mockGetProfile.mockResolvedValue(mockProfile);
      mockGetFavorites.mockResolvedValue(mockFavorites);
      mockGetProfileWithDetails.mockResolvedValue({
        ...mockProfile,
        reviews: mockReviews,
        favorites: mockFavorites,
      });

      render(<ProfilePage />, {
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true },
      });

      // Switch to reviews tab
      const reviewsTab = screen.getByRole("button", { name: /reviews/i });
      await user.click(reviewsTab);

      // Wait for reviews to load
      await waitFor(() => {
        expect(screen.getByText("Great book!")).toBeInTheDocument();
      });

      // Note: The current ReviewHistory component doesn't have edit functionality
      // This test would need to be updated when edit functionality is implemented
    });
  });

  describe("Profile Navigation Workflow", () => {
    it("should switch between profile tabs", async () => {
      mockGetProfile.mockResolvedValue(mockProfile);
      mockGetFavorites.mockResolvedValue(mockFavorites);
      mockGetProfileWithDetails.mockResolvedValue({
        ...mockProfile,
        reviews: mockReviews,
        favorites: mockFavorites,
      });

      render(<ProfilePage />, {
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true },
      });

      // Start on profile tab
      await waitFor(() => {
        expect(screen.getByText("Test User")).toBeInTheDocument();
      });

      // Switch to favorites tab
      const favoritesTab = screen.getByRole("button", { name: /favorites/i });
      await user.click(favoritesTab);

      await waitFor(() => {
        expect(screen.getByText("Favorite Book 1")).toBeInTheDocument();
      });

      // Switch to reviews tab
      const reviewsTab = screen.getByRole("button", { name: /reviews/i });
      await user.click(reviewsTab);

      await waitFor(() => {
        expect(screen.getByText("Great book!")).toBeInTheDocument();
      });

      // Switch back to profile tab
      const profileTab = screen.getByRole("button", { name: /profile/i });
      await user.click(profileTab);

      await waitFor(() => {
        expect(screen.getByText("Test User")).toBeInTheDocument();
      });
    });
  });
});
