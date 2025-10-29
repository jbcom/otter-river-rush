import { test, expect } from '@playwright/test';

/**
 * Composition Tests - Verify visual layout and element positioning
 * These tests catch issues like overlapping elements, z-index problems,
 * unexpected white boxes, and layout conflicts.
 */

test.describe('Visual Composition Tests', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL || '/');
    await page.waitForLoadState('networkidle');
  });

  test('no layout issues - overlapping elements or white boxes', async ({ page }) => {
    // Wait for game to load
    await page.waitForSelector('#app', { timeout: 10000 });
    
    // Check for unexpected white spaces or overlapping canvases
    const layoutIssues = await page.evaluate(() => {
      const canvases = document.querySelectorAll('canvas');
      const allElements = Array.from(document.querySelectorAll('*'));
      
      // Check for large white boxes without IDs (unintentional)
      const whiteBoxes = allElements.filter(el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return rect.width > 100 && rect.height > 100 && 
               (style.backgroundColor === 'rgb(255, 255, 255)' || 
                style.backgroundColor === 'white') &&
               !el.id && // Ignore intentional white elements with IDs
               el.tagName !== 'CANVAS'; // Ignore canvas elements
      });
      
      return {
        canvasCount: canvases.length,
        whiteBoxCount: whiteBoxes.length,
        hasMultipleCanvases: canvases.length > 1,
        canvasInfo: Array.from(canvases).map(c => ({
          id: c.id,
          width: c.width,
          height: c.height,
          visible: c.getBoundingClientRect().width > 0
        }))
      };
    });
    
    // There should be exactly 1 canvas (React Three Fiber)
    expect(layoutIssues.canvasCount).toBe(1);
    
    // No unintentional white boxes
    expect(layoutIssues.whiteBoxCount).toBe(0);
    
    // No multiple overlapping canvases
    expect(layoutIssues.hasMultipleCanvases).toBe(false);
    
    console.log('✅ Layout composition verified - no overlapping elements or white boxes');
  });

  test('canvas fills viewport correctly', async ({ page }) => {
    await page.waitForSelector('canvas', { timeout: 10000 });
    
    const canvasLayout = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return null;
      
      const rect = canvas.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      return {
        canvasWidth: rect.width,
        canvasHeight: rect.height,
        viewportWidth,
        viewportHeight,
        fillsViewport: rect.width >= viewportWidth * 0.9 && rect.height >= viewportHeight * 0.9,
        isVisible: rect.width > 0 && rect.height > 0
      };
    });
    
    expect(canvasLayout).not.toBeNull();
    expect(canvasLayout?.isVisible).toBe(true);
    expect(canvasLayout?.fillsViewport).toBe(true);
    
    console.log('✅ Canvas fills viewport correctly');
  });

  test('UI elements have correct z-index stacking', async ({ page }) => {
    // Start the game to check stacking during gameplay
    await page.evaluate(() => {
      document.querySelector<HTMLButtonElement>('#classicButton')?.click();
    });
    await page.waitForTimeout(1000);
    
    const zIndexIssues = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      const hudElements = document.querySelectorAll('[class*="HUD"], [id*="hud"], [id*="score"]');
      
      if (!canvas) return { hasIssues: true, reason: 'No canvas found' };
      
      const canvasZ = parseInt(window.getComputedStyle(canvas).zIndex || '0');
      const hudZIndexes = Array.from(hudElements).map(el => {
        const z = parseInt(window.getComputedStyle(el).zIndex || '0');
        return { id: el.id || el.className, zIndex: z };
      });
      
      // HUD elements should have higher z-index than canvas
      const hudBelowCanvas = hudZIndexes.filter(h => h.zIndex < canvasZ && h.zIndex !== 0);
      
      return {
        hasIssues: hudBelowCanvas.length > 0,
        canvasZIndex: canvasZ,
        hudZIndexes,
        hudBelowCanvas
      };
    });
    
    expect(zIndexIssues.hasIssues).toBe(false);
    
    console.log('✅ Z-index stacking verified - UI elements properly layered');
  });

  test('no hidden or cropped content', async ({ page }) => {
    await page.waitForSelector('#app', { timeout: 10000 });
    
    const croppedContent = await page.evaluate(() => {
      const importantElements = document.querySelectorAll(
        '#classicButton, #timeTrialButton, #zenButton, #dailyButton, h1'
      );
      
      const cropped = Array.from(importantElements).filter(el => {
        const rect = el.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Check if element is partially outside viewport
        return rect.left < 0 || 
               rect.right > viewportWidth || 
               rect.top < 0 || 
               rect.bottom > viewportHeight;
      });
      
      return {
        croppedCount: cropped.length,
        croppedElements: cropped.map(el => ({
          id: el.id,
          text: el.textContent?.substring(0, 30)
        }))
      };
    });
    
    expect(croppedContent.croppedCount).toBe(0);
    
    console.log('✅ All content visible - nothing hidden or cropped');
  });

  test('responsive layout - elements positioned correctly', async ({ page }) => {
    await page.waitForSelector('#app', { timeout: 10000 });
    
    const layoutPositioning = await page.evaluate(() => {
      const app = document.querySelector('#app');
      const startScreen = document.querySelector('#startScreen');
      
      if (!app || !startScreen) {
        return { isValid: false, reason: 'Required elements not found' };
      }
      
      const appRect = app.getBoundingClientRect();
      const screenRect = startScreen.getBoundingClientRect();
      
      return {
        isValid: true,
        appFullScreen: appRect.left === 0 && appRect.top === 0,
        startScreenCentered: screenRect.left >= 0 && screenRect.top >= 0,
        noNegativePositions: appRect.left >= 0 && screenRect.left >= 0
      };
    });
    
    expect(layoutPositioning.isValid).toBe(true);
    expect(layoutPositioning.appFullScreen).toBe(true);
    expect(layoutPositioning.noNegativePositions).toBe(true);
    
    console.log('✅ Responsive layout verified - elements positioned correctly');
  });
});
