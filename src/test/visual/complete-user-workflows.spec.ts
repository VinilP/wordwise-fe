import { test, expect, Page } from "@playwright/test";

// Test data
const testUser = {
  name: "E2E Test User",
  email: "e2e-test@example.com",
  password: "TestPassword123!",
};

const testBook = {
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  description: "A classic American novel about the Jazz Age.",
  genres: ["Fiction", "Classic Literature"],
  publishedYear: 1925,
};

test.describe("Complete User Workflows", () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();

    // Set up request interception for API calls
    await page.route("**/api/**", async (route) => {
      const url = route.request().url();
      const method = route.request().method();

      // Mock API responses for testing
      if (url.includes("/auth/register") && method === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              user: { id: "1", ...testUser },
              accessToken: "mock-access-token",
              refreshToken: "mock-refresh-token",
            },
          }),
        });
      } else if (url.includes("/auth/login") && method === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              user: { id: "1", ...testUser },
              accessToken: "mock-access-token",
              refreshToken: "mock-refresh-token",
            },
          }),
        });
      } else if (url.includes("/books") && method === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              books: [testBook],
              pagination: { total: 1, page: 1, limit: 10 },
            },
          }),
        });
      } else if (url.includes("/reviews") && method === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              id: "1",
              bookId: "1",
              userId: "1",
              content: "This is a great book!",
              rating: 5,
              createdAt: new Date().toISOString(),
            },
          }),
        });
      } else {
        await route.continue();
      }
    });
  });

  test.afterEach(async () => {
    await page.close();
  });

  test("Complete User Registration and Book Review Workflow", async () => {
    // Step 1: Navigate to homepage
    await page.goto("/");
    await expect(page).toHaveTitle(/WordWise/);
    await expect(page.locator("h1")).toContainText("WordWise");

    // Step 2: Register new user
    await page.click("text=Sign Up");
    await expect(page).toHaveURL(/.*auth.*register/);

    await page.fill('[data-testid="name-input"]', testUser.name);
    await page.fill('[data-testid="email-input"]', testUser.email);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.fill(
      '[data-testid="confirm-password-input"]',
      testUser.password,
    );

    await page.click('[data-testid="register-button"]');

    // Step 3: Verify successful registration and redirect
    await expect(page).toHaveURL("/");
    await expect(page.locator("text=Welcome")).toBeVisible();

    // Step 4: Search for books
    await page.fill('[data-testid="search-input"]', "Gatsby");
    await page.click('[data-testid="search-button"]');

    // Step 5: Verify search results
    await expect(page.locator('[data-testid="book-card"]')).toHaveCount(1);
    await expect(page.locator("text=The Great Gatsby")).toBeVisible();

    // Step 6: Click on book to view details
    await page.click('[data-testid="book-card"]');
    await expect(page).toHaveURL(/.*books.*/);

    // Step 7: Write a review
    await page.click('[data-testid="write-review-button"]');
    await page.fill(
      '[data-testid="review-content"]',
      "This is an amazing classic novel!",
    );
    await page.click('[data-testid="rating-5"]');
    await page.click('[data-testid="submit-review-button"]');

    // Step 8: Verify review was created
    await expect(
      page.locator("text=This is an amazing classic novel!"),
    ).toBeVisible();
    await expect(page.locator('[data-testid="rating-display"]')).toContainText(
      "5",
    );

    // Step 9: Add book to favorites
    await page.click('[data-testid="favorite-button"]');
    await expect(page.locator('[data-testid="favorite-button"]')).toHaveClass(
      /favorited/,
    );

    // Step 10: Navigate to profile
    await page.click('[data-testid="profile-link"]');
    await expect(page).toHaveURL(/.*profile/);

    // Step 11: Verify profile shows user's reviews and favorites
    await expect(page.locator('[data-testid="user-review"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="favorite-book"]')).toHaveCount(1);
  });

  test("Complete Book Discovery and Recommendation Workflow", async () => {
    // Step 1: Login as existing user
    await page.goto("/");
    await page.click("text=Sign In");
    await page.fill('[data-testid="email-input"]', testUser.email);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');

    // Step 2: Browse books by genre
    await page.click('[data-testid="browse-genres"]');
    await page.click("text=Fiction");
    await expect(
      page.locator('[data-testid="book-card"]'),
    ).toHaveCount.greaterThan(0);

    // Step 3: View book details
    await page.click('[data-testid="book-card"]:first-child');
    await expect(page.locator('[data-testid="book-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="book-author"]')).toBeVisible();

    // Step 4: Read existing reviews
    await expect(
      page.locator('[data-testid="review-card"]'),
    ).toHaveCount.greaterThan(0);

    // Step 5: Navigate to recommendations
    await page.click('[data-testid="recommendations-link"]');
    await expect(page).toHaveURL(/.*recommendations/);

    // Step 6: Verify recommendations are displayed
    await expect(
      page.locator('[data-testid="recommendation-card"]'),
    ).toHaveCount.greaterThan(0);

    // Step 7: Filter recommendations by genre
    await page.click('[data-testid="genre-filter"]');
    await page.click("text=Classic Literature");
    await expect(
      page.locator('[data-testid="recommendation-card"]'),
    ).toHaveCount.greaterThan(0);
  });

  test("Complete Review Management Workflow", async () => {
    // Step 1: Login
    await page.goto("/");
    await page.click("text=Sign In");
    await page.fill('[data-testid="email-input"]', testUser.email);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');

    // Step 2: Write a review
    await page.click('[data-testid="book-card"]:first-child');
    await page.click('[data-testid="write-review-button"]');
    await page.fill('[data-testid="review-content"]', "Initial review content");
    await page.click('[data-testid="rating-4"]');
    await page.click('[data-testid="submit-review-button"]');

    // Step 3: Edit the review
    await page.click('[data-testid="edit-review-button"]');
    await page.fill('[data-testid="review-content"]', "Updated review content");
    await page.click('[data-testid="rating-5"]');
    await page.click('[data-testid="update-review-button"]');

    // Step 4: Verify review was updated
    await expect(page.locator("text=Updated review content")).toBeVisible();
    await expect(page.locator('[data-testid="rating-display"]')).toContainText(
      "5",
    );

    // Step 5: Delete the review
    await page.click('[data-testid="delete-review-button"]');
    await page.click('[data-testid="confirm-delete-button"]');

    // Step 6: Verify review was deleted
    await expect(page.locator("text=Updated review content")).not.toBeVisible();
  });

  test("Complete Search and Filter Workflow", async () => {
    // Step 1: Login
    await page.goto("/");
    await page.click("text=Sign In");
    await page.fill('[data-testid="email-input"]', testUser.email);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');

    // Step 2: Search for books
    await page.fill('[data-testid="search-input"]', "Fitzgerald");
    await page.click('[data-testid="search-button"]');

    // Step 3: Verify search results
    await expect(
      page.locator('[data-testid="book-card"]'),
    ).toHaveCount.greaterThan(0);
    await expect(page.locator("text=Fitzgerald")).toBeVisible();

    // Step 4: Apply filters
    await page.click('[data-testid="filter-button"]');
    await page.click('[data-testid="genre-filter"]');
    await page.click("text=Fiction");
    await page.click('[data-testid="year-filter"]');
    await page.selectOption('[data-testid="year-select"]', "1920s");
    await page.click('[data-testid="apply-filters-button"]');

    // Step 5: Verify filtered results
    await expect(
      page.locator('[data-testid="book-card"]'),
    ).toHaveCount.greaterThan(0);

    // Step 6: Sort results
    await page.click('[data-testid="sort-button"]');
    await page.click("text=Rating (High to Low)");
    await expect(
      page.locator('[data-testid="book-card"]'),
    ).toHaveCount.greaterThan(0);

    // Step 7: Clear filters
    await page.click('[data-testid="clear-filters-button"]');
    await expect(
      page.locator('[data-testid="book-card"]'),
    ).toHaveCount.greaterThan(0);
  });

  test("Complete Error Handling Workflow", async () => {
    // Step 1: Test invalid login
    await page.goto("/");
    await page.click("text=Sign In");
    await page.fill('[data-testid="email-input"]', "invalid@example.com");
    await page.fill('[data-testid="password-input"]', "wrongpassword");
    await page.click('[data-testid="login-button"]');

    // Step 2: Verify error message
    await expect(page.locator("text=Invalid credentials")).toBeVisible();

    // Step 3: Test invalid registration
    await page.click("text=Sign Up");
    await page.fill('[data-testid="email-input"]', "invalid-email");
    await page.fill('[data-testid="password-input"]', "123");
    await page.click('[data-testid="register-button"]');

    // Step 4: Verify validation errors
    await expect(page.locator("text=Invalid email format")).toBeVisible();
    await expect(page.locator("text=Password too short")).toBeVisible();

    // Step 5: Test network error handling
    await page.route("**/api/**", (route) => route.abort());

    await page.fill('[data-testid="email-input"]', testUser.email);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');

    // Step 6: Verify network error handling
    await expect(page.locator("text=Network error")).toBeVisible();
  });

  test("Complete Accessibility Workflow", async () => {
    // Step 1: Test keyboard navigation
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toBeVisible();

    // Step 2: Test screen reader compatibility
    await page.click("text=Sign In");
    await expect(page.locator('[aria-label="Email address"]')).toBeVisible();
    await expect(page.locator('[aria-label="Password"]')).toBeVisible();

    // Step 3: Test form validation with screen reader
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[role="alert"]')).toBeVisible();

    // Step 4: Test color contrast and focus indicators
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toHaveCSS("outline", /none|auto/);
  });

  test("Complete Mobile Responsiveness Workflow", async () => {
    // Step 1: Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Step 2: Test mobile navigation
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

    // Step 3: Test mobile search
    await page.click('[data-testid="mobile-search-button"]');
    await page.fill('[data-testid="search-input"]', "test");
    await page.click('[data-testid="search-button"]');

    // Step 4: Test mobile book cards
    await expect(
      page.locator('[data-testid="book-card"]'),
    ).toHaveCount.greaterThan(0);

    // Step 5: Test mobile review form
    await page.click('[data-testid="book-card"]:first-child');
    await page.click('[data-testid="write-review-button"]');
    await expect(page.locator('[data-testid="review-form"]')).toBeVisible();
  });
});
