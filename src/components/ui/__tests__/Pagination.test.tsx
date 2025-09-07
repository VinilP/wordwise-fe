import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Pagination } from '../Pagination';

const mockOnPageChange = vi.fn();

describe('Pagination', () => {
  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('renders pagination controls correctly', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNextPage={true}
        hasPreviousPage={true}
      />
    );

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('highlights current page correctly', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNextPage={true}
        hasPreviousPage={true}
      />
    );

    const currentPageButton = screen.getByRole('button', { name: 'Go to page 3' });
    expect(currentPageButton).toHaveClass('bg-blue-600', 'text-white');
  });

  it('disables Previous button when on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNextPage={true}
        hasPreviousPage={false}
      />
    );

    const previousButton = screen.getByRole('button', { name: /Go to previous page/ });
    expect(previousButton).toBeDisabled();
    expect(previousButton).toHaveClass('cursor-not-allowed');
  });

  it('disables Next button when on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNextPage={false}
        hasPreviousPage={true}
      />
    );

    const nextButton = screen.getByRole('button', { name: /Go to next page/ });
    expect(nextButton).toBeDisabled();
    expect(nextButton).toHaveClass('cursor-not-allowed');
  });

  it('calls onPageChange when clicking page numbers', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNextPage={true}
        hasPreviousPage={true}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Go to page 3' }));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when clicking Previous button', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNextPage={true}
        hasPreviousPage={true}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Go to previous page/ }));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when clicking Next button', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNextPage={true}
        hasPreviousPage={true}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Go to next page/ }));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('shows ellipsis for large page ranges', () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={20}
        onPageChange={mockOnPageChange}
        hasNextPage={true}
        hasPreviousPage={true}
      />
    );

    const ellipsis = screen.getAllByText('...');
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it('does not render when totalPages is 1 or less', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
        hasNextPage={false}
        hasPreviousPage={false}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNextPage={true}
        hasPreviousPage={true}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('sets correct aria-current for current page', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNextPage={true}
        hasPreviousPage={true}
      />
    );

    const currentPageButton = screen.getByRole('button', { name: 'Go to page 3' });
    expect(currentPageButton).toHaveAttribute('aria-current', 'page');
  });

  it('has proper accessibility labels', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNextPage={true}
        hasPreviousPage={true}
      />
    );

    expect(screen.getByLabelText('Pagination Navigation')).toBeInTheDocument();
    expect(screen.getByLabelText(/Go to previous page/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Go to next page/)).toBeInTheDocument();
    expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument();
  });
});