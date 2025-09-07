/**
 * Accessibility utilities for the WordWise application
 */

// Focus management utilities
export const focusManagement = {
  /**
   * Trap focus within a container element
   */
  trapFocus: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener("keydown", handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener("keydown", handleTabKey);
    };
  },

  /**
   * Restore focus to a previously focused element
   */
  restoreFocus: (element: HTMLElement | null) => {
    if (element) {
      element.focus();
    }
  },

  /**
   * Get the currently focused element
   */
  getCurrentFocus: (): HTMLElement | null => {
    return document.activeElement as HTMLElement;
  },
};

// ARIA utilities
export const ariaUtils = {
  /**
   * Generate unique IDs for ARIA relationships
   */
  generateId: (prefix: string = "aria"): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Set ARIA attributes for form validation
   */
  setValidationAttributes: (
    element: HTMLElement,
    isValid: boolean,
    errorMessage?: string,
  ) => {
    element.setAttribute("aria-invalid", isValid ? "false" : "true");
    if (errorMessage) {
      element.setAttribute("aria-describedby", errorMessage);
    }
  },

  /**
   * Announce changes to screen readers
   */
  announce: (message: string, priority: "polite" | "assertive" = "polite") => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },
};

// Keyboard navigation utilities
export const keyboardNavigation = {
  /**
   * Handle arrow key navigation for lists
   */
  handleArrowNavigation: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
  ): number => {
    let newIndex = currentIndex;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        newIndex = Math.min(currentIndex + 1, items.length - 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        newIndex = Math.max(currentIndex - 1, 0);
        break;
      case "Home":
        event.preventDefault();
        newIndex = 0;
        break;
      case "End":
        event.preventDefault();
        newIndex = items.length - 1;
        break;
    }

    if (newIndex !== currentIndex) {
      items[newIndex]?.focus();
    }

    return newIndex;
  },

  /**
   * Handle Enter and Space key activation
   */
  handleActivation: (event: KeyboardEvent, callback: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  },
};

// Screen reader utilities
export const screenReader = {
  /**
   * Hide element visually but keep it accessible to screen readers
   */
  srOnly: "sr-only",

  /**
   * Show element only to screen readers
   */
  srOnlyClass: "sr-only",

  /**
   * Skip link for keyboard navigation
   */
  createSkipLink: (targetId: string, text: string = "Skip to main content") => {
    const skipLink = document.createElement("a");
    skipLink.href = `#${targetId}`;
    skipLink.textContent = text;
    skipLink.className =
      "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50";
    return skipLink;
  },
};

// Color contrast utilities
export const colorContrast = {
  /**
   * Check if color combination meets WCAG AA standards
   */
  meetsWCAGAA: (foreground: string, background: string): boolean => {
    // This is a simplified check - in production, use a proper color contrast library
    const getLuminance = (color: string): number => {
      // Simplified luminance calculation
      const hex = color.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;

      const [rs, gs, bs] = [r, g, b].map((c) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
      );

      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    const contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    return contrast >= 4.5; // WCAG AA standard
  },
};

// Form validation utilities
export const formValidation = {
  /**
   * Validate email format
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   */
  validatePassword: (
    password: string,
  ): {
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate required fields
   */
  validateRequired: (value: string | number | boolean): boolean => {
    if (typeof value === "string") {
      return value.trim().length > 0;
    }
    if (typeof value === "number") {
      return !isNaN(value);
    }
    return Boolean(value);
  },
};
