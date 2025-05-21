import { test, expect } from '@playwright/test';

test('Home page loads correctly', async ({ page }) => {
  await page.goto('/');
  
  // Check if the page title is correct
  await expect(page).toHaveTitle(/Multilingual Navigation Site/);
  
  // Check if the navbar is visible
  await expect(page.locator('nav')).toBeVisible();
  
  // Check if the language switcher is visible
  await expect(page.getByRole('button', { name: /language/i })).toBeVisible();
  
  // Check if the theme switcher is visible
  await expect(page.getByRole('button', { name: /theme/i })).toBeVisible();
  
  // Check if the hero section is visible
  await expect(page.locator('.hero-section')).toBeVisible();
  
  // Check if the category modules are visible
  await expect(page.locator('.category-module')).toBeVisible();
});

test('Language switching works', async ({ page }) => {
  await page.goto('/');
  
  // Click on language switcher
  await page.getByRole('button', { name: /language/i }).click();
  
  // Select Chinese language
  await page.getByRole('menuitem', { name: /中文/i }).click();
  
  // Check if URL contains zh locale
  await expect(page).toHaveURL(/\/zh\//);
  
  // Check if content is in Chinese
  await expect(page.locator('h1')).toContainText(/导航/);
  
  // Switch back to English
  await page.getByRole('button', { name: /语言/i }).click();
  await page.getByRole('menuitem', { name: /English/i }).click();
  
  // Check if URL contains en locale
  await expect(page).toHaveURL(/\/en\//);
  
  // Check if content is in English
  await expect(page.locator('h1')).toContainText(/Navigation/);
});

test('Theme switching works', async ({ page }) => {
  await page.goto('/');
  
  // Get initial theme
  const initialTheme = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });
  
  // Click theme switcher
  await page.getByRole('button', { name: /theme/i }).click();
  
  // Check if theme has changed
  const newTheme = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });
  
  expect(newTheme).not.toEqual(initialTheme);
});

test('Tool card links work', async ({ page }) => {
  await page.goto('/');
  
  // Click on the first tool card
  const firstToolCard = page.locator('.tool-card').first();
  const toolUrl = await firstToolCard.getAttribute('href');
  
  // Check if the tool card has a valid URL
  expect(toolUrl).toBeTruthy();
  expect(toolUrl).toMatch(/^https?:\/\//);
});

test('Blog page loads correctly', async ({ page }) => {
  await page.goto('/blog');
  
  // Check if the blog title is visible
  await expect(page.locator('h1')).toContainText(/Blog/);
  
  // Check if blog posts are visible
  await expect(page.locator('.blog-post')).toBeVisible();
  
  // Check if blog sidebar is visible
  await expect(page.locator('.blog-sidebar')).toBeVisible();
});

test('Blog post page loads correctly', async ({ page }) => {
  // Go to blog page first
  await page.goto('/blog');
  
  // Click on the first blog post
  await page.locator('.blog-post a').first().click();
  
  // Check if the blog post content is visible
  await expect(page.locator('.blog-post')).toBeVisible();
  
  // Check if the blog post title is visible
  await expect(page.locator('.blog-post h2')).toBeVisible();
  
  // Check if the blog author section is visible
  await expect(page.locator('.blog-author')).toBeVisible();
  
  // Check if the blog share section is visible
  await expect(page.locator('.blog-share')).toBeVisible();
  
  // Check if the comment section is visible
  await expect(page.locator('.comment-section')).toBeVisible();
});

test('Search functionality works', async ({ page }) => {
  await page.goto('/');
  
  // Type in the search box
  await page.getByPlaceholder(/Search/i).fill('nextjs');
  await page.getByPlaceholder(/Search/i).press('Enter');
  
  // Check if search results are displayed
  await expect(page.locator('h1')).toContainText(/Search Results/i);
  
  // Check if search results contain the search term
  await expect(page.locator('.search-results')).toContainText(/nextjs/i);
});

test('Donation button works', async ({ page }) => {
  await page.goto('/');
  
  // Click on donation button
  await page.getByRole('button', { name: /donate/i }).click();
  
  // Check if donation modal is visible
  await expect(page.locator('.donation-modal')).toBeVisible();
  
  // Check if WeChat QR code is visible
  await expect(page.locator('.donation-modal img[alt*="WeChat"]')).toBeVisible();
  
  // Check if Ko-fi link is visible
  await expect(page.locator('.donation-modal a[href*="ko-fi"]')).toBeVisible();
});
