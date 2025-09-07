import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type {
  AuthContextType,
  User,
  LoginRequest,
  RegisterRequest,
} from "@/types";
import { authService, tokenManager } from "@/services";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialAuthState?: {
    user: User | null;
    isAuthenticated: boolean;
  };
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  initialAuthState,
}) => {
  const [user, setUser] = useState<User | null>(initialAuthState?.user || null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!initialAuthState);

  // Initialize auth state from localStorage
  useEffect(() => {
    // Skip initialization if initialAuthState is provided (for testing)
    if (initialAuthState) {
      setIsLoading(false);
      return;
    }

    const initializeAuth = async () => {
      try {
        const storedToken = tokenManager.getToken();
        const storedUser = tokenManager.getUser();

        console.log("🔍 Auth initialization:", {
          hasToken: !!storedToken,
          hasUser: !!storedUser,
          tokenLength: storedToken?.length || 0,
        });

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);

          // Only validate token if backend is available
          try {
            console.log("🔄 Validating token with backend...");
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            console.log("✅ Token validation successful");
          } catch (error) {
            console.log("❌ Token validation failed:", {
              status: error.response?.status,
              message: error.message,
              isNetworkError: !error.response,
            });

            // Only logout if it's a 401 (unauthorized) error
            if (error.response?.status === 401) {
              console.error(
                "🚪 Token validation failed - user will be logged out:",
                error,
              );
              await logout();
            } else {
              // For other errors (network, server down), keep user logged in
              console.warn(
                "⚠️ Token validation failed but keeping user logged in:",
                error,
              );
            }
          }
        } else {
          console.log("ℹ️ No stored token or user found");
        }
      } catch (error) {
        console.error("💥 Auth initialization error:", error);
        // Don't auto-logout on initialization errors
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setToken(response.accessToken);
      // Tokens are already stored in localStorage by authService.login()
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      setToken(response.accessToken);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setToken(null);
      // Tokens are already cleared by authService.logout()
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user && !!token && !!tokenManager.getToken();

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
