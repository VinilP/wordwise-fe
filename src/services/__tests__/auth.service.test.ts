import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      post: vi.fn(),
      get: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}));

const mockedAxios = vi.mocked(axios) as any;

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('tokenManager', () => {
  let tokenManager: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const authModule = await import('../auth.service');
    tokenManager = authModule.tokenManager;
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      const mockToken = 'test-token';
      mockLocalStorage.getItem.mockReturnValue(mockToken);

      const result = tokenManager.getToken();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('auth_token');
      expect(result).toBe(mockToken);
    });

    it('should return null when no token exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = tokenManager.getToken();

      expect(result).toBeNull();
    });
  });

  describe('setToken', () => {
    it('should store token in localStorage', () => {
      const token = 'test-token';

      tokenManager.setToken(token);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('auth_token', token);
    });
  });

  describe('getUser', () => {
    it('should return parsed user from localStorage', () => {
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      const result = tokenManager.getUser();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('user_data');
      expect(result).toEqual(mockUser);
    });

    it('should return null when no user data exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = tokenManager.getUser();

      expect(result).toBeNull();
    });
  });

  describe('clearAll', () => {
    it('should remove all auth data from localStorage', () => {
      tokenManager.clearAll();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refresh_token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user_data');
    });
  });
});

describe('authService', () => {
  const mockAuthResponse: AuthResponse = {
    user: {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    accessToken: 'test-token',
    refreshToken: 'test-refresh-token',
  };

  let mockAxiosInstance: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Create a fresh mock instance for each test
    mockAxiosInstance = {
      post: vi.fn(),
      get: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    };
    
    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    
    // Re-import the service to get fresh instance
    vi.resetModules();
  });

  describe('login', () => {
    it('should login successfully and store auth data', async () => {
      const { authService } = await import('../auth.service');
      
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockAxiosInstance.post.mockResolvedValue({
        data: {
          success: true,
          data: mockAuthResponse,
          message: 'Login successful'
        },
      });

      const result = await authService.login(loginData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', loginData);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('auth_token', mockAuthResponse.accessToken);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refresh_token', mockAuthResponse.refreshToken);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user_data', JSON.stringify(mockAuthResponse.user));
      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw error on login failure', async () => {
      const { authService } = await import('../auth.service');
      
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockAxiosInstance.post.mockRejectedValue({
        response: {
          data: {
            error: {
              message: 'Invalid credentials',
            },
          },
        },
      });

      await expect(authService.login(loginData)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should register successfully and store auth data', async () => {
      const { authService } = await import('../auth.service');
      
      const registerData: RegisterRequest = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      mockAxiosInstance.post.mockResolvedValue({
        data: {
          success: true,
          data: mockAuthResponse,
          message: 'Registration successful'
        },
      });

      const result = await authService.register(registerData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/register', registerData);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('auth_token', mockAuthResponse.accessToken);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw error on registration failure', async () => {
      const { authService } = await import('../auth.service');
      
      const registerData: RegisterRequest = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      };

      mockAxiosInstance.post.mockRejectedValue({
        response: {
          data: {
            error: {
              message: 'Email already exists',
            },
          },
        },
      });

      await expect(authService.register(registerData)).rejects.toThrow('Email already exists');
    });
  });

  describe('logout', () => {
    it('should logout and clear local storage', async () => {
      const { authService } = await import('../auth.service');
      
      mockAxiosInstance.post.mockResolvedValue({});

      await authService.logout();

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/logout');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refresh_token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user_data');
    });

    it('should clear local storage even if logout request fails', async () => {
      const { authService } = await import('../auth.service');
      
      mockAxiosInstance.post.mockRejectedValue(new Error('Network error'));

      await authService.logout();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refresh_token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user_data');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', async () => {
      const { authService } = await import('../auth.service');
      
      mockLocalStorage.getItem.mockReturnValue('test-token');

      const result = authService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when no token exists', async () => {
      const { authService } = await import('../auth.service');
      
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = authService.isAuthenticated();

      expect(result).toBe(false);
    });
  });
});