import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import FavoriteButton from '../FavoriteButton';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/user.service';
import type { User, Book } from '@/types';

// Mock the auth context
vi.mock('@/contexts/AuthContext');
const mockUseAuth = vi.mocked(useAuth);

// Mock the user service
vi.mock('@/services/user.service');
const mockUserService = vi.mocked(userService);

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

const mockBook: Book = {
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
};

describe('FavoriteButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUserService.checkFavoriteStatus.mockResolvedValue(false);
  });

  it('renders as not favorited initially', async () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      token: 'mock-token',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      isAuthenticated: true,
    });

    render(<FavoriteButton book={mockBook} />);

    await waitFor(() => {
      expect(screen.getByTitle('Add to favorites')).toBeInTheDocument();
    });
  });

  it('renders as favorited when book is in favorites', async () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      token: 'mock-token',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      isAuthenticated: true,
    });
    mockUserService.checkFavoriteStatus.mockResolvedValue(true);

    render(<FavoriteButton book={mockBook} />);

    await waitFor(() => {
      expect(screen.getByTitle('Remove from favorites')).toBeInTheDocument();
    });
  });

  it('shows login message when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      isAuthenticated: false,
    });

    render(<FavoriteButton book={mockBook} />);

    expect(screen.getByTitle('Please log in to add favorites')).toBeInTheDocument();
    expect(screen.getByText('Add to Favorites')).toBeInTheDocument();
  });

  it('adds book to favorites when clicked', async () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      token: 'mock-token',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      isAuthenticated: true,
    });
    mockUserService.addToFavorites.mockResolvedValue();

    render(<FavoriteButton book={mockBook} />);

    await waitFor(() => {
      expect(screen.getByTitle('Add to favorites')).toBeInTheDocument();
    });

    const button = screen.getByTitle('Add to favorites');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockUserService.addToFavorites).toHaveBeenCalledWith(mockBook.id);
    });
  });

  it('removes book from favorites when clicked', async () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      token: 'mock-token',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      isAuthenticated: true,
    });
    mockUserService.checkFavoriteStatus.mockResolvedValue(true);
    mockUserService.removeFromFavorites.mockResolvedValue();

    render(<FavoriteButton book={mockBook} />);

    await waitFor(() => {
      expect(screen.getByTitle('Remove from favorites')).toBeInTheDocument();
    });

    const button = screen.getByTitle('Remove from favorites');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockUserService.removeFromFavorites).toHaveBeenCalledWith(mockBook.id);
    });
  });

  it('calls onFavoriteChange callback when favorite status changes', async () => {
    const onFavoriteChange = vi.fn();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      token: 'mock-token',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      isAuthenticated: true,
    });
    mockUserService.addToFavorites.mockResolvedValue();

    render(<FavoriteButton book={mockBook} onFavoriteChange={onFavoriteChange} />);

    await waitFor(() => {
      expect(screen.getByTitle('Add to favorites')).toBeInTheDocument();
    });

    const button = screen.getByTitle('Add to favorites');
    fireEvent.click(button);

    await waitFor(() => {
      expect(onFavoriteChange).toHaveBeenCalledWith(true);
    });
  });

  it('shows loading state while toggling favorite', async () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      token: 'mock-token',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      isAuthenticated: true,
    });
    mockUserService.addToFavorites.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<FavoriteButton book={mockBook} />);

    await waitFor(() => {
      expect(screen.getByTitle('Add to favorites')).toBeInTheDocument();
    });

    const button = screen.getByTitle('Add to favorites');
    fireEvent.click(button);

    // Should show loading spinner
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows error message when favorite operation fails', async () => {
    const errorMessage = 'Failed to add to favorites';
    mockUseAuth.mockReturnValue({
      user: mockUser,
      token: 'mock-token',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      isAuthenticated: true,
    });
    mockUserService.addToFavorites.mockRejectedValue(new Error(errorMessage));

    render(<FavoriteButton book={mockBook} />);

    await waitFor(() => {
      expect(screen.getByTitle('Add to favorites')).toBeInTheDocument();
    });

    const button = screen.getByTitle('Add to favorites');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('renders with different sizes correctly', async () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      token: 'mock-token',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      isAuthenticated: true,
    });

    const { rerender } = render(<FavoriteButton book={mockBook} size="sm" />);
    await waitFor(() => {
      expect(screen.getByTitle('Add to favorites')).toBeInTheDocument();
    });

    rerender(<FavoriteButton book={mockBook} size="md" />);
    await waitFor(() => {
      expect(screen.getByTitle('Add to favorites')).toBeInTheDocument();
    });

    rerender(<FavoriteButton book={mockBook} size="lg" />);
    await waitFor(() => {
      expect(screen.getByTitle('Add to favorites')).toBeInTheDocument();
    });
  });

  it('shows text when showText prop is true', async () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      token: 'mock-token',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      isAuthenticated: true,
    });

    render(<FavoriteButton book={mockBook} showText={true} />);

    await waitFor(() => {
      expect(screen.getByText('Add to Favorites')).toBeInTheDocument();
    });
  });
});




