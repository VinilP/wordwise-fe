import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { config } from '@/utils';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types';

const API_BASE_URL = config.apiBaseUrl;

// Create axios instance with default config
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (refreshToken: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  getUser: (): User | null => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  setUser: (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearAll: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// Add request interceptor to include auth token
authApi.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for token refresh
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          const response = await authApi.post('/auth/refresh', {
            refreshToken,
          });
          
          const { token, refreshToken: newRefreshToken } = response.data;
          tokenManager.setToken(token);
          tokenManager.setRefreshToken(newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return authApi(originalRequest);
        }
      } catch (refreshError: any) {
        // Only clear tokens and redirect if it's a 401 (unauthorized) error
        if (refreshError.response?.status === 401) {
          tokenManager.clearAll();
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<{ success: boolean; data: { user: User; accessToken: string; refreshToken: string }; message: string }> = await authApi.post(
        '/auth/login',
        credentials
      );
      
      // Extract data from the wrapped response
      const { user, accessToken, refreshToken } = response.data.data;
      
      // Store tokens and user data
      tokenManager.setToken(accessToken);
      tokenManager.setRefreshToken(refreshToken);
      tokenManager.setUser(user);
      
      return { user, accessToken, refreshToken };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error?.message || 'Login failed'
      );
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<{ success: boolean; data: { user: User; accessToken: string; refreshToken: string }; message: string }> = await authApi.post(
        '/auth/register',
        userData
      );
      
      // Extract data from the wrapped response
      const { user, accessToken, refreshToken } = response.data.data;
      
      // Store tokens and user data
      tokenManager.setToken(accessToken);
      tokenManager.setRefreshToken(refreshToken);
      tokenManager.setUser(user);
      
      return { user, accessToken, refreshToken };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error?.message || 'Registration failed'
      );
    }
  },

  async logout(): Promise<void> {
    try {
      await authApi.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearAll();
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response: AxiosResponse<{ success: boolean; data: User; message: string }> = await authApi.get('/auth/me');
      const user = response.data.data;
      tokenManager.setUser(user);
      return user;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error?.message || 'Failed to get current user'
      );
    }
  },

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response: AxiosResponse<{ success: boolean; data: { user: User; accessToken: string; refreshToken: string }; message: string }> = await authApi.post(
        '/auth/refresh',
        { refreshToken }
      );
      
      // Extract data from the wrapped response
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      tokenManager.setToken(accessToken);
      tokenManager.setRefreshToken(newRefreshToken);
      
      return { user, accessToken, refreshToken };
    } catch (error: any) {
      tokenManager.clearAll();
      throw new Error(
        error.response?.data?.error?.message || 'Token refresh failed'
      );
    }
  },

  isAuthenticated(): boolean {
    return !!tokenManager.getToken();
  },
};