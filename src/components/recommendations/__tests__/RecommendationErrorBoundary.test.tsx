import { render, screen, fireEvent } from '@testing-library/react';
import { RecommendationErrorBoundary } from '../RecommendationErrorBoundary';

// Mock component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('RecommendationErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for these tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <RecommendationErrorBoundary>
        <ThrowError shouldThrow={false} />
      </RecommendationErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    render(
      <RecommendationErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RecommendationErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('We encountered an unexpected error while loading your recommendations.')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;
    
    render(
      <RecommendationErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </RecommendationErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('calls retry function when Try Again button is clicked', () => {
    render(
      <RecommendationErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RecommendationErrorBoundary>
    );

    const tryAgainButton = screen.getByText('Try Again');
    fireEvent.click(tryAgainButton);

    // After clicking retry, the error boundary should reset and render children
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('reloads page when Refresh Page button is clicked', () => {
    const mockReload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    });

    render(
      <RecommendationErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RecommendationErrorBoundary>
    );

    const refreshButton = screen.getByText('Refresh Page');
    fireEvent.click(refreshButton);

    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('displays error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <RecommendationErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RecommendationErrorBoundary>
    );

    expect(screen.getByText('Error Details (Development)')).toBeInTheDocument();
    expect(screen.getByText('Error: Test error')).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('does not display error details in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <RecommendationErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RecommendationErrorBoundary>
    );

    expect(screen.queryByText('Error Details (Development)')).not.toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('logs error to console', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <RecommendationErrorBoundary>
        <ThrowError shouldThrow={true} />
      </RecommendationErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Recommendation Error Boundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    );
  });
});

