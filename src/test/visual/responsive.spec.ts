import { test, expect } from '@playwright/test';

test.describe('Responsive Design Visual Tests', () => {
  test('Mobile layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('mobile-layout.png');
  });

  test('Tablet layout', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('tablet-layout.png');
  });

  test('Desktop layout', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('desktop-layout.png');
  });

  test('Large desktop layout', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('large-desktop-layout.png');
  });

  test('Navigation mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    // Open mobile menu
    const menuButton = page.locator('[aria-label*="menu"]').first();
    await menuButton.click();
    
    // Wait for menu to open
    await page.waitForSelector('[role="menu"]');
    
    // Take screenshot of mobile menu
    await expect(page).toHaveScreenshot('mobile-menu.png');
  });

  test('Book grid responsive behavior', async ({ page }) => {
    // Test mobile book grid
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const bookGrid = page.locator('[data-testid="book-grid"]');
    await expect(bookGrid).toBeVisible();
    await expect(bookGrid).toHaveScreenshot('book-grid-mobile.png');
    
    // Test tablet book grid
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await expect(bookGrid).toHaveScreenshot('book-grid-tablet.png');
    
    // Test desktop book grid
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await expect(bookGrid).toHaveScreenshot('book-grid-desktop.png');
  });
});

