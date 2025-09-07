import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import UserProfileInfo from "../UserProfileInfo";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/user.service";
import type { User, UserProfile } from "@/types";

// Mock the auth context
vi.mock("@/contexts/AuthContext");
const mockUseAuth = vi.mocked(useAuth);

// Mock the user service
vi.mock("@/services/user.service");
const mockUserService = vi.mocked(userService);

const mockUser: User = {
  id: "1",
  email: "test@example.com",
  name: "Test User",
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
};

const mockProfile: UserProfile = {
  id: "1",
  email: "test@example.com",
  name: "Test User",
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
  reviewCount: 5,
  favoriteCount: 10,
};

describe("UserProfileInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      token: "mock-token",
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      isAuthenticated: true,
    });
  });

  it("renders loading state initially", () => {
    mockUserService.getProfile.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<UserProfileInfo />);

    expect(screen.getByText("Loading profile...")).toBeInTheDocument();
  });

  it("renders profile information when loaded successfully", async () => {
    mockUserService.getProfile.mockResolvedValue(mockProfile);

    render(<UserProfileInfo />);

    await waitFor(() => {
      expect(screen.getByText("Profile Information")).toBeInTheDocument();
    });

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    // Use getAllByText since the counts appear in multiple places
    expect(screen.getAllByText("5")).toHaveLength(2); // review count appears twice
    expect(screen.getAllByText("10")).toHaveLength(2); // favorite count appears twice
  });

  it("renders error state when profile loading fails", async () => {
    const errorMessage = "Failed to load profile";
    mockUserService.getProfile.mockRejectedValue(new Error(errorMessage));

    render(<UserProfileInfo />);

    await waitFor(() => {
      // The error message appears in both h3 and p elements
      expect(screen.getAllByText("Failed to load profile")).toHaveLength(2);
    });

    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("calls onProfileUpdated when profile is loaded", async () => {
    const onProfileUpdated = vi.fn();
    mockUserService.getProfile.mockResolvedValue(mockProfile);

    render(<UserProfileInfo onProfileUpdated={onProfileUpdated} />);

    await waitFor(() => {
      expect(onProfileUpdated).toHaveBeenCalledWith(mockProfile);
    });
  });

  it("handles refresh button click", async () => {
    mockUserService.getProfile.mockResolvedValue(mockProfile);

    render(<UserProfileInfo />);

    await waitFor(() => {
      expect(screen.getByText("Profile Information")).toBeInTheDocument();
    });

    const refreshButton = screen.getByText("Refresh");
    refreshButton.click();

    expect(mockUserService.getProfile).toHaveBeenCalledTimes(2);
  });

  it("formats dates correctly", async () => {
    mockUserService.getProfile.mockResolvedValue(mockProfile);

    render(<UserProfileInfo />);

    await waitFor(() => {
      // The date appears twice (Member Since and Last Updated)
      expect(screen.getAllByText("January 1, 2023")).toHaveLength(2);
    });
  });

  it("displays activity summary correctly", async () => {
    mockUserService.getProfile.mockResolvedValue(mockProfile);

    render(<UserProfileInfo />);

    await waitFor(() => {
      // Use getAllByText since "Reviews Written" appears in both the summary and stats cards
      expect(screen.getAllByText("Reviews Written")).toHaveLength(2);
      expect(screen.getAllByText("Books Favorited")).toHaveLength(2);
    });

    // Check that the counts are displayed in the stats cards
    const reviewCountElements = screen.getAllByText("5");
    const favoriteCountElements = screen.getAllByText("10");

    expect(reviewCountElements.length).toBeGreaterThan(0);
    expect(favoriteCountElements.length).toBeGreaterThan(0);
  });
});
