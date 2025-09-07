import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AccessibleInput } from '../ui/AccessibleInput';
import { AccessibleButton } from '../ui/AccessibleButton';
import { ErrorMessage } from '../ui/ErrorMessage';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { LoginRequest } from '@/types';

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [submitError, setSubmitError] = useState<string>('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setSubmitError('');
      const loginData: LoginRequest = {
        email: data.email,
        password: data.password,
      };
      
      await login(loginData);
      navigate(from, { replace: true });
    } catch (error: any) {
      setSubmitError(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Sign in to your account
          </h1>
          <p className="text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-1"
            >
              create a new account
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form 
            className="space-y-6" 
            onSubmit={handleSubmit(onSubmit)}
            role="form"
            aria-label="Sign in form"
            noValidate
          >
            <AccessibleInput
              {...register('email')}
              label="Email address"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              required
              placeholder="Enter your email address"
              className="rounded-md"
              data-testid="email-input"
              aria-label="Email address"
            />

            <AccessibleInput
              {...register('password')}
              label="Password"
              type="password"
              autoComplete="current-password"
              error={errors.password?.message}
              required
              placeholder="Enter your password"
              className="rounded-md"
              data-testid="password-input"
              aria-label="Password"
            />

            {submitError && (
              <ErrorMessage
                error={submitError}
                variant="banner"
                role="alert"
                aria-live="assertive"
              />
            )}

            <AccessibleButton
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting || isLoading}
              loadingText="Signing in..."
              className="w-full"
              disabled={isSubmitting || isLoading}
              data-testid="login-button"
            >
              Sign in
            </AccessibleButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;