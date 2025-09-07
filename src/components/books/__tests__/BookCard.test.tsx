import { render, screen, waitFor } from "@/test/utils/test-utils";
import { BookCard } from "../BookCard";
import { Book } from "../../../types";
import { createMockUser } from "@/test/utils/test-utils";

const mockBook: Book = {
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

const mockBookNoRating: Book = {
  ...mockBook,
  id: "2",
  averageRating: 0,
  reviewCount: 0,
};

const renderWithAuth = (component: React.ReactElement) => {
  return render(component, {
    initialAuthState: {
      user: createMockUser(),
      isAuthenticated: true,
    },
  });
};

describe("BookCard", () => {
  it("renders book information correctly", () => {
    renderWithAuth(<BookCard book={mockBook} />);

    expect(
      screen.getByText("Test Book Title", { selector: "h3" }),
    ).toBeInTheDocument();
    expect(screen.getByText("by Test Author")).toBeInTheDocument();
    expect(screen.getByText("4.2")).toBeInTheDocument();
    expect(screen.getByText("(15)")).toBeInTheDocument();
  });

  it("displays book cover image with correct alt text", async () => {
    renderWithAuth(<BookCard book={mockBook} />);

    // Wait for image to load
    await waitFor(() => {
      const image = screen.getByAltText(
        "Cover of Test Book Title by Test Author",
      );
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "https://example.com/cover.jpg");
    });
  });

  it("renders star rating correctly", () => {
    renderWithAuth(<BookCard book={mockBook} />);

    // Should have 4 full stars and 1 half star for 4.2 rating
    const stars = screen.getAllByText("★");
    expect(stars).toHaveLength(4);
  });

  it('displays "No ratings yet" when book has no reviews', () => {
    renderWithAuth(<BookCard book={mockBookNoRating} />);

    expect(screen.getByText("No ratings yet")).toBeInTheDocument();
    expect(screen.queryByText("4.2")).not.toBeInTheDocument();
  });

  it("displays genres correctly", () => {
    renderWithAuth(<BookCard book={mockBook} />);

    expect(screen.getByText("Fiction")).toBeInTheDocument();
    expect(screen.getByText("Mystery")).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument(); // +1 for the third genre
  });

  it("creates correct link to book detail page", () => {
    renderWithAuth(<BookCard book={mockBook} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/books/1");
  });

  it("applies custom className when provided", () => {
    const { container } = renderWithAuth(
      <BookCard book={mockBook} className="custom-class" />,
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("handles image load error by setting placeholder", async () => {
    renderWithAuth(<BookCard book={mockBook} />);

    // Wait for image to be rendered
    await waitFor(() => {
      const image = screen.getByAltText(
        "Cover of Test Book Title by Test Author",
      ) as HTMLImageElement;
      expect(image).toBeInTheDocument();

      // Simulate image error
      const errorEvent = new Event("error");
      image.dispatchEvent(errorEvent);

      // The component should show placeholder overlay after error
      expect(screen.getByText("No Cover")).toBeInTheDocument();
    });
  });

  it("displays correct number of genres when more than 2", () => {
    const bookWithManyGenres: Book = {
      ...mockBook,
      genres: ["Fiction", "Mystery", "Thriller", "Adventure", "Drama"],
    };

    renderWithAuth(<BookCard book={bookWithManyGenres} />);

    expect(screen.getByText("Fiction")).toBeInTheDocument();
    expect(screen.getByText("Mystery")).toBeInTheDocument();
    expect(screen.getByText("+3")).toBeInTheDocument(); // +3 for remaining genres
  });

  it("displays all genres when 2 or fewer", () => {
    const bookWithTwoGenres: Book = {
      ...mockBook,
      genres: ["Fiction", "Mystery"],
    };

    renderWithAuth(<BookCard book={bookWithTwoGenres} />);

    expect(screen.getByText("Fiction")).toBeInTheDocument();
    expect(screen.getByText("Mystery")).toBeInTheDocument();
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });
});
