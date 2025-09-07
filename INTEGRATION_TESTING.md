# WordWise Frontend Integration Testing Guide

This guide covers the focused integration testing approach for the WordWise frontend application.

## 🎯 Overview

Our integration tests focus on **specific user workflows** rather than testing the entire application at once. This approach provides:

- **Better Isolation**: Each test focuses on specific functionality
- **Faster Execution**: Component-level tests run faster than full App tests
- **Easier Debugging**: Failures are easier to identify and fix
- **Maintainable**: Tests are more focused and easier to maintain

## 🏗️ Test Structure

```
src/test/integration/
├── auth-workflow-focused.test.tsx      # Authentication workflows
├── book-discovery-workflow.test.tsx    # Book search and discovery
├── review-management-workflow.test.tsx # Review creation and management
└── user-profile-workflow.test.tsx      # User profile management
```

## 🔐 Authentication Workflow Tests

**File**: `src/test/integration/auth-workflow-focused.test.tsx`

### Test Coverage

- **Login Form Workflow**
  - Successful login flow
  - Login failure handling
  - Form validation

- **Registration Form Workflow**
  - Successful registration flow
  - Password confirmation validation
  - Form validation

- **Protected Route Workflow**
  - Unauthenticated user redirection
  - Authenticated user access

### Example Test

```typescript
describe('Login Form Workflow', () => {
  it('should complete successful login flow', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({
      user: createMockUser(),
      token: 'mock-token',
      refreshToken: 'mock-refresh-token',
    });

    render(<LoginForm />, { queryClient });

    // Fill in login form
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // Wait for successful login
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
```

## 📚 Book Discovery Workflow Tests

**File**: `src/test/integration/book-discovery-workflow.test.tsx`

### Test Coverage

- **Book Search Workflow**
  - Search functionality
  - Search results display
  - Search error handling

- **Book Filtering Workflow**
  - Genre filtering
  - Filter clearing
  - Multiple filter combinations

- **Book List Workflow**
  - Book list display
  - Loading states
  - Error states
  - Pagination

- **Book Card Workflow**
  - Book information display
  - Click navigation
  - Rating display

### Example Test

```typescript
describe('Book Search Workflow', () => {
  it('should allow users to search for books', async () => {
    const user = userEvent.setup();
    mockSearchBooks.mockResolvedValue({
      data: mockBooks,
      pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
    });

    render(<BookSearch />, { queryClient });

    // Search for books
    const searchInput = screen.getByPlaceholderText(/search books/i);
    await user.type(searchInput, 'gatsby');

    // Wait for search results
    await waitFor(() => {
      expect(mockSearchBooks).toHaveBeenCalledWith({
        q: 'gatsby',
        page: 1,
        limit: 10,
      });
    });
  });
});
```

## ⭐ Review Management Workflow Tests

**File**: `src/test/integration/review-management-workflow.test.tsx`

### Test Coverage

- **Review Creation Workflow**
  - Review form submission
  - Form validation
  - Error handling

- **Review List Workflow**
  - Review display
  - Loading states
  - Empty states

- **Review Card Workflow**
  - Review information display
  - Edit functionality
  - Delete functionality
  - User permission checks

### Example Test

```typescript
describe('Review Creation Workflow', () => {
  it('should allow users to create a review', async () => {
    const user = userEvent.setup();
    mockCreateReview.mockResolvedValue(mockReviews[0]);

    render(<ReviewForm bookId={mockBook.id} />, { 
      queryClient,
      initialAuthState: { user: mockUser, isAuthenticated: true }
    });

    // Fill in review form
    const ratingInput = screen.getByLabelText(/rating/i);
    const commentTextarea = screen.getByPlaceholderText(/write your review/i);
    const submitButton = screen.getByRole('button', { name: /submit review/i });

    await user.type(ratingInput, '5');
    await user.type(commentTextarea, 'This is an amazing book!');
    await user.click(submitButton);

    // Wait for review to be created
    await waitFor(() => {
      expect(mockCreateReview).toHaveBeenCalledWith({
        bookId: mockBook.id,
        rating: 5,
        comment: 'This is an amazing book!',
      });
    });
  });
});
```

## 👤 User Profile Workflow Tests

**File**: `src/test/integration/user-profile-workflow.test.tsx`

### Test Coverage

- **Profile Information Workflow**
  - Profile display
  - Profile editing
  - Form validation

- **Favorites Management Workflow**
  - Favorites display
  - Add to favorites
  - Remove from favorites
  - Empty favorites state

- **Reviews Management Workflow**
  - User reviews display
  - Review editing from profile
  - Empty reviews state

- **Profile Navigation Workflow**
  - Tab switching
  - Navigation state management

### Example Test

```typescript
describe('Profile Information Workflow', () => {
  it('should allow users to edit their profile', async () => {
    const user = userEvent.setup();
    mockUpdateProfile.mockResolvedValue({ ...mockUser, name: 'Updated Name' });

    render(<ProfilePage />, { 
      queryClient,
      initialAuthState: { user: mockUser, isAuthenticated: true }
    });

    // Click edit profile button
    const editButton = screen.getByText(/edit profile/i);
    await user.click(editButton);

    // Update name
    const nameInput = screen.getByDisplayValue('Test User');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Name');

    // Save changes
    const saveButton = screen.getByRole('button', { name: /save changes/i });
    await user.click(saveButton);

    // Wait for update
    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        name: 'Updated Name',
        email: 'test@example.com',
      });
    });
  });
});
```

## 🛠️ Test Utilities

### Custom Render Function

The integration tests use a custom render function that provides all necessary providers:

```typescript
// src/test/utils/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0 },
      mutations: { retry: false }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Mock Data Factories

```typescript
// Mock data factories for consistent test data
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  ...overrides
});

export const createMockBook = (overrides: Partial<Book> = {}): Book => ({
  id: '1',
  title: 'Test Book',
  author: 'Test Author',
  description: 'Test Description',
  averageRating: 4.5,
  reviewCount: 10,
  ...overrides
});

export const createMockReview = (overrides: Partial<Review> = {}): Review => ({
  id: '1',
  rating: 5,
  comment: 'Great book!',
  user: createMockUser(),
  book: createMockBook(),
  ...overrides
});
```

## 🚀 Running Integration Tests

### Individual Test Files

```bash
# Run specific integration test file
npx vitest run src/test/integration/auth-workflow-focused.test.tsx

# Run all integration tests
npm run test:integration

# Run with verbose output
npx vitest run --reporter=verbose src/test/integration/
```

### Test Development

```bash
# Run tests in watch mode
npx vitest watch src/test/integration/

# Run specific test
npx vitest run --reporter=verbose src/test/integration/auth-workflow-focused.test.tsx --run

# Debug tests
npx vitest run --reporter=verbose src/test/integration/ --inspect-brk
```

## 📋 Best Practices

### 1. Focus on User Workflows

- Test complete user workflows, not individual components
- Focus on business logic and user interactions
- Avoid testing implementation details

### 2. Use Proper Mocking

- Mock external services and APIs
- Use consistent mock data
- Mock router functions for navigation tests

### 3. Test Error States

- Test both success and failure scenarios
- Verify error messages are displayed correctly
- Test loading states and timeouts

### 4. Maintain Test Isolation

- Each test should be independent
- Clean up after each test
- Use proper setup and teardown

### 5. Use Descriptive Test Names

```typescript
// Good
it('should complete successful login flow')

// Bad
it('should work')
```

### 6. Test User Interactions

- Use `userEvent` for realistic user interactions
- Test keyboard navigation
- Test form submissions and validations

## 🔧 Troubleshooting

### Common Issues

1. **"Element type is invalid" errors**
   - Check component imports and exports
   - Verify all dependencies are properly mocked

2. **Async test failures**
   - Use `waitFor` for async operations
   - Ensure proper async/await usage

3. **Mock service not called**
   - Verify mock setup
   - Check service integration

4. **Router navigation issues**
   - Mock router functions properly
   - Use `BrowserRouter` in test setup

### Debug Tips

```bash
# Run with debug output
npx vitest run --reporter=verbose src/test/integration/

# Run specific test with debug
npx vitest run --reporter=verbose src/test/integration/auth-workflow-focused.test.tsx --run

# Use browser dev tools
npm run test:integration -- --ui
```

## 📚 Related Documentation

- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Comprehensive testing guide
- [COMPREHENSIVE_TESTING_GUIDE.md](./COMPREHENSIVE_TESTING_GUIDE.md) - Full testing strategy
- [README.md](./README.md) - Project overview and setup

---

## 🎯 Summary

The focused integration testing approach provides:

- **Better Test Isolation**: Each workflow is tested independently
- **Faster Execution**: Component-level tests run faster than full App tests
- **Easier Debugging**: Failures are easier to identify and fix
- **Maintainable Tests**: Tests are more focused and easier to maintain
- **Comprehensive Coverage**: All critical user workflows are covered

This approach complements unit tests and E2E tests to provide comprehensive coverage of the WordWise application.
