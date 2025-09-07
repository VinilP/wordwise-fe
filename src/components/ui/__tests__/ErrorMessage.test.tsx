import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import { ErrorMessage } from '../ErrorMessage';

describe('ErrorMessage', () => {
  it('renders with default variant', () => {
    render(<ErrorMessage error="Something went wrong" />);
    
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Something went wrong');
    expect(errorMessage).toHaveClass('text-red-600', 'text-sm');
    expect(errorMessage).toHaveAttribute('aria-live', 'polite');
  });

  it('renders with inline variant', () => {
    render(<ErrorMessage error="Field is required" variant="inline" />);
    
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Field is required');
    expect(errorMessage).toHaveClass('text-red-600', 'text-sm', 'inline');
    expect(errorMessage).toHaveAttribute('aria-live', 'polite');
  });

  it('renders with banner variant', () => {
    render(<ErrorMessage error="System error occurred" variant="banner" />);
    
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('System error occurred');
    expect(errorMessage).toHaveClass(
      'text-red-600',
      'text-sm',
      'bg-red-50',
      'border',
      'border-red-200',
      'rounded-md',
      'p-3'
    );
    expect(errorMessage).toHaveAttribute('aria-live', 'assertive');
  });

  it('renders with custom id', () => {
    render(<ErrorMessage error="Test error" id="error-1" />);
    
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveAttribute('id', 'error-1');
  });

  it('renders with custom className', () => {
    render(<ErrorMessage error="Test error" className="custom-error-class" />);
    
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveClass('custom-error-class');
  });

  it('renders banner variant with proper structure', () => {
    render(<ErrorMessage error="Banner error" variant="banner" />);
    
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    
    // Check for icon
    const icon = errorMessage.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('h-4', 'w-4', 'flex-shrink-0');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    
    // Check for error text structure
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Banner error')).toBeInTheDocument();
  });

  it('renders non-banner variants without icon', () => {
    render(<ErrorMessage error="Simple error" variant="default" />);
    
    const errorMessage = screen.getByRole('alert');
    const icon = errorMessage.querySelector('svg');
    expect(icon).not.toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Simple error');
  });

  it('has proper accessibility attributes for different variants', () => {
    const { rerender } = render(<ErrorMessage error="Test" variant="default" />);
    
    let errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveAttribute('role', 'alert');
    expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    
    rerender(<ErrorMessage error="Test" variant="inline" />);
    errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    
    rerender(<ErrorMessage error="Test" variant="banner" />);
    errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveAttribute('aria-live', 'assertive');
  });

  it('renders error icon with correct SVG structure', () => {
    render(<ErrorMessage error="Test error" variant="banner" />);
    
    const icon = screen.getByRole('alert').querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('fill', 'currentColor');
    expect(icon).toHaveAttribute('viewBox', '0 0 20 20');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    
    const path = icon?.querySelector('path');
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute('fill-rule', 'evenodd');
    expect(path).toHaveAttribute('clip-rule', 'evenodd');
  });

  it('handles empty error message', () => {
    render(<ErrorMessage error="" />);
    
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('');
  });

  it('applies correct styling for each variant', () => {
    const { rerender } = render(<ErrorMessage error="Test" variant="default" />);
    let errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveClass('text-red-600', 'text-sm');
    expect(errorMessage).not.toHaveClass('bg-red-50', 'border', 'rounded-md', 'p-3', 'inline');
    
    rerender(<ErrorMessage error="Test" variant="inline" />);
    errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveClass('text-red-600', 'text-sm', 'inline');
    expect(errorMessage).not.toHaveClass('bg-red-50', 'border', 'rounded-md', 'p-3');
    
    rerender(<ErrorMessage error="Test" variant="banner" />);
    errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveClass(
      'text-red-600',
      'text-sm',
      'bg-red-50',
      'border',
      'border-red-200',
      'rounded-md',
      'p-3'
    );
    expect(errorMessage).not.toHaveClass('inline');
  });
});

