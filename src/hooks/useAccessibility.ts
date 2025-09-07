import { useEffect, useRef, useState, useCallback } from 'react';
import { focusManagement, ariaUtils, keyboardNavigation } from '../utils/accessibility';

/**
 * Hook for managing focus trap in modals and dropdowns
 */
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      // Store the currently focused element
      previousFocusRef.current = focusManagement.getCurrentFocus();
      
      // Trap focus within the container
      const cleanup = focusManagement.trapFocus(containerRef.current);
      
      return () => {
        cleanup();
        // Restore focus to the previously focused element
        if (previousFocusRef.current) {
          focusManagement.restoreFocus(previousFocusRef.current);
        }
      };
    }
  }, [isActive]);

  return containerRef;
};

/**
 * Hook for managing ARIA live regions and announcements
 */
export const useAriaAnnouncements = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    ariaUtils.announce(message, priority);
  }, []);

  return { announce };
};

/**
 * Hook for keyboard navigation in lists
 */
export const useKeyboardNavigation = (items: HTMLElement[], initialIndex: number = 0) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const newIndex = keyboardNavigation.handleArrowNavigation(event, items, currentIndex);
    setCurrentIndex(newIndex);
  }, [items, currentIndex]);

  useEffect(() => {
    if (items.length > 0) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, items.length]);

  return { currentIndex, setCurrentIndex };
};

/**
 * Hook for managing form validation with accessibility
 */
export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((
    name: string,
    value: any,
    validators: Array<(value: any) => string | null>
  ) => {
    const error = validators
      .map(validator => validator(value))
      .find(error => error !== null);

    setErrors(prev => ({
      ...prev,
      [name]: error || '',
    }));

    return !error;
  }, []);

  const setFieldTouched = useCallback((name: string) => {
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const hasErrors = Object.values(errors).some(error => error !== '');
  const isFormValid = !hasErrors;

  return {
    errors,
    touched,
    validateField,
    setFieldTouched,
    clearErrors,
    hasErrors,
    isFormValid,
  };
};

/**
 * Hook for managing loading states with accessibility
 */
export const useLoadingState = (initialState: boolean = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const startLoading = useCallback((message: string = 'Loading...') => {
    setIsLoading(true);
    setLoadingMessage(message);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage('');
  }, []);

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
  };
};

/**
 * Hook for managing error states with accessibility
 */
export const useErrorState = () => {
  const [error, setError] = useState<string | null>(null);
  const [errorId] = useState(() => ariaUtils.generateId('error'));

  const setErrorMessage = useCallback((message: string | null) => {
    setError(message);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    errorId,
    setErrorMessage,
    clearError,
  };
};

/**
 * Hook for managing responsive design
 */
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg');

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 475) setScreenSize('xs');
      else if (width < 640) setScreenSize('sm');
      else if (width < 768) setScreenSize('md');
      else if (width < 1024) setScreenSize('lg');
      else if (width < 1280) setScreenSize('xl');
      else setScreenSize('2xl');
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const isMobile = screenSize === 'xs' || screenSize === 'sm';
  const isTablet = screenSize === 'md';
  const isDesktop = screenSize === 'lg' || screenSize === 'xl' || screenSize === '2xl';

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
  };
};

/**
 * Hook for managing skip links
 */
export const useSkipLinks = () => {
  const skipLinksRef = useRef<HTMLDivElement>(null);

  const addSkipLink = useCallback((targetId: string, text: string) => {
    if (skipLinksRef.current) {
      const skipLink = document.createElement('a');
      skipLink.href = `#${targetId}`;
      skipLink.textContent = text;
      skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50';
      skipLinksRef.current.appendChild(skipLink);
    }
  }, []);

  return { skipLinksRef, addSkipLink };
};

