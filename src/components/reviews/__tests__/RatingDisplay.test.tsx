import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RatingDisplay from '../RatingDisplay';

describe('RatingDisplay', () => {
  it('renders the correct number of stars', () => {
    const { container } = render(<RatingDisplay rating={3} />);
    
    // Should render 5 background stars + 3 filled stars (for rating 3)
    const stars = container.querySelectorAll('svg');
    expect(stars).toHaveLength(8); // 5 background + 3 foreground stars
  });

  it('displays the rating value when showValue is true', () => {
    render(<RatingDisplay rating={4.2} showValue />);
    
    expect(screen.getByText('4.2')).toBeInTheDocument();
  });

  it('does not display the rating value when showValue is false', () => {
    render(<RatingDisplay rating={4.2} showValue={false} />);
    
    expect(screen.queryByText('4.2')).not.toBeInTheDocument();
  });

  it('applies the correct size classes', () => {
    const { rerender, container } = render(<RatingDisplay rating={3} size="sm" />);
    
    let stars = container.querySelectorAll('svg');
    expect(stars[0]).toHaveClass('h-4', 'w-4');

    rerender(<RatingDisplay rating={3} size="md" />);
    stars = container.querySelectorAll('svg');
    expect(stars[0]).toHaveClass('h-5', 'w-5');

    rerender(<RatingDisplay rating={3} size="lg" />);
    stars = container.querySelectorAll('svg');
    expect(stars[0]).toHaveClass('h-6', 'w-6');
  });

  it('handles partial ratings correctly', () => {
    const { container } = render(<RatingDisplay rating={3.7} />);
    
    // The component should render stars with appropriate styling for partial ratings
    const stars = container.querySelectorAll('svg');
    expect(stars).toHaveLength(9); // 5 background + 4 foreground stars (3 full + 1 partial)
  });

  it('respects custom maxRating', () => {
    const { container } = render(<RatingDisplay rating={3} maxRating={10} />);
    
    // Should render 10 background + 3 foreground stars (for rating 3)
    const stars = container.querySelectorAll('svg');
    expect(stars).toHaveLength(13); // 10 background + 3 foreground stars
  });

  it('applies custom className', () => {
    const { container } = render(<RatingDisplay rating={3} className="custom-class" showValue />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles zero rating', () => {
    render(<RatingDisplay rating={0} showValue />);
    
    expect(screen.getByText('0.0')).toBeInTheDocument();
  });

  it('handles maximum rating', () => {
    render(<RatingDisplay rating={5} showValue />);
    
    expect(screen.getByText('5.0')).toBeInTheDocument();
  });
});