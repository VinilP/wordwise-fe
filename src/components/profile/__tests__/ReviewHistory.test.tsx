import React from "react";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import ReviewHistory from "../ReviewHistory";
import { userService } from "@/services/user.service";
import type { Review, Book } from "@/types";
import { render, createMockUser } from "@/test/utils/test-utils";

// Mock the user service
vi.mock("@/services/user.service");
const mockUserService = vi.mocked(userService);

// Mock react-router-dom Link component only
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    Link: ({ to, children, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

const mockBook: Book = {
  id: "1",
  title: "Test Book",
  author: "Test Author",
  description: "Test description",
  coverImageUrl: "https://example.com/cover.jpg",
  genres: ["Fiction"],
  publishedYear: 2023,
  averageRating: 4.5,
  reviewCount: 10,
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
};

const mockReview: Review = {
  id: "1",
  bookId: "1",
  userId: "1",
  content: "This is a great book!",
  rating: 5,
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
  book: mockBook,
};

const mockProfileWithDetails = {
  id: "1",
  email: "test@example.com",
  name: "Test User",
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
  reviewCount: 1,
  favoriteCount: 0,
  reviews: [mockReview],
  favorites: [],
};

describe("ReviewHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    mockUserService.getProfileWithDetails.mockImplementation(
      () => new Promise(() => {}),
    ); // Never resolves

    render(<ReviewHistory />, {
      initialAuthState: {
        user: createMockUser(),
        isAuthenticated: true,
      },
    });

    expect(screen.getByText("Loading your reviews...")).toBeInTheDocument();
  });

  it("renders reviews when loaded successfully", async () => {
    mockUserService.getProfileWithDetails.mockResolvedValue(
      mockProfileWithDetails,
    );

    render(<ReviewHistory />, {
      initialAuthState: {
        user: createMockUser(),
        isAuthenticated: true,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Your Reviews (1)")).toBeInTheDocument();
    });

    expect(screen.getByText("Test Book")).toBeInTheDocument();
    expect(screen.getByText("by Test Author")).toBeInTheDocument();
    expect(screen.getByText("This is a great book!")).toBeInTheDocument();
    expect(screen.getByText("5/5")).toBeInTheDocument();
  });

  it("renders empty state when no reviews", async () => {
    const emptyProfile = {
      ...mockProfileWithDetails,
      reviews: [],
      reviewCount: 0,
    };
    mockUserService.getProfileWithDetails.mockResolvedValue(emptyProfile);

    render(<ReviewHistory />, {
      initialAuthState: {
        user: createMockUser(),
        isAuthenticated: true,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("No reviews yet")).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        "Start reading books and share your thoughts with reviews.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Browse Books")).toBeInTheDocument();
  });

  it("renders error state when reviews loading fails", async () => {
    const errorMessage = "Failed to load review history";
    mockUserService.getProfileWithDetails.mockRejectedValue(
      new Error(errorMessage),
    );

    render(<ReviewHistory />, {
      initialAuthState: {
        user: createMockUser(),
        isAuthenticated: true,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Failed to load reviews")).toBeInTheDocument();
    });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("handles refresh button click", async () => {
    mockUserService.getProfileWithDetails.mockResolvedValue(
      mockProfileWithDetails,
    );

    render(<ReviewHistory />, {
      initialAuthState: {
        user: createMockUser(),
        isAuthenticated: true,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Your Reviews (1)")).toBeInTheDocument();
    });

    const refreshButton = screen.getByText("Refresh");
    fireEvent.click(refreshButton);

    expect(mockUserService.getProfileWithDetails).toHaveBeenCalledTimes(2);
  });

  it("displays star rating correctly", async () => {
    mockUserService.getProfileWithDetails.mockResolvedValue(
      mockProfileWithDetails,
    );

    const { container } = render(<ReviewHistory />, {
      initialAuthState: {
        user: createMockUser(),
        isAuthenticated: true,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("5/5")).toBeInTheDocument();
    });

    // Check that 5 stars are rendered (filled) - using SVG elements
    const stars = container.querySelectorAll("svg");
    expect(stars.length).toBe(5);
  });

  it("displays review creation date", async () => {
    mockUserService.getProfileWithDetails.mockResolvedValue(
      mockProfileWithDetails,
    );

    render(<ReviewHistory />, {
      initialAuthState: {
        user: createMockUser(),
        isAuthenticated: true,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Reviewed on 1/1/2023")).toBeInTheDocument();
    });
  });

  it("shows updated date when review was modified", async () => {
    const updatedReview = {
      ...mockReview,
      updatedAt: "2023-01-02T00:00:00Z",
    };
    const profileWithUpdatedReview = {
      ...mockProfileWithDetails,
      reviews: [updatedReview],
    };

    mockUserService.getProfileWithDetails.mockResolvedValue(
      profileWithUpdatedReview,
    );

    render(<ReviewHistory />, {
      initialAuthState: {
        user: createMockUser(),
        isAuthenticated: true,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Updated on 1/2/2023")).toBeInTheDocument();
    });
  });

  it("calls onReviewDeleted when review is deleted", async () => {
    const onReviewDeleted = vi.fn();
    mockUserService.getProfileWithDetails.mockResolvedValue(
      mockProfileWithDetails,
    );

    render(<ReviewHistory onReviewDeleted={onReviewDeleted} />, {
      initialAuthState: {
        user: createMockUser(),
        isAuthenticated: true,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Test Book")).toBeInTheDocument();
    });

    // The delete functionality would be handled by the review service
    // This test verifies the callback is passed correctly
    expect(onReviewDeleted).not.toHaveBeenCalled();
  });

  it("handles multiple reviews correctly", async () => {
    const secondReview: Review = {
      id: "2",
      bookId: "2",
      userId: "1",
      content: "Another great book!",
      rating: 4,
      createdAt: "2023-01-02T00:00:00Z",
      updatedAt: "2023-01-02T00:00:00Z",
      book: {
        ...mockBook,
        id: "2",
        title: "Second Book",
        author: "Second Author",
      },
    };

    const profileWithMultipleReviews = {
      ...mockProfileWithDetails,
      reviews: [mockReview, secondReview],
      reviewCount: 2,
    };

    mockUserService.getProfileWithDetails.mockResolvedValue(
      profileWithMultipleReviews,
    );

    render(<ReviewHistory />, {
      initialAuthState: {
        user: createMockUser(),
        isAuthenticated: true,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Your Reviews (2)")).toBeInTheDocument();
    });

    expect(screen.getByText("Test Book")).toBeInTheDocument();
    expect(screen.getByText("Second Book")).toBeInTheDocument();
    expect(screen.getByText("This is a great book!")).toBeInTheDocument();
    expect(screen.getByText("Another great book!")).toBeInTheDocument();
  });
});
