import { test, expect } from "@playwright/test";

test.describe("Complete User Workflows", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto("/");
  });

  test.describe("Authentication Workflow", () => {
    test("should complete full registration and login flow", async ({
      page,
    }) => {
      // Start registration
      await page.click("text=Create Account");
      await expect(page).toHaveURL("/register");

      // Fill registration form
      await page.fill('input[placeholder*="Full Name"]', "Test User");
      await page.fill(
        'input[placeholder*="Email Address"]',
        "test@example.com",
      );
      await page.fill('input[placeholder*="Password"]', "password123");
      await page.fill('input[placeholder*="Confirm Password"]', "password123");

      // Submit registration
      await page.click('button:has-text("Create Account")');

      // Should redirect to home page after successful registration
      await expect(page).toHaveURL("/");
      await expect(page.locator("text=Welcome")).toBeVisible();

      // Logout
      await page.click('button:has-text("Sign Out")');
      await expect(page.locator("text=Sign In")).toBeVisible();

      // Login with same credentials
      await page.click("text=Sign In");
      await expect(page).toHaveURL("/login");

      await page.fill(
        'input[placeholder*="Email Address"]',
        "test@example.com",
      );
      await page.fill('input[placeholder*="Password"]', "password123");
      await page.click('button:has-text("Sign In")');

      // Should be logged in again
      await expect(page).toHaveURL("/");
      await expect(page.locator("text=Welcome")).toBeVisible();
    });

    test("should handle login errors gracefully", async ({ page }) => {
      await page.click("text=Sign In");
      await expect(page).toHaveURL("/login");

      // Try with invalid credentials
      await page.fill(
        'input[placeholder*="Email Address"]',
        "wrong@example.com",
      );
      await page.fill('input[placeholder*="Password"]', "wrongpassword");
      await page.click('button:has-text("Sign In")');

      // Should show error message
      await expect(page.locator("text=Invalid credentials")).toBeVisible();
      await expect(page).toHaveURL("/login"); // Should stay on login page
    });

    test("should protect routes and redirect to login", async ({ page }) => {
      // Try to access protected route without being logged in
      await page.goto("/profile");

      // Should redirect to login
      await expect(page).toHaveURL("/login");
      await expect(page.locator("text=Sign in to your account")).toBeVisible();
    });
  });

  test.describe("Book Discovery Workflow", () => {
    test("should search and discover books", async ({ page }) => {
      // Search for books
      await page.fill('input[placeholder*="Search books"]', "gatsby");
      await page.press('input[placeholder*="Search books"]', "Enter");

      // Should show search results
      await expect(page.locator("text=The Great Gatsby")).toBeVisible();
      await expect(page.locator("text=F. Scott Fitzgerald")).toBeVisible();

      // Click on a book
      await page.click("text=The Great Gatsby");

      // Should navigate to book detail page
      await expect(page).toHaveURL(/\/books\/\d+/);
      await expect(page.locator("text=The Great Gatsby")).toBeVisible();
      await expect(page.locator("text=F. Scott Fitzgerald")).toBeVisible();
    });

    test("should filter books by genre", async ({ page }) => {
      // Open filters
      await page.click('button[aria-label*="Show search filters"]');

      // Select a genre filter
      await page.click('button:has-text("Fiction")');

      // Should show filtered results
      await expect(page.locator("text=Fiction")).toBeVisible();

      // Clear filters
      await page.click("text=Clear all");
      await expect(page.locator("text=Fiction")).not.toBeVisible();
    });

    test("should handle pagination", async ({ page }) => {
      // Navigate to books page
      await page.click("text=Books");
      await expect(page).toHaveURL("/books");

      // Should show first page of books
      await expect(
        page.locator('[data-testid="book-card"]'),
      ).toHaveCount.greaterThan(0);

      // Click next page if available
      const nextButton = page.locator('button[aria-label*="Go to page 2"]');
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await expect(
          page.locator('[data-testid="book-card"]'),
        ).toHaveCount.greaterThan(0);
      }
    });
  });

  test.describe("Review Management Workflow", () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.click("text=Sign In");
      await page.fill(
        'input[placeholder*="Email Address"]',
        "test@example.com",
      );
      await page.fill('input[placeholder*="Password"]', "password123");
      await page.click('button:has-text("Sign In")');
    });

    test("should create, edit, and delete reviews", async ({ page }) => {
      // Navigate to a book detail page
      await page.click("text=Books");
      await page.click('[data-testid="book-card"]:first-child');

      // Create a review
      await page.click("text=Write a Review");
      await page.click('button[data-testid="rating-5"]');
      await page.fill(
        'textarea[placeholder*="Write your review"]',
        "This is an amazing book!",
      );
      await page.click('button:has-text("Submit Review")');

      // Should show success message
      await expect(
        page.locator("text=Review submitted successfully"),
      ).toBeVisible();

      // Should show the review in the list
      await expect(page.locator("text=This is an amazing book!")).toBeVisible();

      // Edit the review
      await page.click('button[aria-label*="Edit review"]');
      await page.fill(
        'textarea[placeholder*="Write your review"]',
        "Updated review comment",
      );
      await page.click('button:has-text("Save Changes")');

      // Should show updated review
      await expect(page.locator("text=Updated review comment")).toBeVisible();

      // Delete the review
      await page.click('button[aria-label*="Delete review"]');
      await page.click('button:has-text("Delete")');

      // Should show success message
      await expect(
        page.locator("text=Review deleted successfully"),
      ).toBeVisible();
      await expect(
        page.locator("text=Updated review comment"),
      ).not.toBeVisible();
    });

    test("should validate review form", async ({ page }) => {
      // Navigate to a book detail page
      await page.click("text=Books");
      await page.click('[data-testid="book-card"]:first-child');

      // Try to submit review without filling form
      await page.click("text=Write a Review");
      await page.click('button:has-text("Submit Review")');

      // Should show validation errors
      await expect(page.locator("text=Rating is required")).toBeVisible();
      await expect(page.locator("text=Comment is required")).toBeVisible();
    });
  });

  test.describe("User Profile Workflow", () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.click("text=Sign In");
      await page.fill(
        'input[placeholder*="Email Address"]',
        "test@example.com",
      );
      await page.fill('input[placeholder*="Password"]', "password123");
      await page.click('button:has-text("Sign In")');
    });

    test("should manage user profile", async ({ page }) => {
      // Navigate to profile
      await page.click("text=Profile");
      await expect(page).toHaveURL("/profile");

      // Should show profile information
      await expect(page.locator("text=Test User")).toBeVisible();
      await expect(page.locator("text=test@example.com")).toBeVisible();

      // Edit profile
      await page.click("text=Edit Profile");
      await page.fill('input[value="Test User"]', "Updated Name");
      await page.click('button:has-text("Save Changes")');

      // Should show updated name
      await expect(page.locator("text=Updated Name")).toBeVisible();
    });

    test("should manage favorites", async ({ page }) => {
      // Add a book to favorites
      await page.click("text=Books");
      await page.click('[data-testid="book-card"]:first-child');
      await page.click('button[aria-label*="Add to favorites"]');

      // Should show success message
      await expect(page.locator("text=Added to favorites")).toBeVisible();

      // Navigate to profile favorites
      await page.click("text=Profile");
      await page.click("text=Favorites");

      // Should show the book in favorites
      await expect(
        page.locator('[data-testid="book-card"]'),
      ).toHaveCount.greaterThan(0);

      // Remove from favorites
      await page.click('button[aria-label*="Remove from favorites"]');
      await page.click('button:has-text("Remove")');

      // Should show success message
      await expect(page.locator("text=Removed from favorites")).toBeVisible();
    });

    test("should view user reviews", async ({ page }) => {
      // Navigate to profile reviews
      await page.click("text=Profile");
      await page.click("text=Reviews");

      // Should show reviews tab
      await expect(page.locator("text=Your Reviews")).toBeVisible();
    });
  });

  test.describe("Recommendations Workflow", () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.click("text=Sign In");
      await page.fill(
        'input[placeholder*="Email Address"]',
        "test@example.com",
      );
      await page.fill('input[placeholder*="Password"]', "password123");
      await page.click('button:has-text("Sign In")');
    });

    test("should view AI recommendations", async ({ page }) => {
      // Navigate to recommendations
      await page.click("text=Recommendations");
      await expect(page).toHaveURL("/recommendations");

      // Should show AI recommendations tab
      await expect(page.locator("text=AI Recommendations")).toBeVisible();
      await expect(
        page.locator("text=Personalized AI Recommendations"),
      ).toBeVisible();

      // Should show recommendation cards
      await expect(
        page.locator('[data-testid="recommendation-card"]'),
      ).toHaveCount.greaterThan(0);
    });

    test("should view popular books", async ({ page }) => {
      // Navigate to recommendations
      await page.click("text=Recommendations");

      // Switch to popular books tab
      await page.click("text=Popular Books");

      // Should show popular books
      await expect(
        page.locator("text=Popular & Top-Rated Books"),
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="recommendation-card"]'),
      ).toHaveCount.greaterThan(0);
    });

    test("should refresh recommendations", async ({ page }) => {
      // Navigate to recommendations
      await page.click("text=Recommendations");

      // Click refresh button
      await page.click('button:has-text("Refresh")');

      // Should show refreshing state
      await expect(page.locator("text=Refreshing...")).toBeVisible();
    });
  });

  test.describe("Responsive Design", () => {
    test("should work on mobile devices", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Should show mobile navigation
      await expect(
        page.locator('button[aria-label*="Open main menu"]'),
      ).toBeVisible();

      // Open mobile menu
      await page.click('button[aria-label*="Open main menu"]');

      // Should show mobile menu items
      await expect(page.locator("text=Books")).toBeVisible();
      await expect(page.locator("text=Sign In")).toBeVisible();
    });

    test("should work on tablet devices", async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      // Should show tablet layout
      await expect(page.locator("text=WordWise")).toBeVisible();
      await expect(page.locator("text=Books")).toBeVisible();
    });
  });

  test.describe("Accessibility", () => {
    test("should be keyboard navigable", async ({ page }) => {
      // Tab through navigation
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");

      // Should be able to navigate to sign in
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL("/login");
    });

    test("should have proper ARIA labels", async ({ page }) => {
      // Check for proper ARIA labels
      await expect(page.locator('nav[role="navigation"]')).toBeVisible();
      await expect(page.locator("main")).toBeVisible();
      await expect(
        page.locator('button[aria-label*="Search books"]'),
      ).toBeVisible();
    });
  });
});
