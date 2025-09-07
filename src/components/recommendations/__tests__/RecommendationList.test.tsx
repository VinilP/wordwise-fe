import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { RecommendationList } from "../RecommendationList";
import type { Recommendation } from "@/types";

const mockBook = {
  id: "1",
  title: "Test Book Title",
  author: "Test Author",
  description: "Test description",
  coverImageUrl: "https://example.com/cover.jpg",
  genres: ["Fiction", "Mystery"],
  publishedYear: 2023,
  averageRating: 4.2,
  reviewCount: 15,
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
};

const mockRecommendations: Recommendation[] = [
  {
    book: mockBook,
    reason: "Based on your love for mystery novels.",
    confidence: 0.85,
  },
  {
    book: { ...mockBook, id: "2", title: "Another Book" },
    reason: "Similar to books you enjoyed.",
    confidence: 0.75,
  },
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("RecommendationList", () => {
  it("renders recommendations correctly", () => {
    renderWithRouter(
      <RecommendationList
        recommendations={mockRecommendations}
        isLoading={false}
        error={null}
      />,
    );

    expect(screen.getByText("Recommended for You")).toBeInTheDocument();
    expect(
      screen.getByText(
        "2 personalized recommendations based on your reading history",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Test Book Title")).toBeInTheDocument();
    expect(screen.getByText("Another Book")).toBeInTheDocument();
  });

  it("displays loading state correctly", () => {
    renderWithRouter(
      <RecommendationList recommendations={[]} isLoading={true} error={null} />,
    );

    expect(
      screen.getByText("AI is analyzing your preferences..."),
    ).toBeInTheDocument();
    // Check for loading skeleton elements by their classes
    const skeletonElements = document.querySelectorAll(".animate-pulse");
    expect(skeletonElements).toHaveLength(8);
  });

  it("displays error state correctly", () => {
    const mockOnRefresh = vi.fn();
    renderWithRouter(
      <RecommendationList
        recommendations={[]}
        isLoading={false}
        error="Failed to load recommendations"
        onRefresh={mockOnRefresh}
      />,
    );

    // The error message appears in both h3 and p elements
    expect(screen.getAllByText("Failed to load recommendations")).toHaveLength(
      2,
    );
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("calls onRefresh when refresh button is clicked", () => {
    const mockOnRefresh = vi.fn();
    renderWithRouter(
      <RecommendationList
        recommendations={mockRecommendations}
        isLoading={false}
        error={null}
        onRefresh={mockOnRefresh}
      />,
    );

    const refreshButton = screen.getByText("Refresh");
    fireEvent.click(refreshButton);

    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });

  it("calls onRefresh when try again button is clicked in error state", () => {
    const mockOnRefresh = vi.fn();
    renderWithRouter(
      <RecommendationList
        recommendations={[]}
        isLoading={false}
        error="Test error"
        onRefresh={mockOnRefresh}
      />,
    );

    const tryAgainButton = screen.getByText("Try Again");
    fireEvent.click(tryAgainButton);

    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });

  it("displays insufficient data fallback when no recommendations", () => {
    renderWithRouter(
      <RecommendationList
        recommendations={[]}
        isLoading={false}
        error={null}
      />,
    );

    expect(
      screen.getByText("We Need More Data to Personalize Your Recommendations"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Here's how to get personalized recommendations:"),
    ).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    const { container } = renderWithRouter(
      <RecommendationList
        recommendations={mockRecommendations}
        isLoading={false}
        error={null}
        className="custom-class"
      />,
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("displays correct number of recommendations in header", () => {
    renderWithRouter(
      <RecommendationList
        recommendations={mockRecommendations}
        isLoading={false}
        error={null}
      />,
    );

    // Check the header text more specifically
    const headerText = screen.getByText((content, element) => {
      return (
        element?.textContent ===
        "2 personalized recommendations based on your reading history"
      );
    });
    expect(headerText).toBeInTheDocument();
  });

  it("displays singular form for single recommendation", () => {
    const singleRecommendation = [mockRecommendations[0]];
    renderWithRouter(
      <RecommendationList
        recommendations={singleRecommendation}
        isLoading={false}
        error={null}
      />,
    );

    // Check the header text more specifically
    const headerText = screen.getByText((content, element) => {
      return (
        element?.textContent ===
        "1 personalized recommendation based on your reading history"
      );
    });
    expect(headerText).toBeInTheDocument();
  });

  it("displays footer message", () => {
    renderWithRouter(
      <RecommendationList
        recommendations={mockRecommendations}
        isLoading={false}
        error={null}
      />,
    );

    expect(
      screen.getByText(
        "Recommendations are updated based on your reading activity and preferences.",
      ),
    ).toBeInTheDocument();
  });

  it("does not show refresh button when onRefresh is not provided", () => {
    renderWithRouter(
      <RecommendationList
        recommendations={mockRecommendations}
        isLoading={false}
        error={null}
      />,
    );

    expect(screen.queryByText("Refresh")).not.toBeInTheDocument();
  });
});
