import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Loading content');
    
    const svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('animate-spin');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    
    expect(screen.getByText('Loading...', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('Loading...', { selector: '.sr-only' })).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Please wait..." />);
    
    expect(screen.getByText('Please wait...', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('Please wait...', { selector: '.sr-only' })).toBeInTheDocument();
  });

  it('renders with custom aria-label', () => {
    render(<LoadingSpinner aria-label="Loading books from the library" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading books from the library');
  });

  it('renders without text when text prop is empty', () => {
    render(<LoadingSpinner text="" />);
    
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText('', { selector: '.sr-only' })).not.toBeInTheDocument();
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    
    let svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('h-4', 'w-4');
    expect(svg?.parentElement?.querySelector('p')).toHaveClass('text-sm');
    
    rerender(<LoadingSpinner size="md" />);
    svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('h-8', 'w-8');
    expect(svg?.parentElement?.querySelector('p')).toHaveClass('text-base');
    
    rerender(<LoadingSpinner size="lg" />);
    svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('h-12', 'w-12');
    expect(svg?.parentElement?.querySelector('p')).toHaveClass('text-lg');
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-spinner-class" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('custom-spinner-class');
  });

  it('has proper accessibility attributes', () => {
    render(<LoadingSpinner text="Loading data" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('role', 'status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading content');
    
    const svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders spinner with correct SVG structure', () => {
    render(<LoadingSpinner />);
    
    const svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    
    const circle = svg?.querySelector('circle');
    expect(circle).toBeInTheDocument();
    expect(circle).toHaveClass('opacity-25');
    
    const path = svg?.querySelector('path');
    expect(path).toBeInTheDocument();
    expect(path).toHaveClass('opacity-75');
  });

  it('has proper text structure for screen readers', () => {
    render(<LoadingSpinner text="Loading books" />);
    
    const visibleText = screen.getByText('Loading books', { selector: 'p' });
    const srOnlyText = screen.getByText('Loading books', { selector: '.sr-only' });
    
    expect(visibleText).toBeInTheDocument();
    expect(srOnlyText).toBeInTheDocument();
    expect(srOnlyText).toHaveClass('sr-only');
  });
});
