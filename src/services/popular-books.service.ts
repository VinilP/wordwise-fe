import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import type { Book } from "../types";

// Type guard for axios errors
const isAxiosError = (
  error: unknown,
): error is {
  response?: { status?: number; data?: { error?: { message?: string } } };
} => {
  return error !== null && typeof error === "object" && "response" in error;
};

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

export interface PopularBooksResponse {
  success: boolean;
  data: {
    books: Book[];
    message: string;
  };
}

export const popularBooksService = {
  async getPopularBooks(): Promise<{ books: Book[]; message: string }> {
    try {
      console.log("🌐 Frontend: Making API request to /popular-books");
      const response = await api.get("/popular-books");
      const apiResponse = response.data;
      console.log("📡 Frontend: API response:", apiResponse);

      if (!apiResponse.success) {
        throw new Error(
          apiResponse.error?.message || "Failed to fetch popular books",
        );
      }

      const result = {
        books: apiResponse.data.books || [],
        message:
          apiResponse.data.message || "Popular books loaded successfully",
      };
      console.log("✅ Frontend: Processed popular books:", result);
      return result;
    } catch (error: unknown) {
      console.error("❌ Frontend: Error fetching popular books:", error);

      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        isAxiosError(error) &&
        error.response?.status === 401
      ) {
        throw new Error("Please log in to view popular books");
      }

      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        isAxiosError(error) &&
        error.response?.data?.error?.message
      ) {
        throw new Error(error.response.data.error.message);
      }

      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch popular books",
      );
    }
  },
};
