import { vi } from 'vitest';

// Mock function factories
export const createMockFunction = <T extends (...args: any[]) => any>(
  implementation?: T
): T & { mockClear: () => void; mockReset: () => void } => {
  const mockFn = vi.fn(implementation);
  return Object.assign(mockFn, {
    mockClear: () => mockFn.mockClear(),
    mockReset: () => mockFn.mockReset(),
  });
};

// Common mock implementations
export const mockNavigate = createMockFunction(() => {});
export const mockLocation = createMockFunction(() => ({
  pathname: '/',
  search: '',
  hash: '',
  state: null,
}));

// Mock router functions
export const mockRouterFunctions = () => {
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      useNavigate: () => mockNavigate,
      useLocation: () => mockLocation(),
      useParams: () => ({}),
    };
  });
};

// Mock service functions
export const mockAuthService = {
  login: createMockFunction(),
  register: createMockFunction(),
  logout: createMockFunction(),
  getCurrentUser: createMockFunction(),
  refreshToken: createMockFunction(),
};

export const mockBookService = {
  getBooks: createMockFunction(),
  getBook: createMockFunction(),
  getPopularBooks: createMockFunction(),
  searchBooks: createMockFunction(),
};

export const mockReviewService = {
  getReviews: createMockFunction(),
  createReview: createMockFunction(),
  updateReview: createMockFunction(),
  deleteReview: createMockFunction(),
};

export const mockRecommendationService = {
  getRecommendations: createMockFunction(),
  getUserRecommendations: createMockFunction(),
};

export const mockUserService = {
  getUser: createMockFunction(),
  updateUser: createMockFunction(),
  getFavorites: createMockFunction(),
  addToFavorites: createMockFunction(),
  removeFromFavorites: createMockFunction(),
};

// Mock all services
export const mockAllServices = () => {
  vi.mock('@/services', () => ({
    authService: mockAuthService,
    bookService: mockBookService,
    reviewService: mockReviewService,
    recommendationService: mockRecommendationService,
    userService: mockUserService,
    tokenManager: {
      getToken: createMockFunction(),
      setToken: createMockFunction(),
      removeToken: createMockFunction(),
      getUser: createMockFunction(),
      setUser: createMockFunction(),
      removeUser: createMockFunction(),
    },
  }));
};

// Mock API responses
export const mockApiResponses = {
  success: (data: any) => Promise.resolve({ data }),
  error: (message: string, status: number = 500) => 
    Promise.reject({ response: { data: { error: message }, status } }),
  networkError: () => Promise.reject(new Error('Network Error')),
};

// Mock localStorage
export const mockLocalStorage = {
  getItem: createMockFunction((key: string) => {
    const store: Record<string, string> = {};
    return store[key] || null;
  }),
  setItem: createMockFunction((key: string, value: string) => {
    // Mock implementation
  }),
  removeItem: createMockFunction((key: string) => {
    // Mock implementation
  }),
  clear: createMockFunction(() => {
    // Mock implementation
  }),
};

// Mock window methods
export const mockWindowMethods = () => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });

  Object.defineProperty(window, 'scrollTo', {
    value: createMockFunction(),
    writable: true,
  });

  Object.defineProperty(window, 'alert', {
    value: createMockFunction(),
    writable: true,
  });

  Object.defineProperty(window, 'confirm', {
    value: createMockFunction(() => true),
    writable: true,
  });
};

// Reset all mocks
export const resetAllMocks = () => {
  vi.clearAllMocks();
  mockAuthService.mockReset();
  mockBookService.mockReset();
  mockReviewService.mockReset();
  mockRecommendationService.mockReset();
  mockUserService.mockReset();
  mockNavigate.mockReset();
  mockLocation.mockReset();
  mockLocalStorage.getItem.mockReset();
  mockLocalStorage.setItem.mockReset();
  mockLocalStorage.removeItem.mockReset();
  mockLocalStorage.clear.mockReset();
};

