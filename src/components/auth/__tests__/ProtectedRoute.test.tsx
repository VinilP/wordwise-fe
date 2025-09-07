import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";

// Mock the useAuth hook
const mockUseAuth = vi.fn();

// Mock useLocation
const mockUseLocation = vi.fn();

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => mockUseLocation(),
  };
});

const TestComponent = () => <div>Protected Content</div>;
const LoginComponent = () => <div>Login Page</div>;

const renderProtectedRoute = () => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginComponent />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>,
  );
};

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLocation.mockReturnValue({
      pathname: "/",
      search: "",
      hash: "",
      state: null,
      key: "test-key",
    });
  });

  it("should show loading spinner when authentication is loading", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      token: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    renderProtectedRoute();

    // Look for the loading spinner by class - the component uses a large spinner
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("h-32", "w-32");
  });

  it("should render children when user is authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: "1", name: "Test User", email: "test@example.com" },
      token: "test-token",
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    renderProtectedRoute();

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("should redirect to login when user is not authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    renderProtectedRoute();

    // Check that protected content is not rendered when not authenticated
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("should redirect to custom path when specified", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    const CustomRedirectComponent = () => <div>Custom Redirect Page</div>;

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/custom-login" element={<CustomRedirectComponent />} />
          <Route
            path="/"
            element={
              <ProtectedRoute redirectTo="/custom-login">
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>,
    );

    // Check that protected content is not rendered when not authenticated
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});
