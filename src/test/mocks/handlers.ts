import { http, HttpResponse } from "msw";
import { Book, Review, User, Recommendation } from "@/types";

// Mock data
const mockUser: User = {
  id: "1",
  email: "test@example.com",
  name: "Test User",
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
};

const mockBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A classic American novel about the Jazz Age.",
    coverImageUrl: "https://example.com/gatsby.jpg",
    genres: ["Fiction", "Classic", "Drama"],
    publishedYear: 1925,
    averageRating: 4.2,
    reviewCount: 150,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A gripping tale of racial injustice and childhood innocence.",
    coverImageUrl: "https://example.com/mockingbird.jpg",
    genres: ["Fiction", "Classic", "Drama"],
    publishedYear: 1960,
    averageRating: 4.5,
    reviewCount: 200,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
];

const mockReviews: Review[] = [
  {
    id: "1",
    bookId: "1",
    userId: "1",
    rating: 5,
    comment: "Amazing book!",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    user: mockUser,
    book: mockBooks[0],
  },
];

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    userId: "1",
    bookId: "2",
    reason: "Based on your love for classic literature",
    score: 0.95,
    createdAt: "2023-01-01T00:00:00Z",
    book: mockBooks[1],
  },
];

// API handlers
export const handlers = [
  // Auth endpoints
  http.post("http://localhost:3001/api/auth/login", () => {
    return HttpResponse.json({
      user: mockUser,
      token: "mock-jwt-token",
      refreshToken: "mock-refresh-token",
    });
  }),

  http.post("http://localhost:3001/api/auth/register", () => {
    return HttpResponse.json({
      user: mockUser,
      token: "mock-jwt-token",
      refreshToken: "mock-refresh-token",
    });
  }),

  http.post("http://localhost:3001/api/auth/refresh", () => {
    return HttpResponse.json({
      token: "new-mock-jwt-token",
      refreshToken: "new-mock-refresh-token",
    });
  }),

  http.get("http://localhost:3001/api/auth/me", () => {
    return HttpResponse.json(mockUser);
  }),

  http.post("http://localhost:3001/api/auth/logout", () => {
    return HttpResponse.json({ message: "Logged out successfully" });
  }),

  // Books endpoints
  http.get("http://localhost:3001/api/books", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    const genre = url.searchParams.get("genre");
    const page = url.searchParams.get("page") || "1";
    const limit = url.searchParams.get("limit") || "10";

    let filteredBooks = mockBooks;

    if (search) {
      filteredBooks = filteredBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(search.toLowerCase()) ||
          book.author.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (genre) {
      filteredBooks = filteredBooks.filter((book) =>
        book.genres.some((g) => g.toLowerCase() === genre.toLowerCase()),
      );
    }

    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    return HttpResponse.json({
      success: true,
      data: {
        data: paginatedBooks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredBooks.length,
          totalPages: Math.ceil(filteredBooks.length / parseInt(limit)),
        },
      },
    });
  }),

  // Handle search endpoint
  http.get("http://localhost:3001/api/books/search", ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const page = url.searchParams.get("page") || "1";
    const limit = url.searchParams.get("limit") || "10";

    let filteredBooks = mockBooks;

    if (q) {
      filteredBooks = filteredBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(q.toLowerCase()) ||
          book.author.toLowerCase().includes(q.toLowerCase()),
      );
    }

    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    return HttpResponse.json({
      success: true,
      data: {
        data: paginatedBooks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredBooks.length,
          totalPages: Math.ceil(filteredBooks.length / parseInt(limit)),
        },
      },
    });
  }),

  http.get("http://localhost:3001/api/books/:id", ({ params }) => {
    const book = mockBooks.find((b) => b.id === params.id);
    if (!book) {
      return HttpResponse.json({ error: "Book not found" }, { status: 404 });
    }
    return HttpResponse.json({
      success: true,
      data: book,
    });
  }),

  http.get("http://localhost:3001/api/books/popular", () => {
    return HttpResponse.json({
      success: true,
      data: {
        books: mockBooks.slice(0, 5),
      },
    });
  }),

  // Reviews endpoints
  http.get("http://localhost:3001/api/reviews", ({ request }) => {
    const url = new URL(request.url);
    const bookId = url.searchParams.get("bookId");
    const userId = url.searchParams.get("userId");
    const page = url.searchParams.get("page") || "1";
    const limit = url.searchParams.get("limit") || "10";

    let filteredReviews = mockReviews;

    if (bookId) {
      filteredReviews = filteredReviews.filter(
        (review) => review.bookId === bookId,
      );
    }

    if (userId) {
      filteredReviews = filteredReviews.filter(
        (review) => review.userId === userId,
      );
    }

    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

    return HttpResponse.json({
      reviews: paginatedReviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredReviews.length,
        totalPages: Math.ceil(filteredReviews.length / parseInt(limit)),
      },
    });
  }),

  http.post("http://localhost:3001/api/reviews", () => {
    const newReview: Review = {
      id: "2",
      bookId: "1",
      userId: "1",
      rating: 4,
      comment: "Great book!",
      createdAt: "2023-01-02T00:00:00Z",
      updatedAt: "2023-01-02T00:00:00Z",
      user: mockUser,
      book: mockBooks[0],
    };
    return HttpResponse.json(newReview, { status: 201 });
  }),

  http.put("http://localhost:3001/api/reviews/:id", ({ params }) => {
    const review = mockReviews.find((r) => r.id === params.id);
    if (!review) {
      return HttpResponse.json({ error: "Review not found" }, { status: 404 });
    }
    return HttpResponse.json({ ...review, comment: "Updated comment" });
  }),

  http.delete("http://localhost:3001/api/reviews/:id", ({ params }) => {
    const review = mockReviews.find((r) => r.id === params.id);
    if (!review) {
      return HttpResponse.json({ error: "Review not found" }, { status: 404 });
    }
    return HttpResponse.json({ message: "Review deleted successfully" });
  }),

  // Recommendations endpoints
  http.get("http://localhost:3001/api/recommendations", () => {
    return HttpResponse.json({
      recommendations: mockRecommendations,
    });
  }),

  http.get("http://localhost:3001/api/recommendations/user/:userId", () => {
    return HttpResponse.json({
      recommendations: mockRecommendations,
    });
  }),

  // User endpoints
  http.get("http://localhost:3001/api/users/:id", ({ params }) => {
    if (params.id === "1") {
      return HttpResponse.json(mockUser);
    }
    return HttpResponse.json({ error: "User not found" }, { status: 404 });
  }),

  http.put("http://localhost:3001/api/users/:id", ({ params }) => {
    if (params.id === "1") {
      return HttpResponse.json({ ...mockUser, name: "Updated User" });
    }
    return HttpResponse.json({ error: "User not found" }, { status: 404 });
  }),

  // Favorites endpoints
  http.get("http://localhost:3001/api/users/:id/favorites", () => {
    return HttpResponse.json({
      books: mockBooks,
    });
  }),

  http.post("http://localhost:3001/api/users/:id/favorites", () => {
    return HttpResponse.json({ message: "Book added to favorites" });
  }),

  http.delete("http://localhost:3001/api/users/:id/favorites/:bookId", () => {
    return HttpResponse.json({ message: "Book removed from favorites" });
  }),

  // Error handlers
  http.get("/api/error", () => {
    return HttpResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }),

  http.get("/api/not-found", () => {
    return HttpResponse.json({ error: "Not found" }, { status: 404 });
  }),
];

// Error handlers for testing error scenarios
export const errorHandlers = [
  http.get("http://localhost:3001/api/books", () => {
    return HttpResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 },
    );
  }),

  http.post("http://localhost:3001/api/auth/login", () => {
    return HttpResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }),

  http.get("http://localhost:3001/api/books/:id", () => {
    return HttpResponse.json({ error: "Book not found" }, { status: 404 });
  }),
];
