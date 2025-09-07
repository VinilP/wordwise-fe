import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ReviewCard from '../ReviewCard';
import type { Review } from '../../../types';

// Mock the AuthContext
const mockUseAuth = vi.fn();
vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}));

describe('ReviewCard', () => {
  const mockReview: Review = {
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
    },
    book: {
      id: 'book-1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description: 'A classic American novel',
      coverImageUrl: 'https://example.com/cover.jpg',
      genres: ['Fiction', 'Classic'],
      publishedYear: 1925,
      averageRating: 4.2,
      reviewCount: 150,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
      isAuthenticated: true
    });
  });

  it('renders review content correctly', () => {
    render(<ReviewCard review={mockReview} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('This is a great book with excellent character development.')).toBeInTheDocument();
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
  });

  it('displays user initial when name is not available', () => {
    const reviewWithoutUserName = {
      ...mockReview,
      user: { ...mockReview.user!, name: '' }
    };
    
    render(<ReviewCard review={reviewWithoutUserName} />);
    
    expect(screen.getByText('U')).toBeInTheDocument();
    expect(screen.getByText('Anonymous User')).toBeInTheDocument();
  });

  it('shows book information when showBookInfo is true', () => {
    render(<ReviewCard review={mockReview} showBookInfo={true} />);
    
    expect(screen.getByText('The Great Gatsby')).toBeInTheDocument();
    expect(screen.getByText('by F. Scott Fitzgerald')).toBeInTheDocument();
  });

  it('does not show book information when showBookInfo is false', () => {
    render(<ReviewCard review={mockReview} showBookInfo={false} />);
    
    expect(screen.queryByText('The Great Gatsby')).not.toBeInTheDocument();
    expect(screen.queryByText('by F. Scott Fitzgerald')).not.toBeInTheDocument();
  });

  it('shows edit and delete buttons for review owner', () => {
    render(
      <ReviewCard 
        review={mockReview} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('does not show edit and delete buttons for non-owner', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'different-user', name: 'Jane Doe', email: 'jane@example.com' },
      isAuthenticated: true
    });
    
    render(
      <ReviewCard 
        review={mockReview} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <ReviewCard 
        review={mockReview} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockReview);
  });

  it('shows delete confirmation modal when delete button is clicked', () => {
    render(
      <ReviewCard 
        review={mockReview} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    expect(screen.getByText('Delete Review')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this review? This action cannot be undone.')).toBeInTheDocument();
  });

  it('calls onDelete when delete is confirmed', () => {
    render(
      <ReviewCard 
        review={mockReview} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    // Confirm deletion - use getAllByRole to get the confirmation button
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    const confirmButton = deleteButtons[1]; // The second delete button is the confirmation
    fireEvent.click(confirmButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith('review-1');
  });

  it('closes delete confirmation modal when cancel is clicked', () => {
    render(
      <ReviewCard 
        review={mockReview} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );
    
    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    // Cancel deletion
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    expect(screen.queryByText('Delete Review')).not.toBeInTheDocument();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ReviewCard review={mockReview} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles review without user data', () => {
    const reviewWithoutUser = {
      ...mockReview,
      user: undefined
    };
    
    render(<ReviewCard review={reviewWithoutUser} />);
    
    expect(screen.getByText('U')).toBeInTheDocument();
    expect(screen.getByText('Anonymous User')).toBeInTheDocument();
  });

  it('handles review without book data when showBookInfo is true', () => {
    const reviewWithoutBook = {
      ...mockReview,
      book: undefined
    };
    
    render(<ReviewCard review={reviewWithoutBook} showBookInfo={true} />);
    
    // Should not crash and should not show book info section
    expect(screen.queryByText('The Great Gatsby')).not.toBeInTheDocument();
  });
});