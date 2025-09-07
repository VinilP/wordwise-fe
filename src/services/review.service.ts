import type { Review, CreateReviewRequest, UpdateReviewRequest } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ReviewService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(errorData.error?.message || errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data; // Extract data from { success: true, data: ... } format
  }

  async createReview(reviewData: CreateReviewRequest): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });

    return this.handleResponse<Review>(response);
  }

  async getReviewsByBook(bookId: string): Promise<Review[]> {
    const response = await fetch(`${API_BASE_URL}/reviews/book/${bookId}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<Review[]>(response);
  }

  async getReviewsByUser(userId: string): Promise<Review[]> {
    const response = await fetch(`${API_BASE_URL}/reviews/user/${userId}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<Review[]>(response);
  }

  async updateReview(reviewId: string, updateData: UpdateReviewRequest): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData),
    });

    return this.handleResponse<Review>(response);
  }

  async deleteReview(reviewId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }
}

export const reviewService = new ReviewService();