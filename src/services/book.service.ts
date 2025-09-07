import axios from "axios";
import type {
  Book,
  PaginatedBooks,
  PaginationParams,
  SearchFilters,
} from "@/types";
import { API_BASE_URL } from "../utils/config";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bookService = {
  /**
   * Get paginated list of books with optional filters
   */
  async getBooks(
    pagination: PaginationParams,
    filters?: SearchFilters,
  ): Promise<PaginatedBooks> {
    const params = new URLSearchParams();
    params.append("page", pagination.page.toString());
    params.append("limit", pagination.limit.toString());

    if (filters?.query !== undefined) {
      params.append("search", filters.query);
    }
    if (filters?.genres && filters.genres.length > 0) {
      filters.genres.forEach((genre) => params.append("genres", genre));
    }
    if (filters?.minRating) {
      params.append("minRating", filters.minRating.toString());
    }
    if (filters?.publishedYear) {
      params.append("publishedYear", filters.publishedYear.toString());
    }

    const response = await api.get(`/books?${params.toString()}`);

    // Transform backend response to frontend expected format
    // Backend returns: { success: true, data: { data: Book[], pagination: {...} } }
    const apiResponse = response.data;
    const backendData = apiResponse.data;

    return {
      books: backendData.data || [],
      totalCount: backendData.pagination?.total || 0,
      currentPage: backendData.pagination?.page || 1,
      totalPages: backendData.pagination?.totalPages || 1,
      hasNextPage: backendData.pagination
        ? backendData.pagination.page < backendData.pagination.totalPages
        : false,
      hasPreviousPage: backendData.pagination
        ? backendData.pagination.page > 1
        : false,
    };
  },

  /**
   * Get detailed information for a specific book
   */
  async getBookById(id: string): Promise<Book> {
    const response = await api.get(`/books/${id}`);
    const apiResponse = response.data;
    return apiResponse.data;
  },

  /**
   * Search books by title or author
   */
  async searchBooks(query: string, filters?: SearchFilters): Promise<Book[]> {
    const params = new URLSearchParams();
    params.append("q", query);

    if (filters?.genres && filters.genres.length > 0) {
      filters.genres.forEach((genre) => params.append("genres", genre));
    }
    if (filters?.minRating) {
      params.append("minRating", filters.minRating.toString());
    }
    if (filters?.publishedYear) {
      params.append("publishedYear", filters.publishedYear.toString());
    }

    const response = await api.get(`/books/search?${params.toString()}`);
    const apiResponse = response.data;
    return apiResponse.data;
  },
};
