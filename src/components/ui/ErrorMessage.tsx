import React from 'react';

interface ErrorMessageProps {
  error: string;
  id?: string;
  className?: string;
  variant?: 'default' | 'inline' | 'banner';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  id,
  className = '',
  variant = 'default',
}) => {
  const baseClasses = 'text-red-600';
  
  const variantClasses = {
    default: 'text-sm',
    inline: 'text-sm inline',
    banner: 'text-sm bg-red-50 border border-red-200 rounded-md p-3',
  };

  const icon = (
    <svg
      className="h-4 w-4 flex-shrink-0"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  );

  if (variant === 'banner') {
    return (
      <div
        id={id}
        className={`${baseClasses} ${variantClasses.banner} ${className}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="ml-3">
            <p className="font-medium">Error</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <p
      id={id}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      role="alert"
      aria-live="polite"
    >
      {error}
    </p>
  );
};

