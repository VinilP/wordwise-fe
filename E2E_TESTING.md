# WordWise E2E Testing Guide

This guide covers the end-to-end testing strategy using Playwright for the WordWise frontend application.

## 🎯 Overview

Our E2E tests use **Playwright** to test complete user workflows across the entire application. These tests run in real browsers and test the full stack integration, providing confidence that the application works as expected from a user's perspective.

## 🏗️ Test Structure

```
src/test/e2e/
└── complete-user-workflows.spec.ts    # Complete user workflow tests
```

## 🎭 Playwright Configuration

**File**: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/test',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/playwright-results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'e2e-tests',
      testDir: './src/test/e2e',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'visual-tests',
      testDir: './src/test/visual',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'cross-browser',
      testDir: './src/test/e2e',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile',
      testDir: './src/test/e2e',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## 🔐 Authentication Workflow Tests

### Complete Registration and Login Flow

```typescript
test.describe('Authentication Workflow', () => {
  test('should complete full registration and login flow', async ({ page }) => {
    // Start registration
    await page.click('text=Create Account');
    await expect(page).toHaveURL('/register');

    // Fill registration form
    await page.fill('input[placeholder*="Full Name"]', 'Test User');
    await page.fill('input[placeholder*="Email Address"]', 'test@example.com');
    await page.fill('input[placeholder*="Password"]', 'password123');
    await page.fill('input[placeholder*="Confirm Password"]', 'password123');

    // Submit registration
    await page.click('button:has-text("Create Account")');

    // Should redirect to home page after successful registration
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Welcome')).toBeVisible();

    // Logout and login again
    await page.click('button:has-text("Sign Out")');
    await page.click('text=Sign In');
    
    await page.fill('input[placeholder*="Email Address"]', 'test@example.com');
    await page.fill('input[placeholder*="Password"]', 'password123');
    await page.click('button:has-text("Sign In")');

    // Should be logged in again
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('should handle login errors gracefully', async ({ page }) => {
    await page.click('text=Sign In');
    await expect(page).toHaveURL('/login');

    // Try with invalid credentials
    await page.fill('input[placeholder*="Email Address"]', 'wrong@example.com');
    await page.fill('input[placeholder*="Password"]', 'wrongpassword');
    await page.click('button:has-text("Sign In")');

    // Should show error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL('/login'); // Should stay on login page
  });

  test('should protect routes and redirect to login', async ({ page }) => {
    // Try to access protected route without being logged in
    await page.goto('/profile');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
    await expect(page.locator('text=Sign in to your account')).toBeVisible();
  });
});
```

## 📚 Book Discovery Workflow Tests

### Search and Discovery

```typescript
test.describe('Book Discovery Workflow', () => {
  test('should search and discover books', async ({ page }) => {
    // Search for books
    await page.fill('input[placeholder*="Search books"]', 'gatsby');
    await page.press('input[placeholder*="Search books"]', 'Enter');

    // Should show search results
    await expect(page.locator('text=The Great Gatsby')).toBeVisible();
    await expect(page.locator('text=F. Scott Fitzgerald')).toBeVisible();

    // Click on a book
    await page.click('text=The Great Gatsby');

    // Should navigate to book detail page
    await expect(page).toHaveURL(/\/books\/\d+/);
    await expect(page.locator('text=The Great Gatsby')).toBeVisible();
    await expect(page.locator('text=F. Scott Fitzgerald')).toBeVisible();
  });

  test('should filter books by genre', async ({ page }) => {
    // Open filters
    await page.click('button[aria-label*="Show search filters"]');

    // Select a genre filter
    await page.click('button:has-text("Fiction")');

    // Should show filtered results
    await expect(page.locator('text=Fiction')).toBeVisible();

    // Clear filters
    await page.click('text=Clear all');
    await expect(page.locator('text=Fiction')).not.toBeVisible();
  });

  test('should handle pagination', async ({ page }) => {
    // Navigate to books page
    await page.click('text=Books');
    await expect(page).toHaveURL('/books');

    // Should show first page of books
    await expect(page.locator('[data-testid="book-card"]')).toHaveCount.greaterThan(0);

    // Click next page if available
    const nextButton = page.locator('button[aria-label*="Go to page 2"]');
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await expect(page.locator('[data-testid="book-card"]')).toHaveCount.greaterThan(0);
    }
  });
});
```

## ⭐ Review Management Workflow Tests

### Complete Review Lifecycle

```typescript
test.describe('Review Management Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.click('text=Sign In');
    await page.fill('input[placeholder*="Email Address"]', 'test@example.com');
    await page.fill('input[placeholder*="Password"]', 'password123');
    await page.click('button:has-text("Sign In")');
  });

  test('should create, edit, and delete reviews', async ({ page }) => {
    // Navigate to a book detail page
    await page.click('text=Books');
    await page.click('[data-testid="book-card"]:first-child');

    // Create a review
    await page.click('text=Write a Review');
    await page.click('button[data-testid="rating-5"]');
    await page.fill('textarea[placeholder*="Write your review"]', 'This is an amazing book!');
    await page.click('button:has-text("Submit Review")');

    // Should show success message
    await expect(page.locator('text=Review submitted successfully')).toBeVisible();

    // Should show the review in the list
    await expect(page.locator('text=This is an amazing book!')).toBeVisible();

    // Edit the review
    await page.click('button[aria-label*="Edit review"]');
    await page.fill('textarea[placeholder*="Write your review"]', 'Updated review comment');
    await page.click('button:has-text("Save Changes")');

    // Should show updated review
    await expect(page.locator('text=Updated review comment')).toBeVisible();

    // Delete the review
    await page.click('button[aria-label*="Delete review"]');
    await page.click('button:has-text("Delete")');

    // Should show success message
    await expect(page.locator('text=Review deleted successfully')).toBeVisible();
    await expect(page.locator('text=Updated review comment')).not.toBeVisible();
  });

  test('should validate review form', async ({ page }) => {
    // Navigate to a book detail page
    await page.click('text=Books');
    await page.click('[data-testid="book-card"]:first-child');

    // Try to submit review without filling form
    await page.click('text=Write a Review');
    await page.click('button:has-text("Submit Review")');

    // Should show validation errors
    await expect(page.locator('text=Rating is required')).toBeVisible();
    await expect(page.locator('text=Comment is required')).toBeVisible();
  });
});
```

## 👤 User Profile Workflow Tests

### Profile Management

```typescript
test.describe('User Profile Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.click('text=Sign In');
    await page.fill('input[placeholder*="Email Address"]', 'test@example.com');
    await page.fill('input[placeholder*="Password"]', 'password123');
    await page.click('button:has-text("Sign In")');
  });

  test('should manage user profile', async ({ page }) => {
    // Navigate to profile
    await page.click('text=Profile');
    await expect(page).toHaveURL('/profile');

    // Should show profile information
    await expect(page.locator('text=Test User')).toBeVisible();
    await expect(page.locator('text=test@example.com')).toBeVisible();

    // Edit profile
    await page.click('text=Edit Profile');
    await page.fill('input[value="Test User"]', 'Updated Name');
    await page.click('button:has-text("Save Changes")');

    // Should show updated name
    await expect(page.locator('text=Updated Name')).toBeVisible();
  });

  test('should manage favorites', async ({ page }) => {
    // Add a book to favorites
    await page.click('text=Books');
    await page.click('[data-testid="book-card"]:first-child');
    await page.click('button[aria-label*="Add to favorites"]');

    // Should show success message
    await expect(page.locator('text=Added to favorites')).toBeVisible();

    // Navigate to profile favorites
    await page.click('text=Profile');
    await page.click('text=Favorites');

    // Should show the book in favorites
    await expect(page.locator('[data-testid="book-card"]')).toHaveCount.greaterThan(0);

    // Remove from favorites
    await page.click('button[aria-label*="Remove from favorites"]');
    await page.click('button:has-text("Remove")');

    // Should show success message
    await expect(page.locator('text=Removed from favorites')).toBeVisible();
  });

  test('should view user reviews', async ({ page }) => {
    // Navigate to profile reviews
    await page.click('text=Profile');
    await page.click('text=Reviews');

    // Should show reviews tab
    await expect(page.locator('text=Your Reviews')).toBeVisible();
  });
});
```

## 🎯 Recommendations Workflow Tests

### AI and Popular Recommendations

```typescript
test.describe('Recommendations Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.click('text=Sign In');
    await page.fill('input[placeholder*="Email Address"]', 'test@example.com');
    await page.fill('input[placeholder*="Password"]', 'password123');
    await page.click('button:has-text("Sign In")');
  });

  test('should view AI recommendations', async ({ page }) => {
    // Navigate to recommendations
    await page.click('text=Recommendations');
    await expect(page).toHaveURL('/recommendations');

    // Should show AI recommendations tab
    await expect(page.locator('text=AI Recommendations')).toBeVisible();
    await expect(page.locator('text=Personalized AI Recommendations')).toBeVisible();

    // Should show recommendation cards
    await expect(page.locator('[data-testid="recommendation-card"]')).toHaveCount.greaterThan(0);
  });

  test('should view popular books', async ({ page }) => {
    // Navigate to recommendations
    await page.click('text=Recommendations');

    // Switch to popular books tab
    await page.click('text=Popular Books');

    // Should show popular books
    await expect(page.locator('text=Popular & Top-Rated Books')).toBeVisible();
    await expect(page.locator('[data-testid="recommendation-card"]')).toHaveCount.greaterThan(0);
  });

  test('should refresh recommendations', async ({ page }) => {
    // Navigate to recommendations
    await page.click('text=Recommendations');

    // Click refresh button
    await page.click('button:has-text("Refresh")');

    // Should show refreshing state
    await expect(page.locator('text=Refreshing...')).toBeVisible();
  });
});
```

## 📱 Responsive Design Tests

### Mobile and Tablet Testing

```typescript
test.describe('Responsive Design', () => {
  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Should show mobile navigation
    await expect(page.locator('button[aria-label*="Open main menu"]')).toBeVisible();

    // Open mobile menu
    await page.click('button[aria-label*="Open main menu"]');

    // Should show mobile menu items
    await expect(page.locator('text=Books')).toBeVisible();
    await expect(page.locator('text=Sign In')).toBeVisible();
  });

  test('should work on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // Should show tablet layout
    await expect(page.locator('text=WordWise')).toBeVisible();
    await expect(page.locator('text=Books')).toBeVisible();
  });
});
```

## ♿ Accessibility Tests

### WCAG Compliance

```typescript
test.describe('Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    // Tab through navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to navigate to sign in
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/login');
  });

  test('should have proper ARIA labels', async ({ page }) => {
    // Check for proper ARIA labels
    await expect(page.locator('nav[role="navigation"]')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('button[aria-label*="Search books"]')).toBeVisible();
  });
});
```

## 🚀 Running E2E Tests

### Basic Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run cross-browser E2E tests
npm run test:e2e:cross-browser

# Run mobile E2E tests
npm run test:e2e:mobile

# Run specific test file
npm run test:e2e -- complete-user-workflows.spec.ts

# Run tests in headed mode
npm run test:e2e -- --headed

# Run tests in debug mode
npm run test:e2e -- --debug

# Update screenshots
npm run test:e2e -- --update-snapshots
```

### Development Commands

```bash
# Run tests in watch mode
npx playwright test --watch

# Run tests with specific browser
npx playwright test --project=chromium

# Run tests with specific device
npx playwright test --project=mobile

# Generate test report
npx playwright show-report
```

### CI/CD Commands

```bash
# Install browsers for CI
npx playwright install

# Run tests in CI mode
npx playwright test --reporter=github

# Run tests with coverage
npx playwright test --reporter=html
```

## 🛠️ Test Configuration

### Environment Setup

```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install

# Install dependencies
npx playwright install-deps
```

### Test Data Setup

```typescript
// Setup test data before running tests
test.beforeAll(async ({ page }) => {
  // Setup test database
  // Create test users
  // Seed test data
});

test.beforeEach(async ({ page }) => {
  // Login test user
  // Navigate to test page
  // Setup test state
});

test.afterEach(async ({ page }) => {
  // Clean up test data
  // Reset test state
});
```

## 📋 Best Practices

### 1. Test Real User Workflows

- Test complete user journeys, not individual features
- Focus on business-critical workflows
- Test error scenarios and edge cases

### 2. Use Proper Selectors

```typescript
// Good - Use data-testid attributes
await page.click('[data-testid="login-button"]');

// Good - Use semantic selectors
await page.click('button:has-text("Sign In")');

// Avoid - Use fragile selectors
await page.click('.btn-primary');
```

### 3. Handle Async Operations

```typescript
// Wait for elements to be visible
await expect(page.locator('text=Welcome')).toBeVisible();

// Wait for navigation
await expect(page).toHaveURL('/dashboard');

// Wait for network requests
await page.waitForResponse('**/api/books');
```

### 4. Use Page Object Model

```typescript
// Create page objects for complex pages
class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email-input"]', email);
    await this.page.fill('[data-testid="password-input"]', password);
    await this.page.click('[data-testid="login-button"]');
  }

  async isLoggedIn() {
    return this.page.locator('text=Welcome').isVisible();
  }
}
```

### 5. Test Cross-Browser Compatibility

```typescript
// Test in multiple browsers
['chromium', 'firefox', 'webkit'].forEach(browserName => {
  test(`should work in ${browserName}`, async ({ page }) => {
    // Test implementation
  });
});
```

## 🔧 Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout values
   - Use proper wait conditions
   - Check for slow network requests

2. **Element not found**
   - Use more specific selectors
   - Wait for elements to be visible
   - Check for dynamic content loading

3. **Flaky tests**
   - Use proper wait conditions
   - Avoid hardcoded delays
   - Test in stable environments

### Debug Tips

```bash
# Run tests in headed mode
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Generate trace files
npx playwright test --trace=on

# View trace files
npx playwright show-trace trace.zip
```

## 📚 Related Documentation

- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Comprehensive testing guide
- [INTEGRATION_TESTING.md](./INTEGRATION_TESTING.md) - Integration testing guide
- [COMPREHENSIVE_TESTING_GUIDE.md](./COMPREHENSIVE_TESTING_GUIDE.md) - Full testing strategy
- [README.md](./README.md) - Project overview and setup

---

## 🎯 Summary

The E2E testing strategy provides:

- **Complete User Journey Testing**: Tests full workflows from start to finish
- **Cross-Browser Compatibility**: Ensures the app works in all major browsers
- **Mobile Responsiveness**: Tests mobile and tablet experiences
- **Accessibility Compliance**: Validates WCAG compliance
- **Real Browser Testing**: Tests in actual browser environments
- **Visual Regression Testing**: Catches UI changes and bugs

This approach complements unit and integration tests to provide comprehensive coverage and confidence in the WordWise application.
