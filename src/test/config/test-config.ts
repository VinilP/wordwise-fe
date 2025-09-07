export const testConfig = {
  // Test timeouts
  timeouts: {
    default: 10000,
    long: 30000,
    short: 5000,
  },
  
  // Coverage thresholds
  coverage: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    components: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    utils: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  
  // Test data
  testData: {
    user: {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    },
    book: {
      title: 'Test Book',
      author: 'Test Author',
      description: 'Test description',
    },
  },
  
  // Mock API responses
  mockResponses: {
    success: (data: any) => ({ data, status: 200 }),
    error: (message: string, status: number = 500) => ({
      error: { message },
      status,
    }),
  },
  
  // Test utilities
  utils: {
    waitFor: {
      default: 5000,
      long: 10000,
      short: 2000,
    },
    retry: {
      attempts: 3,
      delay: 1000,
    },
  },
  
  // Visual testing
  visual: {
    thresholds: {
      pixelRatio: 1,
      threshold: 0.2,
    },
    viewports: {
      mobile: { width: 375, height: 667 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1024, height: 768 },
      large: { width: 1440, height: 900 },
    },
  },
  
  // Accessibility testing
  accessibility: {
    rules: {
      'color-contrast': { enabled: true },
      'keyboard-navigation': { enabled: true },
      'focus-management': { enabled: true },
    },
  },
};

