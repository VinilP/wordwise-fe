import axios from "axios";
import type { AxiosResponse } from "axios";
import { config } from "@/utils";
import type {
  UserProfile,
  UserProfileWithDetails,
  UserFavorite,
} from "@/types";

// Helper function to extract error message from unknown error
export const getErrorMessage = (
  error: unknown,
  defaultMessage: string,
): string => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: { data?: { error?: { message?: string } } };
    };
    return axiosError.response?.data?.error?.message || defaultMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};

const API_BASE_URL = config.apiBaseUrl;

// Create axios instance with default config
const userApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
userApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor for error handling
userApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Only clear tokens and redirect if it's actually an unauthorized error
      // (not a network error or server down)
      console.warn(
        "User service received 401 - this will be handled by auth service",
      );
      // Don't redirect here - let the auth service handle it
    }
    return Promise.reject(error);
  },
);

export const userService = {
  /**
   * Get user profile information
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response: AxiosResponse<{
        success: boolean;
        data: UserProfile;
        message: string;
      }> = await userApi.get("/users/profile");
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Failed to get user profile"));
    }
  },

  /**
   * Get user profile with detailed information (reviews and favorites)
   */
  async getProfileWithDetails(): Promise<UserProfileWithDetails> {
    try {
      const response: AxiosResponse<{
        success: boolean;
        data: UserProfileWithDetails;
        message: string;
      }> = await userApi.get("/users/profile/details");
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(
        getErrorMessage(error, "Failed to get user profile details"),
      );
    }
  },

  /**
   * Add a book to user's favorites
   */
  async addToFavorites(bookId: string): Promise<void> {
    try {
      await userApi.post(`/users/favorites/${bookId}`);
    } catch (error: unknown) {
      throw new Error(
        getErrorMessage(error, "Failed to add book to favorites"),
      );
    }
  },

  /**
   * Remove a book from user's favorites
   */
  async removeFromFavorites(bookId: string): Promise<void> {
    try {
      await userApi.delete(`/users/favorites/${bookId}`);
    } catch (error: unknown) {
      throw new Error(
        getErrorMessage(error, "Failed to remove book from favorites"),
      );
    }
  },

  /**
   * Get user's favorite books
   */
  async getFavorites(): Promise<UserFavorite[]> {
    try {
      const response: AxiosResponse<{
        success: boolean;
        data: UserFavorite[];
        message: string;
      }> = await userApi.get("/users/favorites");
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Failed to get user favorites"));
    }
  },

  /**
   * Check if a book is in user's favorites
   */
  async checkFavoriteStatus(bookId: string): Promise<boolean> {
    try {
      const response: AxiosResponse<{
        success: boolean;
        data: { isFavorite: boolean };
        message: string;
      }> = await userApi.get(`/users/favorites/${bookId}/status`);
      return response.data.data.isFavorite;
    } catch (error: unknown) {
      throw new Error(
        getErrorMessage(error, "Failed to check favorite status"),
      );
    }
  },
};
