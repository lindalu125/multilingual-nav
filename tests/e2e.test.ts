import { test, expect } from '@playwright/test';

// Basic navigation and UI tests
test.describe('Basic UI Tests', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Multilingual Navigation Site/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('language switcher works', async ({ page }) => {
    await page.goto('/');
    
    // Switch to Chinese
    await page.locator('button:has-text("English")').click();
    await page.locator('a:has-text("中文")').click();
    
    // Verify URL contains zh locale
    expect(page.url()).toContain('/zh');
    
    // Switch back to English
    await page.locator('button:has-text("中文")').click();
    await page.locator('a:has-text("English")').click();
    
    // Verify URL contains en locale
    expect(page.url()).toContain('/en');
  });

  test('theme switcher works', async ({ page }) => {
    await page.goto('/');
    
    // Get initial theme
    const initialTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    });
    
    // Click theme switcher
    await page.locator('[aria-label="Toggle theme"]').click();
    
    // Get new theme
    const newTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    });
    
    // Verify theme changed
    expect(newTheme).not.toEqual(initialTheme);
  });
});

// Authentication tests
test.describe('Authentication', () => {
  test('login page loads correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h2:has-text("Login")')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('register page loads correctly', async ({ page }) => {
    await page.goto('/register');
    await expect(page.locator('h2:has-text("Create an account")')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});

// Tools navigation tests
test.describe('Tools Navigation', () => {
  test('tools page loads correctly', async ({ page }) => {
    await page.goto('/tools');
    await expect(page.locator('h1:has-text("Tools")')).toBeVisible();
  });

  test('search functionality works', async ({ page }) => {
    await page.goto('/tools');
    await page.locator('input[placeholder*="Search"]').fill('test');
    await page.keyboard.press('Enter');
    
    // Wait for search results
    await page.waitForLoadState('networkidle');
  });
});

// Blog tests
test.describe('Blog Functionality', () => {
  test('blog page loads correctly', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('h1:has-text("Blog")')).toBeVisible();
  });

  test('blog post page loads correctly', async ({ page }) => {
    // This assumes there's at least one blog post
    await page.goto('/blog');
    const firstPost = page.locator('.blog-post-card').first();
    await firstPost.click();
    
    // Verify we're on a blog post page
    await expect(page.locator('article')).toBeVisible();
  });
});

// Responsive design tests
test.describe('Responsive Design', () => {
  test('mobile menu works on small screens', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Mobile menu button should be visible
    await expect(page.locator('button[aria-label="Toggle menu"]')).toBeVisible();
    
    // Click mobile menu button
    await page.locator('button[aria-label="Toggle menu"]').click();
    
    // Navigation links should be visible
    await expect(page.locator('nav a:has-text("Home")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Tools")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Blog")')).toBeVisible();
  });
});

// Multi-language content tests
test.describe('Multi-language Content', () => {
  test('content is translated correctly', async ({ page }) => {
    // English
    await page.goto('/en');
    const englishTitle = await page.locator('h1').textContent();
    
    // Chinese
    await page.goto('/zh');
    const chineseTitle = await page.locator('h1').textContent();
    
    // Titles should be different in different languages
    expect(englishTitle).not.toEqual(chineseTitle);
  });
});
