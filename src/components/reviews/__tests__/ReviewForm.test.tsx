import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ReviewForm from "../ReviewForm";

describe("ReviewForm", () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form fields correctly", () => {
    render(<ReviewForm bookId="book-1" onSubmit={mockOnSubmit} />);

    expect(screen.getByText("Rating *")).toBeInTheDocument();
    expect(screen.getByText("Review *")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Share your thoughts about this book..."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /submit review/i }),
    ).toBeInTheDocument();
  });

  it("displays initial data when provided", () => {
    const initialData = {
      rating: 4,
      content: "Great book!",
    };

    render(<ReviewForm onSubmit={mockOnSubmit} initialData={initialData} />);

    expect(screen.getByDisplayValue("Great book!")).toBeInTheDocument();
    expect(screen.getByText("(4 out of 5)")).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    render(<ReviewForm bookId="book-1" onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole("button", { name: /submit review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("shows validation error for short review content", async () => {
    render(<ReviewForm bookId="book-1" onSubmit={mockOnSubmit} />);

    // Set rating
    const thirdStar = screen.getByLabelText("Rate 3 out of 5 stars");
    fireEvent.click(thirdStar);

    // Set short content
    const textarea = screen.getByPlaceholderText(
      "Share your thoughts about this book...",
    );
    fireEvent.change(textarea, { target: { value: "Short" } });

    const submitButton = screen.getByRole("button", { name: /submit review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Review must be at least 10 characters long"),
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for long review content", async () => {
    render(<ReviewForm bookId="book-1" onSubmit={mockOnSubmit} />);

    // Set rating
    const thirdStar = screen.getByLabelText("Rate 3 out of 5 stars");
    fireEvent.click(thirdStar);

    // Set long content (over 1000 characters)
    const longContent = "a".repeat(1001);
    const textarea = screen.getByPlaceholderText(
      "Share your thoughts about this book...",
    );
    fireEvent.change(textarea, { target: { value: longContent } });

    const submitButton = screen.getByRole("button", { name: /submit review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Review must be less than 1000 characters"),
      ).toBeInTheDocument();
    });
  });

  it("displays character count", () => {
    render(<ReviewForm bookId="book-1" onSubmit={mockOnSubmit} />);

    const textarea = screen.getByPlaceholderText(
      "Share your thoughts about this book...",
    );
    fireEvent.change(textarea, { target: { value: "Hello world" } });

    expect(screen.getByText("11/1000 characters")).toBeInTheDocument();
  });

  it("calls onSubmit with correct data for create form", async () => {
    render(<ReviewForm bookId="book-1" onSubmit={mockOnSubmit} />);

    // Set rating
    const fourthStar = screen.getByLabelText("Rate 4 out of 5 stars");
    fireEvent.click(fourthStar);

    // Set content
    const textarea = screen.getByPlaceholderText(
      "Share your thoughts about this book...",
    );
    fireEvent.change(textarea, {
      target: { value: "This is a great book with excellent characters." },
    });

    const submitButton = screen.getByRole("button", { name: /submit review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        bookId: "book-1",
        rating: 4,
        content: "This is a great book with excellent characters.",
      });
    });
  });

  it("calls onSubmit with correct data for update form", async () => {
    const initialData = {
      rating: 3,
      content: "Initial review content that is long enough.",
    };

    render(
      <ReviewForm
        onSubmit={mockOnSubmit}
        initialData={initialData}
        submitButtonText="Update Review"
      />,
    );

    // Update rating
    const fifthStar = screen.getByLabelText("Rate 5 out of 5 stars");
    fireEvent.click(fifthStar);

    // Update content
    const textarea = screen.getByDisplayValue(
      "Initial review content that is long enough.",
    );
    fireEvent.change(textarea, {
      target: { value: "Updated review content that is also long enough." },
    });

    const submitButton = screen.getByRole("button", { name: /update review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        rating: 5,
        content: "Updated review content that is also long enough.",
      });
    });
  });

  it("shows cancel button when showCancel is true", () => {
    render(
      <ReviewForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        showCancel={true}
      />,
    );

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(
      <ReviewForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        showCancel={true}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("disables form when isLoading is true", () => {
    render(
      <ReviewForm bookId="book-1" onSubmit={mockOnSubmit} isLoading={true} />,
    );

    const textarea = screen.getByPlaceholderText(
      "Share your thoughts about this book...",
    );
    const submitButton = screen.getByRole("button", { name: /submitting/i });

    expect(textarea).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it("shows loading state in submit button", () => {
    render(
      <ReviewForm bookId="book-1" onSubmit={mockOnSubmit} isLoading={true} />,
    );

    expect(screen.getByText("Submitting...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submitting/i })).toBeDisabled();
  });

  it("resets form after successful create submission", async () => {
    render(<ReviewForm bookId="book-1" onSubmit={mockOnSubmit} />);

    // Fill form
    const fourthStar = screen.getByLabelText("Rate 4 out of 5 stars");
    fireEvent.click(fourthStar);

    const textarea = screen.getByPlaceholderText(
      "Share your thoughts about this book...",
    );
    fireEvent.change(textarea, {
      target: { value: "This is a great book with excellent characters." },
    });

    // Submit
    const submitButton = screen.getByRole("button", { name: /submit review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    // Form should be reset
    await waitFor(() => {
      expect(textarea).toHaveValue("");
    });
  });
});
