import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BookSearch } from '../BookSearch';
import { SearchFilters } from '../../../types';

const mockOnSearch = vi.fn();

describe('BookSearch', () => {
  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('renders search input and filter toggle', () => {
    render(<BookSearch onSearch={mockOnSearch} />);

    expect(screen.getByPlaceholderText('Search books by title or author...')).toBeInTheDocument();
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('shows and hides filters panel when toggle is clicked', async () => {
    const user = userEvent.setup();
    
    render(<BookSearch onSearch={mockOnSearch} />);

    const filtersButton = screen.getByText('Filters');
    
    // Filters should be hidden initially
    expect(screen.queryByText('Genres')).not.toBeInTheDocument();

    // Click to show filters
    await user.click(filtersButton);
    expect(screen.getByText('Genres')).toBeInTheDocument();
    expect(screen.getByText('Minimum Rating')).toBeInTheDocument();
    expect(screen.getByText('Published Year')).toBeInTheDocument();

    // Click to hide filters
    await user.click(filtersButton);
    expect(screen.queryByText('Genres')).not.toBeInTheDocument();
  });

  it('shows active filter indicator when search query is entered', async () => {
    const user = userEvent.setup();
    
    render(<BookSearch onSearch={mockOnSearch} />);

    const searchInput = screen.getByPlaceholderText('Search books by title or author...');
    await user.type(searchInput, 'test');

    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows active filter indicator when filters are applied', async () => {
    const user = userEvent.setup();
    
    render(<BookSearch onSearch={mockOnSearch} />);

    // Show filters and select a genre
    await user.click(screen.getByText('Filters'));
    await user.click(screen.getByText('Fiction'));

    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('clears search input when clear button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<BookSearch onSearch={mockOnSearch} />);

    // Add some text to search
    const searchInput = screen.getByPlaceholderText('Search books by title or author...');
    await user.type(searchInput, 'test');

    // Clear all filters
    await user.click(screen.getByText('Clear all'));

    expect(searchInput).toHaveValue('');
  });

  it('initializes with provided initial filters', () => {
    const initialFilters: SearchFilters = {
      query: 'initial query',
      genres: ['Fiction', 'Mystery'],
      minRating: 3,
      publishedYear: 2022,
    };

    render(<BookSearch onSearch={mockOnSearch} initialFilters={initialFilters} />);

    expect(screen.getByDisplayValue('initial query')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <BookSearch onSearch={mockOnSearch} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles genre selection correctly', async () => {
    const user = userEvent.setup();
    
    render(<BookSearch onSearch={mockOnSearch} />);

    // Show filters
    await user.click(screen.getByText('Filters'));

    // Select a genre
    const fictionButton = screen.getByText('Fiction');
    await user.click(fictionButton);

    // Genre should be selected (button should have selected styling)
    expect(fictionButton).toHaveClass('bg-blue-600', 'text-white');

    // Deselect the genre
    await user.click(fictionButton);
    expect(fictionButton).toHaveClass('bg-gray-100', 'text-gray-700');
  });

  it('handles multiple genre selections', async () => {
    const user = userEvent.setup();
    
    render(<BookSearch onSearch={mockOnSearch} />);

    // Show filters
    await user.click(screen.getByText('Filters'));

    // Select multiple genres
    const fictionButton = screen.getByText('Fiction');
    const mysteryButton = screen.getByText('Mystery');
    
    await user.click(fictionButton);
    await user.click(mysteryButton);

    // Both genres should be selected
    expect(fictionButton).toHaveClass('bg-blue-600', 'text-white');
    expect(mysteryButton).toHaveClass('bg-blue-600', 'text-white');
  });

  it('handles minimum rating filter selection', async () => {
    const user = userEvent.setup();
    
    render(<BookSearch onSearch={mockOnSearch} />);

    // Show filters
    await user.click(screen.getByText('Filters'));

    // Select minimum rating
    const ratingSelect = screen.getByDisplayValue('Any rating');
    await user.selectOptions(ratingSelect, '4');

    expect(ratingSelect).toHaveValue('4');
  });

  it('handles published year filter input', async () => {
    const user = userEvent.setup();
    
    render(<BookSearch onSearch={mockOnSearch} />);

    // Show filters
    await user.click(screen.getByText('Filters'));

    // Enter published year
    const yearInput = screen.getByPlaceholderText('e.g., 2020');
    await user.type(yearInput, '2023');

    expect(yearInput).toHaveValue(2023);
  });

  it('calls onSearch when search input changes', async () => {
    const user = userEvent.setup();
    
    render(<BookSearch onSearch={mockOnSearch} />);

    const searchInput = screen.getByPlaceholderText('Search books by title or author...');
    
    // Simulate typing (this will trigger the debounced search)
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    // Wait a bit for debounced call
    await new Promise(resolve => setTimeout(resolve, 350));

    expect(mockOnSearch).toHaveBeenCalledWith({
      query: 'test query',
    });
  });

  it('renders all available genres', async () => {
    const user = userEvent.setup();
    
    render(<BookSearch onSearch={mockOnSearch} />);

    // Show filters
    await user.click(screen.getByText('Filters'));

    // Check that common genres are available
    expect(screen.getByText('Fiction')).toBeInTheDocument();
    expect(screen.getByText('Non-Fiction')).toBeInTheDocument();
    expect(screen.getByText('Mystery')).toBeInTheDocument();
    expect(screen.getByText('Romance')).toBeInTheDocument();
    expect(screen.getByText('Science Fiction')).toBeInTheDocument();
    expect(screen.getByText('Fantasy')).toBeInTheDocument();
  });
});