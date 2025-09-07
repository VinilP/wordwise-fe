import { screen } from '@testing-library/react';
import { InsufficientDataFallback } from '../InsufficientDataFallback';
import { render } from '@/test/utils/test-utils';

describe('InsufficientDataFallback', () => {
  it('renders main message correctly', () => {
    render(<InsufficientDataFallback />);

    expect(screen.getByText('We Need More Data to Personalize Your Recommendations')).toBeInTheDocument();
    expect(screen.getByText(/Our AI needs to understand your reading preferences before it can suggest books you'll love/)).toBeInTheDocument();
  });

  it('displays steps to get recommendations', () => {
    render(<InsufficientDataFallback />);

    expect(screen.getByText('Here\'s how to get personalized recommendations:')).toBeInTheDocument();
    expect(screen.getByText('Read and Review Books')).toBeInTheDocument();
    expect(screen.getByText('Rate Different Genres')).toBeInTheDocument();
    expect(screen.getByText('Add Books to Favorites')).toBeInTheDocument();
  });

  it('displays action buttons with correct links', () => {
    render(<InsufficientDataFallback />);

    const browseBooksLink = screen.getByText('Browse Books').closest('a');
    const viewProfileLink = screen.getByText('View Profile').closest('a');

    expect(browseBooksLink).toHaveAttribute('href', '/books');
    expect(viewProfileLink).toHaveAttribute('href', '/profile');
  });

  it('displays tip about minimum reviews', () => {
    render(<InsufficientDataFallback />);

    expect(screen.getByText(/We recommend reviewing at least 3-5 books from different genres/)).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<InsufficientDataFallback className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('displays step descriptions correctly', () => {
    render(<InsufficientDataFallback />);

    expect(screen.getByText('Start by reading books and leaving reviews with ratings. This helps us understand your preferences.')).toBeInTheDocument();
    expect(screen.getByText('Try books from various genres and rate them. This gives our AI more data to work with.')).toBeInTheDocument();
    expect(screen.getByText('Mark books you love as favorites to help us understand your taste better.')).toBeInTheDocument();
  });

  it('displays numbered steps correctly', () => {
    render(<InsufficientDataFallback />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('displays icon correctly', () => {
    render(<InsufficientDataFallback />);

    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
  });
});

