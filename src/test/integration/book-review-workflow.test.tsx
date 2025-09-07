import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { QueryClient } from '@tanstack/react-query';
import { App } from '@/App';
import { createMockUser, createMockBook } from '@/test/utils/test-utils';

// Mock router functions
const mockNavigate = vi.fn();
const mockLocation = vi.fn(() => ({ pathname: '/', search: '', hash: '', state: null }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation(),
    useParams: () => ({ id: '1' }),
    // Keep the actual BrowserRouter for proper context
    BrowserRouter: actual.BrowserRouter,
  };
});

describe('Book Review Workflow Integration Tests', () => {
  let queryClient: QueryClient;
  const mockUser = createMockUser();
  const mockBook = createMockBook();

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: 0 },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  describe('Book Discovery Workflow', () => {
    it('should allow users to search and discover books', async () => {
      const user = userEvent.setup();
      
      render(<App />, { 
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true }
      });

      // Wait for books to load
      await waitFor(() => {
        expect(screen.getByText(/books/i)).toBeInTheDocument();
      });

      // Search for books
      const searchInput = screen.getByPlaceholderText(/search books/i);
      await user.type(searchInput, 'gatsby');

      // Wait for search results
      await waitFor(() => {
        expect(screen.getByText(/the great gatsby/i)).toBeInTheDocument();
      });

      // Click on a book
      const bookLink = screen.getByText(/the great gatsby/i);
      await user.click(bookLink);

      // Should navigate to book detail page
      await waitFor(() => {
        expect(screen.getByText(/f\. scott fitzgerald/i)).toBeInTheDocument();
      });
    });

    it('should allow users to filter books by genre', async () => {
      const user = userEvent.setup();
      
      render(<App />, { 
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true }
      });

      // Wait for books to load
      await waitFor(() => {
        expect(screen.getByText(/books/i)).toBeInTheDocument();
      });

      // Open filters
      const filterButton = screen.getByLabelText(/show search filters/i);
      await user.click(filterButton);

      // Select a genre filter
      const fictionFilter = screen.getByRole('button', { name: /add fiction filter/i });
      await user.click(fictionFilter);

      // Wait for filtered results
      await waitFor(() => {
        expect(screen.getByText(/fiction/i)).toBeInTheDocument();
      });
    });

    it('should display book details correctly', async () => {
      render(<App />, { 
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true }
      });

      // Navigate to book detail page
      await waitFor(() => {
        expect(screen.getByText(/books/i)).toBeInTheDocument();
      });

      const bookLink = screen.getByText(/the great gatsby/i);
      await userEvent.click(bookLink);

      // Check book details
      await waitFor(() => {
        expect(screen.getByText(/the great gatsby/i)).toBeInTheDocument();
        expect(screen.getByText(/f\. scott fitzgerald/i)).toBeInTheDocument();
        expect(screen.getByText(/a classic american novel/i)).toBeInTheDocument();
        expect(screen.getByText(/1925/i)).toBeInTheDocument();
        expect(screen.getByText(/4\.2/i)).toBeInTheDocument();
      });
    });
  });

  describe('Review Creation Workflow', () => {
    it('should allow users to create a review', async () => {
      const user = userEvent.setup();
      
      render(<App />, { 
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true }
      });

      // Navigate to book detail page
      await waitFor(() => {
        expect(screen.getByText(/books/i)).toBeInTheDocument();
      });

      const bookLink = screen.getByText(/the great gatsby/i);
      await user.click(bookLink);

      // Wait for book detail page
      await waitFor(() => {
        expect(screen.getByText(/write a review/i)).toBeInTheDocument();
      });

      // Click write review button
      const writeReviewButton = screen.getByText(/write a review/i);
      await user.click(writeReviewButton);

      // Fill in review form
      const ratingInput = screen.getByLabelText(/rating/i);
      const commentTextarea = screen.getByPlaceholderText(/write your review/i);
      const submitButton = screen.getByRole('button', { name: /submit review/i });

      await user.type(ratingInput, '5');
      await user.type(commentTextarea, 'This is an amazing book!');
      await user.click(submitButton);

      // Wait for review to be created
      await waitFor(() => {
        expect(screen.getByText(/review submitted successfully/i)).toBeInTheDocument();
      });

      // Verify review appears in the list
      await waitFor(() => {
        expect(screen.getByText(/this is an amazing book/i)).toBeInTheDocument();
      });
    });

    it('should validate review form before submission', async () => {
      const user = userEvent.setup();
      
      render(<App />, { 
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true }
      });

      // Navigate to book detail page
      await waitFor(() => {
        expect(screen.getByText(/books/i)).toBeInTheDocument();
      });

      const bookLink = screen.getByText(/the great gatsby/i);
      await user.click(bookLink);

      // Wait for book detail page
      await waitFor(() => {
        expect(screen.getByText(/write a review/i)).toBeInTheDocument();
      });

      // Click write review button
      const writeReviewButton = screen.getByText(/write a review/i);
      await user.click(writeReviewButton);

      // Try to submit without filling form
      const submitButton = screen.getByRole('button', { name: /submit review/i });
      await user.click(submitButton);

      // Check for validation errors
      await waitFor(() => {
        expect(screen.getByText(/rating is required/i)).toBeInTheDocument();
        expect(screen.getByText(/comment is required/i)).toBeInTheDocument();
      });
    });

    it('should allow users to edit their reviews', async () => {
      const user = userEvent.setup();
      
      render(<App />, { 
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true }
      });

      // Navigate to book detail page
      await waitFor(() => {
        expect(screen.getByText(/books/i)).toBeInTheDocument();
      });

      const bookLink = screen.getByText(/the great gatsby/i);
      await user.click(bookLink);

      // Wait for book detail page and existing review
      await waitFor(() => {
        expect(screen.getByText(/amazing book/i)).toBeInTheDocument();
      });

      // Click edit button on user's review
      const editButton = screen.getByLabelText(/edit review/i);
      await user.click(editButton);

      // Update review
      const commentTextarea = screen.getByPlaceholderText(/write your review/i);
      await user.clear(commentTextarea);
      await user.type(commentTextarea, 'Updated review comment');
      
      const saveButton = screen.getByRole('button', { name: /save changes/i });
      await user.click(saveButton);

      // Wait for review to be updated
      await waitFor(() => {
        expect(screen.getByText(/updated review comment/i)).toBeInTheDocument();
      });
    });

    it('should allow users to delete their reviews', async () => {
      const user = userEvent.setup();
      
      render(<App />, { 
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true }
      });

      // Navigate to book detail page
      await waitFor(() => {
        expect(screen.getByText(/books/i)).toBeInTheDocument();
      });

      const bookLink = screen.getByText(/the great gatsby/i);
      await user.click(bookLink);

      // Wait for book detail page and existing review
      await waitFor(() => {
        expect(screen.getByText(/amazing book/i)).toBeInTheDocument();
      });

      // Click delete button on user's review
      const deleteButton = screen.getByLabelText(/delete review/i);
      await user.click(deleteButton);

      // Confirm deletion
      const confirmButton = screen.getByRole('button', { name: /delete/i });
      await user.click(confirmButton);

      // Wait for review to be deleted
      await waitFor(() => {
        expect(screen.queryByText(/amazing book/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Book Rating Workflow', () => {
    it('should allow users to rate books', async () => {
      const user = userEvent.setup();
      
      render(<App />, { 
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true }
      });

      // Navigate to book detail page
      await waitFor(() => {
        expect(screen.getByText(/books/i)).toBeInTheDocument();
      });

      const bookLink = screen.getByText(/the great gatsby/i);
      await user.click(bookLink);

      // Wait for book detail page
      await waitFor(() => {
        expect(screen.getByText(/rate this book/i)).toBeInTheDocument();
      });

      // Click on rating stars
      const ratingStars = screen.getAllByRole('button', { name: /rate/i });
      await user.click(ratingStars[4]); // Click 5th star for 5-star rating

      // Wait for rating to be saved
      await waitFor(() => {
        expect(screen.getByText(/rating saved/i)).toBeInTheDocument();
      });
    });

    it('should display average rating correctly', async () => {
      render(<App />, { 
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true }
      });

      // Navigate to book detail page
      await waitFor(() => {
        expect(screen.getByText(/books/i)).toBeInTheDocument();
      });

      const bookLink = screen.getByText(/the great gatsby/i);
      await userEvent.click(bookLink);

      // Check average rating display
      await waitFor(() => {
        expect(screen.getByText(/4\.2/i)).toBeInTheDocument();
        expect(screen.getByText(/150 reviews/i)).toBeInTheDocument();
      });
    });
  });

  describe('Book Favorites Workflow', () => {
    it('should allow users to add books to favorites', async () => {
      const user = userEvent.setup();
      
      render(<App />, { 
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true }
      });

      // Navigate to book detail page
      await waitFor(() => {
        expect(screen.getByText(/books/i)).toBeInTheDocument();
      });

      const bookLink = screen.getByText(/the great gatsby/i);
      await user.click(bookLink);

      // Wait for book detail page
      await waitFor(() => {
        expect(screen.getByLabelText(/add to favorites/i)).toBeInTheDocument();
      });

      // Click add to favorites button
      const favoriteButton = screen.getByLabelText(/add to favorites/i);
      await user.click(favoriteButton);

      // Wait for confirmation
      await waitFor(() => {
        expect(screen.getByText(/added to favorites/i)).toBeInTheDocument();
      });

      // Verify button state changed
      expect(screen.getByLabelText(/remove from favorites/i)).toBeInTheDocument();
    });

    it('should allow users to remove books from favorites', async () => {
      const user = userEvent.setup();
      
      render(<App />, { 
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true }
      });

      // Navigate to book detail page
      await waitFor(() => {
        expect(screen.getByText(/books/i)).toBeInTheDocument();
      });

      const bookLink = screen.getByText(/the great gatsby/i);
      await user.click(bookLink);

      // Wait for book detail page
      await waitFor(() => {
        expect(screen.getByLabelText(/remove from favorites/i)).toBeInTheDocument();
      });

      // Click remove from favorites button
      const favoriteButton = screen.getByLabelText(/remove from favorites/i);
      await user.click(favoriteButton);

      // Wait for confirmation
      await waitFor(() => {
        expect(screen.getByText(/removed from favorites/i)).toBeInTheDocument();
      });

      // Verify button state changed
      expect(screen.getByLabelText(/add to favorites/i)).toBeInTheDocument();
    });
  });
});
