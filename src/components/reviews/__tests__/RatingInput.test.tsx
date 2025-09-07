import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RatingInput from '../RatingInput';

describe('RatingInput', () => {
  it('renders the correct number of star buttons', () => {
    const mockOnChange = vi.fn();
    render(<RatingInput value={0} onChange={mockOnChange} />);
    
    // Should render 5 star buttons (default maxRating)
    const starButtons = screen.getAllByRole('button');
    expect(starButtons).toHaveLength(5);
  });

  it('calls onChange when a star is clicked', () => {
    const mockOnChange = vi.fn();
    render(<RatingInput value={0} onChange={mockOnChange} />);
    
    const thirdStar = screen.getByLabelText('Rate 3 out of 5 stars');
    fireEvent.click(thirdStar);
    
    expect(mockOnChange).toHaveBeenCalledWith(3);
  });

  it('displays the current rating value', () => {
    const mockOnChange = vi.fn();
    render(<RatingInput value={4} onChange={mockOnChange} />);
    
    expect(screen.getByText('(4 out of 5)')).toBeInTheDocument();
  });

  it('does not display rating value when value is 0', () => {
    const mockOnChange = vi.fn();
    render(<RatingInput value={0} onChange={mockOnChange} />);
    
    expect(screen.queryByText(/out of/)).not.toBeInTheDocument();
  });

  it('shows hover effects on mouse enter and leave', () => {
    const mockOnChange = vi.fn();
    render(<RatingInput value={2} onChange={mockOnChange} />);
    
    const fourthStar = screen.getByLabelText('Rate 4 out of 5 stars');
    
    // Hover over fourth star
    fireEvent.mouseEnter(fourthStar);
    
    // Should highlight stars 1-4
    const stars = screen.getAllByRole('button');
    expect(stars[3]).toHaveClass('text-yellow-400');
    
    // Mouse leave should reset to original value
    fireEvent.mouseLeave(fourthStar);
    expect(stars[3]).toHaveClass('text-gray-300');
  });

  it('disables interaction when disabled prop is true', () => {
    const mockOnChange = vi.fn();
    render(<RatingInput value={2} onChange={mockOnChange} disabled />);
    
    const thirdStar = screen.getByLabelText('Rate 3 out of 5 stars');
    fireEvent.click(thirdStar);
    
    expect(mockOnChange).not.toHaveBeenCalled();
    expect(thirdStar).toBeDisabled();
  });

  it('displays error message when provided', () => {
    const mockOnChange = vi.fn();
    render(<RatingInput value={0} onChange={mockOnChange} error="Please select a rating" />);
    
    expect(screen.getByText('Please select a rating')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const mockOnChange = vi.fn();
    const { rerender } = render(<RatingInput value={3} onChange={mockOnChange} size="sm" />);
    
    let stars = screen.getAllByRole('button');
    expect(stars[0]).toHaveClass('h-6', 'w-6');

    rerender(<RatingInput value={3} onChange={mockOnChange} size="md" />);
    stars = screen.getAllByRole('button');
    expect(stars[0]).toHaveClass('h-8', 'w-8');

    rerender(<RatingInput value={3} onChange={mockOnChange} size="lg" />);
    stars = screen.getAllByRole('button');
    expect(stars[0]).toHaveClass('h-10', 'w-10');
  });

  it('respects custom maxRating', () => {
    const mockOnChange = vi.fn();
    render(<RatingInput value={0} onChange={mockOnChange} maxRating={10} />);
    
    const starButtons = screen.getAllByRole('button');
    expect(starButtons).toHaveLength(10);
  });

  it('has proper accessibility attributes', () => {
    const mockOnChange = vi.fn();
    render(<RatingInput value={0} onChange={mockOnChange} />);
    
    const firstStar = screen.getByLabelText('Rate 1 out of 5 stars');
    expect(firstStar).toHaveAttribute('type', 'button');
    expect(firstStar).toHaveAttribute('aria-label', 'Rate 1 out of 5 stars');
  });
});