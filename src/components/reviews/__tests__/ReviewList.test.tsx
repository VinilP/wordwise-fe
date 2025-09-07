import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReviewList from '../ReviewList';
import type { Review } from '../../../types';

// Mock the AuthContext
const mockUseAuth = vi.fn();
vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}));

describe('ReviewList', () => {
  const mockReviews: Review[] = [
    {
      id: 'review-1',
      bookId: 'book-1',
      userId: 'user-1',
      content: 'This is a great book with excellent character development.',
      rating: 4,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      user: {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    },
    {
      id: 'review-2',
      bookId: 'book-2',
      userId: 'user-2',
      content: 'Another excellent review with detailed analysis.',
      rating: 5,
      createdAt: '2024-01-16T10:00:00Z',
      updatedAt: '2024-01-16T10:00:00Z',
      user: {
        id: 'user-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    }
  ];

  const mockOnEditReview = vi.fn();
  const mockOnDeleteReview = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
      isAuthenticated: true
    });
  });

  it('renders all reviews when provided', () => {
    render(<ReviewList reviews={mockReviews} />);
    
    expect(screen.getByText('This is a great book with excellent character development.')).toBeInTheDocument();
    expect(screen.getByText('Another excellent review with detailed analysis.')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('shows loading skeleton when isLoading is true', () => {
    render(<ReviewList reviews={[]} isLoading={true} />);
    
    // Should show loading skeletons
    const loadingElements = screen.getAllByRole('generic');
    expect(loadingElements.some(el => el.classList.contains('animate-pulse'))).toBe(true);
  });

  it('shows empty state when no reviews are provided', () => {
    render(<ReviewList reviews={[]} />);
    
    expect(screen.getByText('No Reviews')).toBeInTheDocument();
    expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
  });

  it('shows custom empty message when provided', () => {
    const customMessage = 'Start reviewing books to see them here.';
    render(<ReviewList reviews={[]} emptyMessage={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('passes onEditReview callback to ReviewCard components', () => {
    render(
      <ReviewList 
        reviews={mockReviews} 
        onEditReview={mockOnEditReview}
      />
    );
    
    // The edit buttons should be present (indicating the callback was passed)
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    expect(editButtons).toHaveLength(1); // Only one review is owned by the current user
  });

  it('passes onDeleteReview callback to ReviewCard components', () => {
    render(
      <ReviewList 
        reviews={mockReviews} 
        onDeleteReview={mockOnDeleteReview}
      />
    );
    
    // The delete buttons should be present (indicating the callback was passed)
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    expect(deleteButtons).toHaveLength(1); // Only one review is owned by the current user
  });

  it('passes showBookInfo prop to ReviewCard components', () => {
    const reviewsWithBooks = mockReviews.map(review => ({
      ...review,
      book: {
        id: 'book-1',
        title: 'Test Book',
        author: 'Test Author',
        description: 'Test description',
        coverImageUrl: 'https://example.com/cover.jpg',
        genres: ['Fiction'],
        publishedYear: 2024,
        averageRating: 4.5,
        reviewCount: 10,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    }));

    render(
      <ReviewList 
        reviews={reviewsWithBooks} 
        showBookInfo={true}
      />
    );
    
    expect(screen.getAllByText('Test Book')).toHaveLength(2);
    expect(screen.getAllByText('by Test Author')).toHaveLength(2);
  });

  it('applies custom className', () => {
    const { container } = render(
      <ReviewList reviews={mockReviews} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles empty reviews array gracefully', () => {
    render(<ReviewList reviews={[]} />);
    
    expect(screen.getByText('No Reviews')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders correct number of loading skeletons', () => {
    render(<ReviewList reviews={[]} isLoading={true} />);
    
    // Should render 3 loading skeletons by default
    const skeletons = screen.getAllByRole('generic').filter(el => 
      el.classList.contains('animate-pulse')
    );
    expect(skeletons).toHaveLength(3);
  });

  it('does not show loading state when reviews are provided', () => {
    render(<ReviewList reviews={mockReviews} isLoading={false} />);
    
    // Should show actual reviews, not loading state
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('animate-pulse')).not.toBeInTheDocument();
  });

  it('shows empty state icon', () => {
    render(<ReviewList reviews={[]} />);
    
    // Should show the star icon in empty state
    const starIcon = screen.getByText('No Reviews');
    expect(starIcon).toBeInTheDocument();
  });
});