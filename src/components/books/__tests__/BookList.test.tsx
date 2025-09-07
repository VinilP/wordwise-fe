import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { BookList } from "../BookList";
import { bookService } from "../../../services";
import { PaginatedBooks } from "../../../types";
import { AuthProvider } from "../../../contexts/AuthContext";

// Mock the book service
vi.mock("../../../services", () => ({
  bookService: {
    getBooks: vi.fn(),
  },
  tokenManager: {
    getToken: vi.fn(() => null),
    getUser: vi.fn(() => null),
    setToken: vi.fn(),
    setUser: vi.fn(),
    clear: vi.fn(),
  },
  authService: {
    getCurrentUser: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

const mockBookService = bookService as any;

const mockBooksData: PaginatedBooks = {
  books: [
    {
      id: "1",
      title: "Test Book 1",
      author: "Author 1",
      description: "Description 1",
      coverImageUrl: "https://example.com/cover1.jpg",
      genres: ["Fiction"],
      publishedYear: 2023,
      averageRating: 4.5,
      reviewCount: 10,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    },
    {
      id: "2",
      title: "Test Book 2",
      author: "Author 2",
      description: "Description 2",
      coverImageUrl: "https://example.com/cover2.jpg",
      genres: ["Mystery"],
      publishedYear: 2022,
      averageRating: 3.8,
      reviewCount: 5,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    },
  ],
  totalCount: 25,
  currentPage: 1,
  totalPages: 3,
  hasNextPage: true,
  hasPreviousPage: false,
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>{component}</BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>,
  );
};

describe("BookList", () => {
  beforeEach(() => {
    mockBookService.getBooks.mockClear();
  });

  it("renders loading state initially", () => {
    mockBookService.getBooks.mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    renderWithProviders(<BookList />);

    expect(screen.getByLabelText("Loading books")).toBeInTheDocument();
    expect(screen.getByRole("grid")).toBeInTheDocument(); // Loading grid
  });

  it("renders books when data is loaded", async () => {
    mockBookService.getBooks.mockResolvedValue(mockBooksData);

    renderWithProviders(<BookList />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Test Book 1" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Test Book 2" }),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Showing 1 to 12 of 25 books")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
  });

  it("renders error state when API call fails", async () => {
    const errorMessage = "Failed to fetch books";
    mockBookService.getBooks.mockRejectedValue(new Error(errorMessage));

    renderWithProviders(<BookList />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load books")).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("retries API call when Try Again button is clicked", async () => {
    mockBookService.getBooks
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce(mockBooksData);

    renderWithProviders(<BookList />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load books")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Try Again"));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Test Book 1" }),
      ).toBeInTheDocument();
    });
  });

  it("renders empty state when no books are found", async () => {
    const emptyData: PaginatedBooks = {
      ...mockBooksData,
      books: [],
      totalCount: 0,
      totalPages: 0,
    };

    mockBookService.getBooks.mockResolvedValue(emptyData);

    renderWithProviders(<BookList />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "No books found" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Try adjusting your search criteria or filters."),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Clear all filters")).toBeInTheDocument();
  });

  it("handles pagination correctly", async () => {
    mockBookService.getBooks.mockResolvedValue(mockBooksData);

    renderWithProviders(<BookList />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Test Book 1" }),
      ).toBeInTheDocument();
    });

    // Mock second page data
    const secondPageData: PaginatedBooks = {
      ...mockBooksData,
      currentPage: 2,
      hasNextPage: true,
      hasPreviousPage: true,
    };

    mockBookService.getBooks.mockResolvedValue(secondPageData);

    // Click next page
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockBookService.getBooks).toHaveBeenCalledWith(
        { page: 2, limit: 12 },
        {},
      );
    });
  });

  it("handles search filters correctly", async () => {
    mockBookService.getBooks.mockResolvedValue(mockBooksData);

    renderWithProviders(<BookList />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Test Book 1" }),
      ).toBeInTheDocument();
    });

    // Simulate search
    const searchInput = screen.getByPlaceholderText(
      "Search books by title or author...",
    );
    fireEvent.change(searchInput, { target: { value: "fantasy" } });

    // Wait for debounced search
    await waitFor(
      () => {
        expect(mockBookService.getBooks).toHaveBeenCalledWith(
          { page: 1, limit: 12 },
          { query: "fantasy" },
        );
      },
      { timeout: 1000 },
    );
  });

  it("resets to first page when search filters change", async () => {
    mockBookService.getBooks.mockResolvedValue({
      ...mockBooksData,
      currentPage: 2,
    });

    renderWithProviders(<BookList />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Test Book 1" }),
      ).toBeInTheDocument();
    });

    // Change search - should reset to page 1
    const searchInput = screen.getByPlaceholderText(
      "Search books by title or author...",
    );
    fireEvent.change(searchInput, { target: { value: "test" } });

    await waitFor(() => {
      expect(mockBookService.getBooks).toHaveBeenCalledWith(
        { page: 1, limit: 12 },
        { query: "test" },
      );
    });
  });

  it("scrolls to top when changing pages", async () => {
    const scrollToSpy = vi
      .spyOn(window, "scrollTo")
      .mockImplementation(() => {});

    mockBookService.getBooks.mockResolvedValue(mockBooksData);

    renderWithProviders(<BookList />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Test Book 1" }),
      ).toBeInTheDocument();
    });

    // Click next page
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });

    scrollToSpy.mockRestore();
  });

  it("applies custom className when provided", () => {
    mockBookService.getBooks.mockResolvedValue(mockBooksData);

    const { container } = renderWithProviders(
      <BookList className="custom-class" />,
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders pagination only when there are multiple pages", async () => {
    const singlePageData: PaginatedBooks = {
      ...mockBooksData,
      totalPages: 1,
      hasNextPage: false,
    };

    mockBookService.getBooks.mockResolvedValue(singlePageData);

    renderWithProviders(<BookList />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Test Book 1" }),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
    expect(screen.queryByText("Next")).not.toBeInTheDocument();
  });

  it("calls API with correct parameters on initial load", async () => {
    mockBookService.getBooks.mockResolvedValue(mockBooksData);

    renderWithProviders(<BookList />);

    await waitFor(() => {
      expect(mockBookService.getBooks).toHaveBeenCalledWith(
        { page: 1, limit: 12 },
        {},
      );
    });
  });
});
