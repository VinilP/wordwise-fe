import React from "react";

interface SuccessMessageProps {
  message: string;
  id?: string;
  className?: string;
  variant?: "default" | "inline" | "banner";
  onDismiss?: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  id,
  className = "",
  variant = "default",
  onDismiss,
}) => {
  const baseClasses = "text-green-600";

  const variantClasses = {
    default: "text-sm",
    inline: "text-sm inline",
    banner: "text-sm bg-green-50 border border-green-200 rounded-md p-3",
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
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );

  const dismissButton = onDismiss && (
    <button
      type="button"
      className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-100 inline-flex h-6 w-6 items-center justify-center"
      onClick={onDismiss}
      aria-label="Dismiss success message"
    >
      <svg
        className="h-3 w-3"
        fill="none"
        viewBox="0 0 14 14"
        aria-hidden="true"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
        />
      </svg>
    </button>
  );

  if (variant === "banner") {
    return (
      <div
        id={id}
        className={`${baseClasses} ${variantClasses.banner} ${className}`}
        role="status"
        aria-live="polite"
      >
        <div className="flex">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-3 flex-1">
            <p className="font-medium">Success</p>
            <p className="mt-1">{message}</p>
          </div>
          {dismissButton}
        </div>
      </div>
    );
  }

  return (
    <p
      id={id}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </p>
  );
};
