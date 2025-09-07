/**
 * Accessibility configuration for WordWise application
 * This file contains accessibility settings and constants
 */

export const ACCESSIBILITY_CONFIG = {
  // Focus management
  focus: {
    outlineWidth: "2px",
    outlineColor: "#3b82f6",
    outlineOffset: "2px",
    transitionDuration: "0.2s",
  },

  // Color contrast ratios (WCAG AA standards)
  contrast: {
    normalText: 4.5,
    largeText: 3.0,
    uiComponents: 3.0,
  },

  // Touch target sizes (WCAG AA standards)
  touchTargets: {
    minimumSize: 44, // pixels
    recommendedSize: 48, // pixels
    spacing: 8, // pixels between targets
  },

  // Animation and motion
  motion: {
    respectReducedMotion: true,
    defaultDuration: "0.3s",
    reducedDuration: "0.01ms",
  },

  // Screen reader announcements
  announcements: {
    defaultPriority: "polite" as "polite" | "assertive",
    errorPriority: "assertive" as "polite" | "assertive",
    successPriority: "polite" as "polite" | "assertive",
  },

  // Keyboard navigation
  keyboard: {
    tabOrder: "logical",
    escapeClosesModals: true,
    arrowKeyNavigation: true,
    homeEndNavigation: true,
  },

  // Form validation
  forms: {
    realTimeValidation: true,
    announceErrors: true,
    announceSuccess: true,
    requiredFieldIndicator: "*",
  },

  // Loading states
  loading: {
    announceLoadingStart: true,
    announceLoadingComplete: true,
    showProgressIndicators: true,
  },

  // Error handling
  errors: {
    announceErrors: true,
    provideRecoveryActions: true,
    showErrorCodes: false,
  },
};

// ARIA labels and messages
export const ARIA_MESSAGES = {
  // Navigation
  navigation: {
    main: "Main navigation",
    mobile: "Mobile navigation menu",
    breadcrumb: "Breadcrumb navigation",
    pagination: "Pagination navigation",
  },

  // Forms
  forms: {
    search: "Book search and filters",
    login: "Sign in form",
    register: "Create account form",
    profile: "Profile settings form",
  },

  // Content
  content: {
    booksGrid: "Books grid",
    bookCard: "Book information",
    loading: "Loading content",
    error: "Error message",
    success: "Success message",
  },

  // Interactive elements
  interactive: {
    button: "Button",
    link: "Link",
    menu: "Menu",
    modal: "Modal dialog",
    dropdown: "Dropdown menu",
  },

  // States
  states: {
    loading: "Loading",
    error: "Error",
    success: "Success",
    required: "Required field",
    optional: "Optional field",
  },
};

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  // Navigation
  skipToMain: "Alt + M",
  skipToNavigation: "Alt + N",
  skipToSearch: "Alt + S",

  // Actions
  openMenu: "Alt + M",
  closeMenu: "Escape",
  submitForm: "Ctrl + Enter",
  cancelAction: "Escape",

  // Content
  nextPage: "Alt + Right Arrow",
  previousPage: "Alt + Left Arrow",
  firstPage: "Alt + Home",
  lastPage: "Alt + End",
};

// Screen reader specific settings
export const SCREEN_READER_CONFIG = {
  // Announcements
  announcePageTitle: true,
  announceNavigationChanges: true,
  announceContentUpdates: true,
  announceFormValidation: true,

  // Navigation
  landmarkNavigation: true,
  headingNavigation: true,
  formFieldNavigation: true,
  linkNavigation: true,

  // Content
  readImageDescriptions: true,
  readTableHeaders: true,
  readFormLabels: true,
  readButtonStates: true,
};

// Color scheme configurations
export const COLOR_SCHEMES = {
  light: {
    primary: "#3b82f6",
    secondary: "#6b7280",
    success: "#059669",
    warning: "#d97706",
    error: "#dc2626",
    background: "#ffffff",
    text: "#111827",
  },
  dark: {
    primary: "#60a5fa",
    secondary: "#9ca3af",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    background: "#111827",
    text: "#f9fafb",
  },
  highContrast: {
    primary: "#0000ff",
    secondary: "#000000",
    success: "#008000",
    warning: "#ff8c00",
    error: "#ff0000",
    background: "#ffffff",
    text: "#000000",
  },
};

// Responsive breakpoints for accessibility
export const RESPONSIVE_BREAKPOINTS = {
  mobile: {
    min: 0,
    max: 767,
    touchTargets: 44,
    fontSize: 16,
  },
  tablet: {
    min: 768,
    max: 1023,
    touchTargets: 44,
    fontSize: 16,
  },
  desktop: {
    min: 1024,
    max: 1439,
    touchTargets: 32,
    fontSize: 14,
  },
  large: {
    min: 1440,
    max: Infinity,
    touchTargets: 32,
    fontSize: 14,
  },
};

// Validation rules for accessibility
export const VALIDATION_RULES = {
  // Form validation
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message:
      "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: "Name must be between 2 and 50 characters",
  },

  // Content validation
  altText: {
    required: true,
    minLength: 5,
    maxLength: 125,
    message: "Alt text must be between 5 and 125 characters",
  },
  heading: {
    required: true,
    minLength: 3,
    maxLength: 100,
    message: "Heading must be between 3 and 100 characters",
  },
};

// Testing configuration
export const TESTING_CONFIG = {
  // Automated testing
  axe: {
    rules: [
      "color-contrast",
      "keyboard-navigation",
      "focus-management",
      "aria-labels",
      "semantic-html",
    ],
    tags: ["wcag2a", "wcag2aa", "wcag21aa"],
  },

  // Manual testing
  manual: {
    screenReaders: ["NVDA", "JAWS", "VoiceOver"],
    browsers: ["Chrome", "Firefox", "Safari", "Edge"],
    devices: ["Desktop", "Mobile", "Tablet"],
  },

  // Performance
  performance: {
    maxLoadTime: 3000, // milliseconds
    maxAnimationDuration: 500, // milliseconds
    maxImageSize: 1024 * 1024, // bytes
  },
};

// Utility functions for accessibility
export const accessibilityUtils = {
  // Generate unique IDs for ARIA relationships
  generateId: (prefix: string = "aria"): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Check if element is visible to screen readers
  isVisibleToScreenReader: (element: HTMLElement): boolean => {
    const style = window.getComputedStyle(element);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      element.getAttribute("aria-hidden") !== "true"
    );
  },

  // Get accessible name for element
  getAccessibleName: (element: HTMLElement): string => {
    const label = element.getAttribute("aria-label");
    if (label) return label;

    const labelledBy = element.getAttribute("aria-labelledby");
    if (labelledBy) {
      const labelElement = document.getElementById(labelledBy);
      if (labelElement) return labelElement.textContent || "";
    }

    const labelElement = element.closest("label");
    if (labelElement) return labelElement.textContent || "";

    return element.textContent || "";
  },

  // Check if color combination meets contrast requirements
  meetsContrastRatio: (
    foreground: string,
    background: string,
    ratio: number = 4.5,
  ): boolean => {
    // This is a simplified check - in production, use a proper color contrast library
    const getLuminance = (color: string): number => {
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

    return contrast >= ratio;
  },

  // Announce message to screen readers
  announce: (
    message: string,
    priority: "polite" | "assertive" = "polite",
  ): void => {
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

export default ACCESSIBILITY_CONFIG;
