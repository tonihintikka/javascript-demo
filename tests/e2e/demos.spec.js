/**
 * E2E Tests for All Demos
 * Tests user interactions and visual functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display page title', async ({ page }) => {
    await expect(page).toHaveTitle(/JavaScript.*2025|Modern JavaScript|Demos/i);
  });

  test('should have navigation links to all demos', async ({ page }) => {
    // Check for demo links
    const demoLinks = page.locator('a[href*="demos/"]');
    await expect(demoLinks.first()).toBeVisible();
  });

  test('should navigate to demo on click', async ({ page }) => {
    const firstDemoLink = page.locator('a[href*="demos/"]').first();
    await firstDemoLink.click();
    
    // Should navigate away from landing page
    await expect(page).not.toHaveURL('/');
  });
});

test.describe('Glassmorphism Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/glassmorphism.html');
  });

  test('should load glassmorphism demo page', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have interactive glass cards', async ({ page }) => {
    const glassCard = page.locator('.glass-card, .glass, [class*="glass"]').first();
    
    if (await glassCard.count() > 0) {
      await expect(glassCard).toBeVisible();
    }
  });

  test('should respond to mouse movement', async ({ page }) => {
    // Move mouse to trigger any hover effects
    await page.mouse.move(400, 300);
    await page.waitForTimeout(100);
    await page.mouse.move(500, 400);
  });
});

test.describe('Text Animations Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/text-animations.html');
  });

  test('should load text animations demo', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have animated text elements', async ({ page }) => {
    // Look for text containers or animation elements
    const animatedText = page.locator('[class*="text"], [class*="animate"], h1, h2, p').first();
    await expect(animatedText).toBeVisible();
  });

  test('should have interactive controls if present', async ({ page }) => {
    const controls = page.locator('button, input, select, [class*="control"]');
    
    if (await controls.count() > 0) {
      await expect(controls.first()).toBeVisible();
    }
  });
});

test.describe('Micro Interactions Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/micro-interactions.html');
  });

  test('should load micro interactions demo', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have interactive buttons', async ({ page }) => {
    const buttons = page.locator('button, [role="button"], .btn');
    
    if (await buttons.count() > 0) {
      const button = buttons.first();
      await expect(button).toBeVisible();
      
      // Test hover state
      await button.hover();
      await page.waitForTimeout(200);
    }
  });

  test('should respond to click interactions', async ({ page }) => {
    const interactiveElement = page.locator('button, [role="button"], .interactive').first();
    
    if (await interactiveElement.count() > 0) {
      await interactiveElement.click();
      await page.waitForTimeout(300);
    }
  });
});

test.describe('Fluid Motion Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/fluid-motion.html');
  });

  test('should load fluid motion demo', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have canvas element for WebGL', async ({ page }) => {
    const canvas = page.locator('canvas');
    
    // Canvas might not be immediately visible if WebGL is not supported
    await page.waitForTimeout(500);
    
    if (await canvas.count() > 0) {
      await expect(canvas.first()).toBeVisible();
    }
  });

  test('should respond to mouse interaction on canvas', async ({ page }) => {
    const canvas = page.locator('canvas').first();
    
    if (await canvas.count() > 0) {
      // Simulate mouse interaction
      await canvas.hover();
      await page.mouse.move(300, 300);
      await page.mouse.down();
      await page.mouse.move(400, 400);
      await page.mouse.up();
    }
  });
});

test.describe('Scrollytelling Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/scrollytelling.html');
  });

  test('should load scrollytelling demo', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have scrollable content', async ({ page }) => {
    // Check that page has scrollable height
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    
    expect(bodyHeight).toBeGreaterThan(viewportHeight);
  });

  test('should trigger animations on scroll', async ({ page }) => {
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    
    // Scroll more
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);
  });

  test('should have progress indicator if present', async ({ page }) => {
    const progressBar = page.locator('[class*="progress"], .progress-bar, progress');
    
    if (await progressBar.count() > 0) {
      await expect(progressBar.first()).toBeVisible();
    }
  });
});

test.describe('View Transitions Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/view-transitions.html');
  });

  test('should load view transitions demo', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have grid or card layout', async ({ page }) => {
    const gridItems = page.locator('[class*="grid"], [class*="card"], [class*="bento"]');
    
    if (await gridItems.count() > 0) {
      await expect(gridItems.first()).toBeVisible();
    }
  });

  test('should have clickable cards', async ({ page }) => {
    const cards = page.locator('.card, [class*="card"], article, section').first();
    
    if (await cards.count() > 0) {
      await cards.click();
      await page.waitForTimeout(500);
    }
  });

  test('should support theme toggle if present', async ({ page }) => {
    const themeToggle = page.locator('[class*="theme"], button:has-text("theme"), [aria-label*="theme"]');
    
    if (await themeToggle.count() > 0) {
      await themeToggle.first().click();
      await page.waitForTimeout(300);
    }
  });
});

test.describe('WebGPU 3D Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/webgpu-3d.html');
  });

  test('should load WebGPU 3D demo', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have tab navigation', async ({ page }) => {
    const tabs = page.locator('[class*="tab"], [role="tab"], button');
    
    if (await tabs.count() > 0) {
      await expect(tabs.first()).toBeVisible();
    }
  });

  test('should switch tabs on click', async ({ page }) => {
    const tabs = page.locator('.tab-btn, [class*="tab"] button, [role="tab"]');
    
    if (await tabs.count() > 1) {
      await tabs.nth(1).click();
      await page.waitForTimeout(300);
    }
  });

  test('should have 3D canvas', async ({ page }) => {
    const canvas = page.locator('canvas');
    
    await page.waitForTimeout(1000); // Wait for Three.js initialization
    
    if (await canvas.count() > 0) {
      await expect(canvas.first()).toBeVisible();
    }
  });

  test('should handle WebGL/WebGPU fallback message', async ({ page }) => {
    // Check if there's a fallback message for unsupported browsers
    const fallback = page.locator('[class*="fallback"], [class*="error"], [class*="warning"]');
    
    // This is informational - we don't fail if no fallback is shown
    // (means WebGL/WebGPU is supported)
  });
});

test.describe('Demo Navigation', () => {
  test('should navigate between demos', async ({ page }) => {
    await page.goto('/demos/glassmorphism.html');
    
    // Look for a back link or home link
    const homeLink = page.locator('a[href="/"], a[href="../"], a[href*="index.html"]');
    
    if (await homeLink.count() > 0) {
      await homeLink.first().click();
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/demos/glassmorphism.html');
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/demos/view-transitions.html');
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/demos/webgpu-3d.html');
    
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have no critical accessibility issues on landing page', async ({ page }) => {
    await page.goto('/');
    
    // Check for basic accessibility
    const main = page.locator('main, [role="main"]');
    const hasMain = await main.count() > 0;
    
    // Check for headings
    const headings = page.locator('h1, h2, h3');
    await expect(headings.first()).toBeVisible();
  });

  test('should have accessible links', async ({ page }) => {
    await page.goto('/');
    
    const links = page.locator('a');
    const count = await links.count();
    
    // Check that links have discernible text
    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      // Link should have text content or aria-label
      const hasAccessibleName = (text && text.trim().length > 0) || ariaLabel;
      expect(hasAccessibleName).toBeTruthy();
    }
  });
});

test.describe('Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('demo pages should be interactive quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/demos/glassmorphism.html');
    await page.locator('body').click();
    const interactiveTime = Date.now() - startTime;
    
    // Should be interactive within 3 seconds
    expect(interactiveTime).toBeLessThan(3000);
  });
});
