import React, { forwardRef } from "react";

interface AccessibleInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  containerClassName?: string;
  onValidation?: (_isValid: boolean) => void;
  "data-testid"?: string;
}

export const AccessibleInput = forwardRef<
  HTMLInputElement,
  AccessibleInputProps
>(
  (
    {
      label,
      error,
      helperText,
      required = false,
      className = "",
      containerClassName = "",
      onValidation: _onValidation,
      id,
      ...props
    },
    ref,
  ) => {

    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const hasError = !!error;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const baseInputClasses =
      "block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors";
    const inputClasses = hasError
      ? `${baseInputClasses} border-red-300 focus:ring-red-500 focus:border-red-500`
      : `${baseInputClasses} border-gray-300 focus:ring-blue-500 focus:border-blue-500`;

    const describedBy = [hasError ? errorId : "", helperText ? helperId : ""]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={`space-y-1 ${containerClassName}`}>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>

        <input
          ref={ref}
          id={inputId}
          className={`${inputClasses} ${className}`}
          aria-invalid={hasError}
          aria-describedby={describedBy || undefined}
          aria-required={required}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          data-testid={props["data-testid"]}
          {...props}
        />

        {hasError && (
          <p
            id={errorId}
            className="text-sm text-red-600"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        {helperText && !hasError && (
          <p id={helperId} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

AccessibleInput.displayName = "AccessibleInput";
