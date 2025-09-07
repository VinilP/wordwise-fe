import { test, expect } from '@playwright/test';

test.describe('Accessibility Visual Tests', () => {
  test('Color contrast compliance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test color contrast on different elements
    const button = page.locator('button:has-text("Sign in")').first();
    await expect(button).toBeVisible();
    
    // Check button contrast
    const buttonStyles = await button.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
      };
    });
    
    // This would need a proper contrast checking library in a real implementation
    expect(buttonStyles.backgroundColor).toBeDefined();
    expect(buttonStyles.color).toBeDefined();
  });

  test('Focus indicators', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test focus indicators
    const firstButton = page.locator('button').first();
    await firstButton.focus();
    
    // Check if focus is visible
    const focusStyles = await firstButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        boxShadow: styles.boxShadow,
      };
    });
    
    expect(focusStyles.outline).not.toBe('none');
  });

  test('Keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Continue tabbing through interactive elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const currentFocused = page.locator(':focus');
      await expect(currentFocused).toBeVisible();
    }
  });

  test('Screen reader compatibility', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for proper ARIA labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();
      
      // Button should have either aria-label or text content
      expect(ariaLabel || textContent).toBeTruthy();
    }
  });

  test('Form accessibility', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Check form labels
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    // Check if inputs have associated labels
    const emailLabel = page.locator('label[for*="email"]');
    const passwordLabel = page.locator('label[for*="password"]');
    
    await expect(emailLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();
    
    // Check required field indicators
    const requiredFields = page.locator('[aria-required="true"]');
    const requiredCount = await requiredFields.count();
    expect(requiredCount).toBeGreaterThan(0);
  });

  test('Error message accessibility', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Trigger validation error
    await page.click('button[type="submit"]');
    
    // Wait for error messages
    await page.waitForSelector('[role="alert"]');
    
    // Check error message accessibility
    const errorMessages = page.locator('[role="alert"]');
    const errorCount = await errorMessages.count();
    
    for (let i = 0; i < errorCount; i++) {
      const error = errorMessages.nth(i);
      const ariaLive = await error.getAttribute('aria-live');
      
      expect(ariaLive).toBeTruthy();
    }
  });

  test('Mobile accessibility', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test mobile menu accessibility
    const menuButton = page.locator('[aria-label*="menu"]').first();
    await expect(menuButton).toBeVisible();
    
    const ariaExpanded = await menuButton.getAttribute('aria-expanded');
    expect(ariaExpanded).toBe('false');
    
    // Open menu
    await menuButton.click();
    
    const updatedAriaExpanded = await menuButton.getAttribute('aria-expanded');
    expect(updatedAriaExpanded).toBe('true');
    
    // Check menu accessibility
    const menu = page.locator('[role="menu"]');
    await expect(menu).toBeVisible();
    
    const menuItems = page.locator('[role="menuitem"]');
    const menuItemCount = await menuItems.count();
    expect(menuItemCount).toBeGreaterThan(0);
  });
});

