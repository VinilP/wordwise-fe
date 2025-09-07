import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { Book, Review, User, Recommendation } from "@/types";

// Test wrapper with all necessary providers
interface TestWrapperProps {
  children: React.ReactNode;
  initialAuthState?: {
    user: User | null;
    isAuthenticated: boolean;
  };
  queryClient?: QueryClient;
}

const TestWrapper: React.FC<TestWrapperProps> = ({
  children,
  initialAuthState = { user: null, isAuthenticated: false },
  queryClient,
}) => {
  const defaultQueryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
      mutations: { retry: false },
    },
  });

  const client = queryClient || defaultQueryClient;

  return (
    <QueryClientProvider client={client}>
      <AuthProvider initialAuthState={initialAuthState}>
        <BrowserRouter>{children}</BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// Custom render function
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    initialAuthState?: {
      user: User | null;
      isAuthenticated: boolean;
    };
    queryClient?: QueryClient;
  },
) => {
  const { initialAuthState, queryClient, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <TestWrapper
        initialAuthState={initialAuthState}
        queryClient={queryClient}
      >
        {children}
      </TestWrapper>
    ),
    ...renderOptions,
  });
};

// Mock data factories
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: "1",
  email: "test@example.com",
  name: "Test User",
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
  ...overrides,
});

export const createMockBook = (overrides: Partial<Book> = {}): Book => ({
  id: "1",
  title: "Test Book",
  author: "Test Author",
  description: "Test description",
  coverImageUrl: "https://example.com/cover.jpg",
  genres: ["Fiction", "Drama"],
  publishedYear: 2023,
  averageRating: 4.2,
  reviewCount: 10,
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
  ...overrides,
});

export const createMockReview = (overrides: Partial<Review> = {}): Review => ({
  id: "1",
  bookId: "1",
  userId: "1",
  rating: 5,
  comment: "Great book!",
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
  user: createMockUser(),
  book: createMockBook(),
  ...overrides,
});

export const createMockRecommendation = (
  overrides: Partial<Recommendation> = {},
): Recommendation => ({
  id: "1",
  userId: "1",
  bookId: "1",
  reason: "Based on your reading history",
  score: 0.95,
  createdAt: "2023-01-01T00:00:00Z",
  book: createMockBook(),
  ...overrides,
});

// Test helpers
export const waitForLoadingToFinish = async () => {
  const { waitFor } = await import("@testing-library/react");
  await waitFor(() => {
    expect(
      document.querySelector('[data-testid="loading-spinner"]'),
    ).not.toBeInTheDocument();
  });
};

export const expectElementToBeInDocument = (text: string | RegExp) => {
  const { screen } = require("@testing-library/react");
  expect(screen.getByText(text)).toBeInTheDocument();
};

export const expectElementNotToBeInDocument = (text: string | RegExp) => {
  const { screen } = require("@testing-library/react");
  expect(screen.queryByText(text)).not.toBeInTheDocument();
};

// Re-export everything from testing library
export * from "@testing-library/react";
export { customRender as render };
