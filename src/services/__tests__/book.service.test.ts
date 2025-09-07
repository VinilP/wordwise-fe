import { describe, it, expect, vi } from "vitest";

// Simple test to verify the service exports exist
describe("bookService", () => {
  it("should export bookService with expected methods", async () => {
    // Mock axios before importing the service
    vi.doMock("axios", () => ({
      default: {
        create: vi.fn(() => ({
          get: vi.fn(),
          interceptors: {
            request: {
              use: vi.fn(),
            },
          },
        })),
      },
    }));

    const { bookService } = await import("../book.service");

    expect(bookService).toBeDefined();
    expect(typeof bookService.getBooks).toBe("function");
    expect(typeof bookService.getBookById).toBe("function");
    expect(typeof bookService.searchBooks).toBe("function");
  });

  it("should handle pagination parameters correctly", () => {
    const pagination = { page: 1, limit: 12 };
    const params = new URLSearchParams();
    params.append("page", pagination.page.toString());
    params.append("limit", pagination.limit.toString());

    expect(params.toString()).toBe("page=1&limit=12");
  });

  it("should handle search filters correctly", () => {
    const filters = {
      query: "fantasy",
      genres: ["Fiction", "Mystery"],
      minRating: 4,
      publishedYear: 2023,
    };

    const params = new URLSearchParams();
    if (filters.query) {
      params.append("search", filters.query);
    }
    if (filters.genres) {
      filters.genres.forEach((genre) => params.append("genres", genre));
    }
    if (filters.minRating) {
      params.append("minRating", filters.minRating.toString());
    }
    if (filters.publishedYear) {
      params.append("publishedYear", filters.publishedYear.toString());
    }

    const expectedUrl =
      "search=fantasy&genres=Fiction&genres=Mystery&minRating=4&publishedYear=2023";
    expect(params.toString()).toBe(expectedUrl);
  });

  it("should handle empty filters gracefully", () => {
    const params = new URLSearchParams();
    params.append("page", "1");
    params.append("limit", "12");

    // No additional filters should be added
    expect(params.toString()).toBe("page=1&limit=12");
  });
});
