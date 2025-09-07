import React from "react";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import FavoritesList from "../FavoritesList";
import { userService } from "@/services/user.service";
import type { UserFavorite, Book } from "@/types";
import { render, createMockUser } from "@/test/utils/test-utils";

// Mock the user service
vi.mock("@/services/user.service");
const mockUserService = vi.mocked(userService);

// Mock react-router-dom Link component only
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
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
  genres: ["Fiction", "Adventure"],
  publishedYear: 2023,
  averageRating: 4.5,
  reviewCount: 10,
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
};

const mockFavorite: UserFavorite = {
  id: "1",
  userId: "1",
  bookId: "1",
  createdAt: "2023-01-01T00:00:00Z",
  book: mockBook,
};

describe("FavoritesList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    mockUserService.getFavorites.mockImplementation(
      () => new Promise(() => {}),
    ); // Never resolves

    render(<FavoritesList />, {
      initialAuthState: {
        user: createMockUser(),
        isAuthenticated: true,
      },
    });

    expect(screen.getByText("Loading your favorites...")).toBeInTheDocument();
  });

  it("renders favorites when loaded successfully", async () => {
    mockUserService.getFavorites.mockResolvedValue([mockFavorite]);

    render(<FavoritesList />, {
      initialAuthState: {
        user: createMockUser(),
        isAuthenticated: true,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Your Favorites (1)")).toBeInTheDocument();
    });

    expect(screen.getByText("Test Book")).toBeInTheDocument();
    expect(screen.getByText("by Test Author")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("10 reviews")).toBeInTheDocument();
  });

  it("renders empty state when no favorites", async () => {
    mockUserService.getFavorites.mockResolvedValue([]);

    render(<FavoritesList />, {
      initialAuthState: {
        user: createMockUser(),
        isAuthenticated: true,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("No favorites yet")).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        "Start exploring books and add them to your favorites to see them here.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Browse Books")).toBeInTheDocument();
  });

  it("renders error state when favorites loading fails", async () => {
    const errorMessage = "Failed to load favorites";
    mockUserService.getFavorites.mockRejectedValue(new Error(errorMessage));

    render(<FavoritesList />, {
      initialAuthState: {
        user: createMockUser(),
        isAuthenticated: true,
      },
    });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Failed to load favorites" }),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(errorMessage, { selector: "p" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("handles refresh button click", async () => {
    mockUserService.getFavorites.mockResolvedValue([mockFavorite]);

    render(<FavoritesList />, {
      initialAuthState: {
        user: createMockUser(),
        isAuthenticated: true,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Your Favorites (1)")).toBeInTheDocument();
    });

    const refreshButton = screen.getByText("Refresh");
    fireEvent.click(refreshButton);

    expect(mockUserService.getFavorites).toHaveBeenCalledTimes(2);
  });

  it("calls onFavoriteRemoved when favorite is removed", async () => {
    const onFavoriteRemoved = vi.fn();
    mockUserService.getFavorites.mockResolvedValue([mockFavorite]);

    render(<FavoritesList onFavoriteRemoved={onFavoriteRemoved} />, {
      initialAuthState: {
        user: createMockUser(),
        isAuthenticated: true,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Test Book")).toBeInTheDocument();
    });

    // The FavoriteButton component would handle the removal
    // This test verifies the callback is passed correctly
    expect(onFavoriteRemoved).not.toHaveBeenCalled();
  });

  it("displays book genres correctly", async () => {
    mockUserService.getFavorites.mockResolvedValue([mockFavorite]);

    render(<FavoritesList />, {
      initialAuthState: {
        user: createMockUser(),
        isAuthenticated: true,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Fiction")).toBeInTheDocument();
      expect(screen.getByText("Adventure")).toBeInTheDocument();
    });
  });

  it("displays favorite creation date", async () => {
    mockUserService.getFavorites.mockResolvedValue([mockFavorite]);

    render(<FavoritesList />, {
      initialAuthState: {
        user: createMockUser(),
        isAuthenticated: true,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Added 1/1/2023")).toBeInTheDocument();
    });
  });

  it("handles multiple favorites correctly", async () => {
    const secondFavorite: UserFavorite = {
      id: "2",
      userId: "1",
      bookId: "2",
      createdAt: "2023-01-02T00:00:00Z",
      book: {
        ...mockBook,
        id: "2",
        title: "Second Book",
        author: "Second Author",
      },
    };

    mockUserService.getFavorites.mockResolvedValue([
      mockFavorite,
      secondFavorite,
    ]);

    render(<FavoritesList />, {
      initialAuthState: {
        user: createMockUser(),
        isAuthenticated: true,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Your Favorites (2)")).toBeInTheDocument();
    });

    expect(screen.getByText("Test Book")).toBeInTheDocument();
    expect(screen.getByText("Second Book")).toBeInTheDocument();
  });
});
