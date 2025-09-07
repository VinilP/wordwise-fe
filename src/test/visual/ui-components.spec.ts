import { test, expect } from "@playwright/test";

test.describe("UI Components Visual Tests", () => {
  test("LoadingSpinner component", async ({ page }) => {
    await page.goto("/");

    // Wait for loading spinner to appear
    const spinner = page.locator('[role="status"]');
    await expect(spinner).toBeVisible();

    // Take screenshot of loading spinner
    await expect(spinner).toHaveScreenshot("loading-spinner.png");
  });

  test("Button variants", async ({ page }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Find buttons and take screenshots
    const primaryButton = page.locator('button:has-text("Sign in")').first();
    await expect(primaryButton).toBeVisible();
    await expect(primaryButton).toHaveScreenshot("button-primary.png");

    const secondaryButton = page
      .locator('button:has-text("Create account")')
      .first();
    await expect(secondaryButton).toBeVisible();
    await expect(secondaryButton).toHaveScreenshot("button-secondary.png");
  });

  test("Error message component", async ({ page }) => {
    await page.goto("/");

    // Trigger an error state (e.g., by submitting empty form)
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // Wait for error message to appear
    const errorMessage = page.locator('[role="alert"]').first();
    await expect(errorMessage).toBeVisible();

    // Take screenshot of error message
    await expect(errorMessage).toHaveScreenshot("error-message.png");
  });

  test("Navigation component", async ({ page }) => {
    await page.goto("/");

    // Wait for navigation to load
    await page.waitForLoadState("networkidle");

    const navigation = page.locator("nav").first();
    await expect(navigation).toBeVisible();

    // Take screenshot of navigation
    await expect(navigation).toHaveScreenshot("navigation.png");
  });

  test("Book card component", async ({ page }) => {
    await page.goto("/");

    // Wait for books to load
    await page.waitForLoadState("networkidle");

    // Find first book card
    const bookCard = page.locator('[data-testid="book-card"]').first();
    await expect(bookCard).toBeVisible();

    // Take screenshot of book card
    await expect(bookCard).toHaveScreenshot("book-card.png");
  });

  test("Form components", async ({ page }) => {
    await page.goto("/login");

    // Wait for form to load
    await page.waitForLoadState("networkidle");

    const form = page.locator("form").first();
    await expect(form).toBeVisible();

    // Take screenshot of form
    await expect(form).toHaveScreenshot("login-form.png");
  });
});
