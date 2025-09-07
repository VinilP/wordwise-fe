import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { userService } from '../user.service';
import type { UserProfile, UserProfileWithDetails, UserFavorite } from '@/types';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const mockUserProfile: UserProfile = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  reviewCount: 5,
  favoriteCount: 10,
};

const mockUserFavorite: UserFavorite = {
  id: '1',
  userId: '1',
  bookId: '1',
  createdAt: '2023-01-01T00:00:00Z',
  book: {
    id: '1',
    title: 'Test Book',
    author: 'Test Author',
    description: 'Test description',
    coverImageUrl: 'https://example.com/cover.jpg',
    genres: ['Fiction'],
    publishedYear: 2023,
    averageRating: 4.5,
    reviewCount: 10,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
};

const mockUserProfileWithDetails: UserProfileWithDetails = {
  ...mockUserProfile,
  reviews: [],
  favorites: [mockUserFavorite],
};

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('mock-token');
  });

  describe('getProfile', () => {
    it('should return user profile successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: mockUserProfile,
          message: 'Profile retrieved successfully',
        },
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue(mockResponse),
        post: vi.fn(),
        delete: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      const result = await userService.getProfile();

      expect(result).toEqual(mockUserProfile);
    });

    it('should throw error when API call fails', async () => {
      const errorResponse = {
        response: {
          data: {
            error: {
              message: 'Profile not found',
            },
          },
        },
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockRejectedValue(errorResponse),
        post: vi.fn(),
        delete: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      await expect(userService.getProfile()).rejects.toThrow('Profile not found');
    });
  });

  describe('getProfileWithDetails', () => {
    it('should return user profile with details successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: mockUserProfileWithDetails,
          message: 'Profile details retrieved successfully',
        },
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue(mockResponse),
        post: vi.fn(),
        delete: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      const result = await userService.getProfileWithDetails();

      expect(result).toEqual(mockUserProfileWithDetails);
    });
  });

  describe('addToFavorites', () => {
    it('should add book to favorites successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Book added to favorites',
        },
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn(),
        post: vi.fn().mockResolvedValue(mockResponse),
        delete: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      await expect(userService.addToFavorites('1')).resolves.toBeUndefined();
    });

    it('should throw error when adding to favorites fails', async () => {
      const errorResponse = {
        response: {
          data: {
            error: {
              message: 'Book not found',
            },
          },
        },
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn(),
        post: vi.fn().mockRejectedValue(errorResponse),
        delete: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      await expect(userService.addToFavorites('1')).rejects.toThrow('Book not found');
    });
  });

  describe('removeFromFavorites', () => {
    it('should remove book from favorites successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Book removed from favorites',
        },
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      await expect(userService.removeFromFavorites('1')).resolves.toBeUndefined();
    });

    it('should throw error when removing from favorites fails', async () => {
      const errorResponse = {
        response: {
          data: {
            error: {
              message: 'Favorite not found',
            },
          },
        },
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn().mockRejectedValue(errorResponse),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      await expect(userService.removeFromFavorites('1')).rejects.toThrow('Favorite not found');
    });
  });

  describe('getFavorites', () => {
    it('should return user favorites successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [mockUserFavorite],
          message: 'Favorites retrieved successfully',
        },
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue(mockResponse),
        post: vi.fn(),
        delete: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      const result = await userService.getFavorites();

      expect(result).toEqual([mockUserFavorite]);
    });
  });

  describe('checkFavoriteStatus', () => {
    it('should return favorite status successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { isFavorite: true },
          message: 'Favorite status retrieved successfully',
        },
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue(mockResponse),
        post: vi.fn(),
        delete: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      const result = await userService.checkFavoriteStatus('1');

      expect(result).toBe(true);
    });

    it('should return false when book is not favorited', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { isFavorite: false },
          message: 'Favorite status retrieved successfully',
        },
      };

      mockedAxios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue(mockResponse),
        post: vi.fn(),
        delete: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as any);

      const result = await userService.checkFavoriteStatus('1');

      expect(result).toBe(false);
    });
  });
});




