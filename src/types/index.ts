// TypeScript type definitions will be exported from here

// Authentication types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Book types
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImageUrl: string;
  genres: string[];
  publishedYear: number;
  averageRating: number | string | null;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedBooks {
  books: Book[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BookFilters {
  genres?: string[];
  minRating?: number;
  publishedYear?: number;
}

export interface SearchFilters extends BookFilters {
  query?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

// Review types
export interface Review {
  id: string;
  bookId: string;
  userId: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  book?: Book;
}

export interface CreateReviewRequest {
  bookId: string;
  content: string;
  rating: number;
}

export interface UpdateReviewRequest {
  content?: string;
  rating?: number;
}

// User Profile types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  reviewCount: number;
  favoriteCount: number;
}

export interface UserProfileWithDetails extends UserProfile {
  reviews: Review[];
  favorites: UserFavorite[];
}

export interface UserFavorite {
  id: string;
  userId: string;
  bookId: string;
  createdAt: string;
  book: Book;
}

// API Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Recommendation types
export interface Recommendation {
  book: Book;
  reason: string;
  confidence: number;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  message: string;
}

export interface RecommendationError {
  message: string;
  code: string;
  details?: string;
}

export interface RecommendationState {
  recommendations: Recommendation[];
  isLoading: boolean;
  error: RecommendationError | null;
  lastUpdated: Date | null;
}
