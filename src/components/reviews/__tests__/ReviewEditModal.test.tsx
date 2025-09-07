import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ReviewEditModal from "../ReviewEditModal";
import type { Review } from "../../../types";

describe("ReviewEditModal", () => {
  const mockReview: Review = {
    id: "review-1",
    bookId: "book-1",
    userId: "user-1",
    content: "This is a great book with excellent character development.",
    rating: 4,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    book: {
      id: "book-1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      description: "A classic American novel",
      coverImageUrl: "https://example.com/cover.jpg",
      genres: ["Fiction", "Classic"],
      publishedYear: 1925,
      averageRating: 4.2,
      reviewCount: 150,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  };

  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    render(
      <ReviewEditModal
        review={mockReview}
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(screen.queryByText("Edit Review")).not.toBeInTheDocument();
  });

  it("does not render when review is null", () => {
    render(
      <ReviewEditModal
        review={null}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(screen.queryByText("Edit Review")).not.toBeInTheDocument();
  });

  it("renders modal content when isOpen is true and review is provided", () => {
    render(
      <ReviewEditModal
        review={mockReview}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(screen.getByText("Edit Review")).toBeInTheDocument();
    expect(
      screen.getByText('for "The Great Gatsby" by F. Scott Fitzgerald'),
    ).toBeInTheDocument();
  });

  it("displays review form with initial data", () => {
    render(
      <ReviewEditModal
        review={mockReview}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(
      screen.getByDisplayValue(
        "This is a great book with excellent character development.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("(4 out of 5)")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(
      <ReviewEditModal
        review={mockReview}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    const closeButton = screen.getByLabelText("Close modal");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when cancel button is clicked", () => {
    render(
      <ReviewEditModal
        review={mockReview}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onSubmit with correct data when form is submitted", async () => {
    render(
      <ReviewEditModal
        review={mockReview}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    // Update the review content
    const textarea = screen.getByDisplayValue(
      "This is a great book with excellent character development.",
    );
    fireEvent.change(textarea, {
      target: {
        value: "Updated review content that is long enough for validation.",
      },
    });

    // Update the rating
    const fifthStar = screen.getByLabelText("Rate 5 out of 5 stars");
    fireEvent.click(fifthStar);

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /update review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith("review-1", {
        rating: 5,
        content: "Updated review content that is long enough for validation.",
      });
    });
  });

  it("calls onClose after successful submission", async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <ReviewEditModal
        review={mockReview}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    // Submit the form with existing data
    const submitButton = screen.getByRole("button", { name: /update review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("closes modal when Escape key is pressed", () => {
    render(
      <ReviewEditModal
        review={mockReview}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("disables close button when isLoading is true", () => {
    render(
      <ReviewEditModal
        review={mockReview}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={true}
      />,
    );

    const closeButton = screen.getByLabelText("Close modal");
    expect(closeButton).toBeDisabled();
  });

  it("shows book title and author in header", () => {
    render(
      <ReviewEditModal
        review={mockReview}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(
      screen.getByText('for "The Great Gatsby" by F. Scott Fitzgerald'),
    ).toBeInTheDocument();
  });

  it("handles review without book data gracefully", () => {
    const reviewWithoutBook = {
      ...mockReview,
      book: undefined,
    };

    render(
      <ReviewEditModal
        review={reviewWithoutBook}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(screen.getByText("Edit Review")).toBeInTheDocument();
    expect(screen.queryByText('for "')).not.toBeInTheDocument();
  });

  it("prevents body scroll when modal is open", () => {
    const originalOverflow = document.body.style.overflow;

    render(
      <ReviewEditModal
        review={mockReview}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(document.body.style.overflow).toBe("hidden");

    // Cleanup
    document.body.style.overflow = originalOverflow;
  });

  it("restores body scroll when modal is closed", () => {
    const { rerender } = render(
      <ReviewEditModal
        review={mockReview}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    rerender(
      <ReviewEditModal
        review={mockReview}
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(document.body.style.overflow).toBe("unset");
  });
});
