import axios from "axios";
import type { RecommendationResponse } from "@/types";
import { API_BASE_URL } from "../utils/config";

// Type guard for axios errors
const isAxiosError = (
  error: unknown,
): error is { response?: { status?: number } } => {
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

export const recommendationService = {
  /**
   * Get personalized book recommendations for the authenticated user
   */
  async getRecommendations(): Promise<RecommendationResponse> {
    try {
      console.log("🌐 Frontend: Making API request to /recommendations");
      const response = await api.get("/recommendations");
      const apiResponse = response.data;
      console.log("📡 Frontend: API response:", apiResponse);

      if (!apiResponse.success) {
        throw new Error(
          apiResponse.error?.message || "Failed to get recommendations",
        );
      }

      const result = {
        recommendations: apiResponse.data.recommendations || [],
        message:
          apiResponse.data.message || "Recommendations loaded successfully",
      };
      console.log("✅ Frontend: Processed recommendations:", result);
      return result;
    } catch (error: unknown) {
      // Handle specific error types
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        isAxiosError(error) &&
        error.response?.status === 401
      ) {
        throw new Error(
          "Authentication required. Please log in to get recommendations.",
        );
      }

      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        isAxiosError(error) &&
        error.response?.status === 429
      ) {
        throw new Error("Too many requests. Please try again later.");
      }

      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        isAxiosError(error) &&
        error.response?.status === 500
      ) {
        const errorData = error.response.data;
        if (errorData?.error?.code === "SERVICE_UNAVAILABLE") {
          throw new Error(
            "Recommendation service temporarily unavailable. Please try again later.",
          );
        }
        throw new Error(
          "Failed to get recommendations. Please try again later.",
        );
      }

      // Network or other errors
      if (error.code === "NETWORK_ERROR" || !error.response) {
        throw new Error(
          "Network error. Please check your connection and try again.",
        );
      }

      throw new Error(
        error.message ||
          "An unexpected error occurred while getting recommendations.",
      );
    }
  },

  /**
   * Clear recommendation cache for the authenticated user
   */
  async clearCache(): Promise<void> {
    try {
      const response = await api.delete("/recommendations/cache");
      const apiResponse = response.data;

      if (!apiResponse.success) {
        throw new Error(apiResponse.error?.message || "Failed to clear cache");
      }
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        isAxiosError(error) &&
        error.response?.status === 401
      ) {
        throw new Error(
          "Authentication required. Please log in to clear cache.",
        );
      }

      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        isAxiosError(error) &&
        error.response?.status === 500
      ) {
        throw new Error("Failed to clear cache. Please try again later.");
      }

      throw new Error(
        error.message || "An unexpected error occurred while clearing cache.",
      );
    }
  },

  /**
   * Refresh recommendations by clearing cache and fetching new ones
   */
  async refreshRecommendations(): Promise<RecommendationResponse> {
    try {
      // Clear cache first
      await this.clearCache();

      // Then get fresh recommendations
      return await this.getRecommendations();
    } catch (error: unknown) {
      // If cache clearing fails, still try to get recommendations
      if (error.message.includes("clear cache")) {
        console.warn(
          "Failed to clear cache, but continuing with recommendation fetch",
        );
        return await this.getRecommendations();
      }
      throw error;
    }
  },
};
