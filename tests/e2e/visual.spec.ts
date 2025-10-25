/**
 * Visual regression tests for Otter River Rush
 * 
 * These tests capture screenshots of the game in various states
 * and compare them against baseline images to detect visual regressions.
 */

import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('initial menu screen', async ({ page }) => {
    // Wait for canvas to be visible
    await expect(page.locator('canvas')).toBeVisible();
    
    // Wait for any loading to complete
    await page.waitForTimeout(1000);
    
    // Take screenshot and compare against baseline
    await expect(page).toHaveScreenshot('menu-screen.png', {
      maxDiffPixels: 100,
      animations: 'disabled',
    });
  });

  test('gameplay screen after starting', async ({ page }) => {
    // Start the game
    const startButton = page.locator('button:has-text("Start Game")');
    await startButton.click();
    
    // Wait for game to start
    await page.waitForTimeout(1500);
    
    // Verify score is visible
    await expect(page.locator('[data-testid="score"]')).toBeVisible();
    
    // Take screenshot of gameplay
    await expect(page).toHaveScreenshot('gameplay-screen.png', {
      maxDiffPixels: 500, // Higher tolerance due to animation
      animations: 'disabled',
    });
  });

  test('game UI elements visibility', async ({ page }) => {
    // Start the game
    const startButton = page.locator('button:has-text("Start Game")');
    await startButton.click();
    
    await page.waitForTimeout(1000);
    
    // Check that HUD elements are visible
    const score = page.locator('[data-testid="score"]');
    const distance = page.locator('[data-testid="distance"]');
    
    await expect(score).toBeVisible();
    await expect(distance).toBeVisible();
    
    // Take screenshot of UI
    await expect(page).toHaveScreenshot('game-ui-elements.png', {
      maxDiffPixels: 300,
      animations: 'disabled',
    });
  });

  test('canvas rendering dimensions', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // Verify canvas has proper dimensions
    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
    
    // Take screenshot to verify rendering
    await expect(canvas).toHaveScreenshot('canvas-rendering.png', {
      maxDiffPixels: 100,
    });
  });

  test('responsive design - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page.locator('canvas')).toBeVisible();
    
    await expect(page).toHaveScreenshot('mobile-menu.png', {
      maxDiffPixels: 100,
      animations: 'disabled',
    });
  });

  test('responsive design - tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page.locator('canvas')).toBeVisible();
    
    await expect(page).toHaveScreenshot('tablet-menu.png', {
      maxDiffPixels: 100,
      animations: 'disabled',
    });
  });

  test('responsive design - desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page.locator('canvas')).toBeVisible();
    
    await expect(page).toHaveScreenshot('desktop-menu.png', {
      maxDiffPixels: 100,
      animations: 'disabled',
    });
  });

  test('game background rendering', async ({ page }) => {
    const startButton = page.locator('button:has-text("Start Game")');
    await startButton.click();
    
    // Let game run to see background
    await page.waitForTimeout(2000);
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('background-rendering.png', {
      maxDiffPixels: 500,
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('pause menu appearance', async ({ page }) => {
    // Start the game
    const startButton = page.locator('button:has-text("Start Game")');
    await startButton.click();
    
    await page.waitForTimeout(1000);
    
    // Pause the game
    await page.keyboard.press('Escape');
    
    // Wait for pause menu
    await page.waitForTimeout(500);
    
    // Verify pause menu is visible
    await expect(page.locator('text=/pause|resume/i')).toBeVisible();
    
    // Take screenshot
    await expect(page).toHaveScreenshot('pause-menu.png', {
      maxDiffPixels: 200,
      animations: 'disabled',
    });
  });

  test('otter sprite rendering', async ({ page }) => {
    const startButton = page.locator('button:has-text("Start Game")');
    await startButton.click();
    
    await page.waitForTimeout(500);
    
    // Focus on canvas area
    const canvas = page.locator('canvas');
    await expect(canvas).toHaveScreenshot('otter-sprite.png', {
      maxDiffPixels: 300,
    });
  });
});
