import { test, expect } from "@playwright/test";

test.describe("User Flow Visual Tests", () => {
  test("Login flow", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    // Take screenshot of login page
    await expect(page).toHaveScreenshot("login-page.png");

    // Fill in login form
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[type="password"]', "password123");

    // Take screenshot of filled form
    await expect(page).toHaveScreenshot("login-form-filled.png");

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect and take screenshot
    await page.waitForURL("/");
    await expect(page).toHaveScreenshot("after-login.png");
  });

  test("Book search flow", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Take screenshot of initial state
    await expect(page).toHaveScreenshot("book-search-initial.png");

    // Perform search
    await page.fill('input[placeholder*="search"]', "gatsby");
    await page.click('button[type="submit"]');

    // Wait for results and take screenshot
    await page.waitForSelector('[data-testid="book-card"]');
    await expect(page).toHaveScreenshot("book-search-results.png");

    // Click on a book
    await page.click('[data-testid="book-card"]:first-child');

    // Wait for book detail page and take screenshot
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("book-detail-page.png");
  });

  test("Review creation flow", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL("/");

    // Navigate to book detail
    await page.click('[data-testid="book-card"]:first-child');
    await page.waitForLoadState("networkidle");

    // Take screenshot of book detail page
    await expect(page).toHaveScreenshot("book-detail-before-review.png");

    // Click write review button
    await page.click('button:has-text("Write a review")');

    // Take screenshot of review form
    await expect(page).toHaveScreenshot("review-form.png");

    // Fill in review
    await page.fill('textarea[placeholder*="review"]', "This is a great book!");
    await page.click('input[type="radio"][value="5"]');

    // Take screenshot of filled review form
    await expect(page).toHaveScreenshot("review-form-filled.png");

    // Submit review
    await page.click('button:has-text("Submit")');

    // Wait for success and take screenshot
    await page.waitForSelector("text=Review submitted successfully");
    await expect(page).toHaveScreenshot("review-submitted.png");
  });

  test("Error states", async ({ page }) => {
    // Test network error
    await page.route("**/api/books", (route) => route.abort());
    await page.goto("/");

    // Wait for error state
    await page.waitForSelector('[role="alert"]');
    await expect(page).toHaveScreenshot("network-error.png");

    // Test form validation errors
    await page.goto("/login");
    await page.click('button[type="submit"]');

    // Wait for validation errors
    await page.waitForSelector('[role="alert"]');
    await expect(page).toHaveScreenshot("form-validation-errors.png");
  });

  test("Loading states", async ({ page }) => {
    // Slow down network to capture loading states
    await page.route("**/api/**", (route) => {
      setTimeout(() => route.continue(), 1000);
    });

    await page.goto("/");

    // Take screenshot during loading
    await expect(page).toHaveScreenshot("loading-state.png");

    // Wait for loading to complete
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("loaded-state.png");
  });
});
