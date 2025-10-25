/**
 * Visual regression tests for Otter River Rush
 */

import { test, expect } from '@playwright/test';

test.describe('Visual Testing', () => {
  test('should capture game initial screen', async ({ page }) => {
    await page.goto('http://localhost:4174/otter-river-rush/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Take a screenshot
    await page.screenshot({ path: '/tmp/game-initial.png', fullPage: true });
    
    // Verify canvas is visible
    await expect(page.locator('canvas')).toBeVisible();
  });
});
