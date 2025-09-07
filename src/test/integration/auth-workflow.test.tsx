import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { QueryClient } from '@tanstack/react-query';
import { App } from '@/App';
import { createMockUser } from '@/test/utils/test-utils';

// Mock router functions
const mockNavigate = vi.fn();
const mockLocation = vi.fn(() => ({ pathname: '/', search: '', hash: '', state: null }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation(),
    // Keep the actual BrowserRouter for proper context
    BrowserRouter: actual.BrowserRouter,
  };
});

describe('Authentication Workflow Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: 0 },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  describe('Login Workflow', () => {
    it('should complete successful login flow', async () => {
      const user = userEvent.setup();
      
      render(<App />, { queryClient });

      // Navigate to login page
      const loginLink = screen.getByText(/sign in/i);
      await user.click(loginLink);

      // Fill in login form
      const emailInput = screen.getByPlaceholderText(/email address/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Wait for successful login
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
      });

      // Verify user is logged in by checking for user-specific elements
      await waitFor(() => {
        expect(screen.getByText(/welcome/i)).toBeInTheDocument();
      });
    });

    it('should handle login failure gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock failed login
      vi.doMock('@/services', () => ({
        authService: {
          login: vi.fn().mockRejectedValue(new Error('Invalid credentials')),
        },
      }));

      render(<App />, { queryClient });

      const loginLink = screen.getByText(/sign in/i);
      await user.click(loginLink);

      const emailInput = screen.getByPlaceholderText(/email address/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'wrong@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });

      // Verify user is still on login page
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should validate form fields before submission', async () => {
      const user = userEvent.setup();
      
      render(<App />, { queryClient });

      const loginLink = screen.getByText(/sign in/i);
      await user.click(loginLink);

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      // Check for validation errors
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Registration Workflow', () => {
    it('should complete successful registration flow', async () => {
      const user = userEvent.setup();
      
      render(<App />, { queryClient });

      // Navigate to registration page
      const registerLink = screen.getByText(/create.*account/i);
      await user.click(registerLink);

      // Fill in registration form
      const nameInput = screen.getByPlaceholderText(/full name/i);
      const emailInput = screen.getByPlaceholderText(/email address/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(nameInput, 'New User');
      await user.type(emailInput, 'newuser@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');
      await user.click(submitButton);

      // Wait for successful registration
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
      });

      // Verify user is logged in
      await waitFor(() => {
        expect(screen.getByText(/welcome/i)).toBeInTheDocument();
      });
    });

    it('should validate password confirmation', async () => {
      const user = userEvent.setup();
      
      render(<App />, { queryClient });

      const registerLink = screen.getByText(/create.*account/i);
      await user.click(registerLink);

      const nameInput = screen.getByPlaceholderText(/full name/i);
      const emailInput = screen.getByPlaceholderText(/email address/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      await user.type(nameInput, 'New User');
      await user.type(emailInput, 'newuser@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'differentpassword');
      await user.click(submitButton);

      // Check for password mismatch error
      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });
  });

  describe('Logout Workflow', () => {
    it('should complete logout flow', async () => {
      const user = userEvent.setup();
      const mockUser = createMockUser();
      
      render(<App />, { 
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true }
      });

      // Wait for user to be logged in
      await waitFor(() => {
        expect(screen.getByText(/welcome/i)).toBeInTheDocument();
      });

      // Click logout button
      const logoutButton = screen.getByText(/sign out/i);
      await user.click(logoutButton);

      // Wait for logout confirmation
      await waitFor(() => {
        expect(screen.getByText(/sign in/i)).toBeInTheDocument();
      });

      // Verify user is logged out
      expect(screen.queryByText(/welcome/i)).not.toBeInTheDocument();
    });
  });

  describe('Protected Route Workflow', () => {
    it('should redirect unauthenticated users to login', async () => {
      render(<App />, { queryClient });

      // Try to access protected route
      const protectedLink = screen.getByText(/profile/i);
      await userEvent.click(protectedLink);

      // Should redirect to login
      await waitFor(() => {
        expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
      });
    });

    it('should allow authenticated users to access protected routes', async () => {
      const mockUser = createMockUser();
      
      render(<App />, { 
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true }
      });

      // Wait for user to be logged in
      await waitFor(() => {
        expect(screen.getByText(/welcome/i)).toBeInTheDocument();
      });

      // Access protected route
      const protectedLink = screen.getByText(/profile/i);
      await userEvent.click(protectedLink);

      // Should show protected content
      await waitFor(() => {
        expect(screen.getByText(/profile/i)).toBeInTheDocument();
      });
    });
  });

  describe('Token Refresh Workflow', () => {
    it('should automatically refresh expired tokens', async () => {
      const user = userEvent.setup();
      const mockUser = createMockUser();
      
      // Mock token refresh
      const mockRefreshToken = vi.fn().mockResolvedValue({
        token: 'new-token',
        refreshToken: 'new-refresh-token',
      });

      vi.doMock('@/services', () => ({
        authService: {
          refreshToken: mockRefreshToken,
        },
        tokenManager: {
          getToken: vi.fn().mockReturnValue('expired-token'),
          setToken: vi.fn(),
        },
      }));

      render(<App />, { 
        queryClient,
        initialAuthState: { user: mockUser, isAuthenticated: true }
      });

      // Wait for token refresh to be called
      await waitFor(() => {
        expect(mockRefreshToken).toHaveBeenCalled();
      });
    });
  });
});
