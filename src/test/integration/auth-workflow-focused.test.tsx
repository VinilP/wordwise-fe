import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { QueryClient } from '@tanstack/react-query';
import { LoginForm, RegisterForm, ProtectedRoute } from '@/components/auth';
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
  };
});

// Mock auth service
const mockLogin = vi.fn();
const mockRegister = vi.fn();
const mockLogout = vi.fn();

vi.mock('@/services/authService', () => ({
  login: mockLogin,
  register: mockRegister,
  logout: mockLogout,
}));

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

      // Verify navigation
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });

    it('should handle login failure gracefully', async () => {
      const user = userEvent.setup();
      mockLogin.mockRejectedValue(new Error('Invalid credentials'));

      render(<LoginForm />, { queryClient });

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

      // Verify user is still on login form
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should validate form fields before submission', async () => {
      const user = userEvent.setup();

      render(<LoginForm />, { queryClient });

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      // Check for validation errors
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Registration Form Workflow', () => {
    it('should complete successful registration flow', async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue({
        user: createMockUser(),
        token: 'mock-token',
        refreshToken: 'mock-refresh-token',
      });

      render(<RegisterForm />, { queryClient });

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
        expect(mockRegister).toHaveBeenCalledWith({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
        });
      });

      // Verify navigation
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });

    it('should validate password confirmation', async () => {
      const user = userEvent.setup();

      render(<RegisterForm />, { queryClient });

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

  describe('Protected Route Workflow', () => {
    it('should redirect unauthenticated users to login', () => {
      const TestComponent = () => <div>Protected Content</div>;

      render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>,
        { 
          queryClient,
          initialAuthState: { user: null, isAuthenticated: false }
        }
      );

      // Should redirect to login
      expect(mockNavigate).toHaveBeenCalledWith('/login', { 
        state: { from: { pathname: '/', search: '', hash: '', state: null } }
      });
    });

    it('should allow authenticated users to access protected routes', () => {
      const mockUser = createMockUser();
      const TestComponent = () => <div>Protected Content</div>;

      render(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>,
        { 
          queryClient,
          initialAuthState: { user: mockUser, isAuthenticated: true }
        }
      );

      // Should show protected content
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });
});
