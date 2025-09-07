import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { RecommendationCard } from "../RecommendationCard";
import { Recommendation } from "@/types";

const mockBook = {
  id: "1",
  title: "Test Book Title",
  author: "Test Author",
  description: "Test description",
  coverImageUrl: "https://example.com/cover.jpg",
  genres: ["Fiction", "Mystery", "Thriller"],
  publishedYear: 2023,
  averageRating: 4.2,
  reviewCount: 15,
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
};

const mockRecommendation: Recommendation = {
  book: mockBook,
  reason:
    "Based on your love for mystery novels and high-rated books, this thriller should be perfect for you.",
  confidence: 0.85,
};

const mockLowConfidenceRecommendation: Recommendation = {
  book: mockBook,
  reason: "This book might interest you based on your reading history.",
  confidence: 0.45,
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("RecommendationCard", () => {
  it("renders recommendation information correctly", () => {
    renderWithRouter(
      <RecommendationCard recommendation={mockRecommendation} />,
    );

    expect(screen.getByText("Test Book Title")).toBeInTheDocument();
    expect(screen.getByText("by Test Author")).toBeInTheDocument();
    expect(screen.getByText("4.2")).toBeInTheDocument();
    expect(screen.getByText("(15)")).toBeInTheDocument();
  });

  it("displays AI recommendation reason", () => {
    renderWithRouter(
      <RecommendationCard recommendation={mockRecommendation} />,
    );

    expect(screen.getByText(mockRecommendation.reason)).toBeInTheDocument();
  });

  it("displays confidence score correctly", () => {
    renderWithRouter(
      <RecommendationCard recommendation={mockRecommendation} />,
    );

    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(screen.getByText("High Match")).toBeInTheDocument();
  });

  it("displays correct confidence label for high confidence", () => {
    renderWithRouter(
      <RecommendationCard recommendation={mockRecommendation} />,
    );

    const confidenceBadge = screen.getByText("High Match");
    expect(confidenceBadge).toHaveClass("text-green-600", "bg-green-100");
  });

  it("displays correct confidence label for low confidence", () => {
    renderWithRouter(
      <RecommendationCard recommendation={mockLowConfidenceRecommendation} />,
    );

    const confidenceBadge = screen.getByText("Low Match");
    expect(confidenceBadge).toHaveClass("text-orange-600", "bg-orange-100");
  });

  it("displays confidence progress bar with correct width", () => {
    renderWithRouter(
      <RecommendationCard recommendation={mockRecommendation} />,
    );

    const progressBar = screen.getByRole("progressbar", { hidden: true });
    expect(progressBar).toHaveStyle("width: 85%");
  });

  it("creates correct link to book detail page", () => {
    renderWithRouter(
      <RecommendationCard recommendation={mockRecommendation} />,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/books/1");
  });

  it("applies custom className when provided", () => {
    const { container } = renderWithRouter(
      <RecommendationCard
        recommendation={mockRecommendation}
        className="custom-class"
      />,
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("handles image load error by setting placeholder", () => {
    renderWithRouter(
      <RecommendationCard recommendation={mockRecommendation} />,
    );

    const image = screen.getByAltText(
      "Cover of Test Book Title",
    ) as HTMLImageElement;

    // Simulate image error
    const errorEvent = new Event("error");
    image.dispatchEvent(errorEvent);

    expect(image.src).toContain("placeholder-book-cover.jpg");
  });

  it("displays genres correctly", () => {
    renderWithRouter(
      <RecommendationCard recommendation={mockRecommendation} />,
    );

    expect(screen.getByText("Fiction")).toBeInTheDocument();
    expect(screen.getByText("Mystery")).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument(); // +1 for the third genre
  });

  it("displays star rating correctly", () => {
    renderWithRouter(
      <RecommendationCard recommendation={mockRecommendation} />,
    );

    // Should have 4 full stars for 4.2 rating
    const stars = screen.getAllByText("★");
    expect(stars).toHaveLength(4);
  });

  it('displays "No ratings yet" when book has no reviews', () => {
    const bookNoRating = {
      ...mockBook,
      averageRating: 0,
      reviewCount: 0,
    };

    const recommendationNoRating: Recommendation = {
      book: bookNoRating,
      reason: "Test reason",
      confidence: 0.8,
    };

    renderWithRouter(
      <RecommendationCard recommendation={recommendationNoRating} />,
    );

    expect(screen.getByText("No ratings yet")).toBeInTheDocument();
    expect(screen.queryByText("4.2")).not.toBeInTheDocument();
  });

  it("displays medium confidence correctly", () => {
    const mediumConfidenceRecommendation: Recommendation = {
      book: mockBook,
      reason: "Test reason",
      confidence: 0.7,
    };

    renderWithRouter(
      <RecommendationCard recommendation={mediumConfidenceRecommendation} />,
    );

    expect(screen.getByText("Medium Match")).toBeInTheDocument();
    expect(screen.getByText("70%")).toBeInTheDocument();
  });
});
