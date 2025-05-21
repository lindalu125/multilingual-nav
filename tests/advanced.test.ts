import { test, expect } from '@playwright/test';

// Test for Cloudflare R2 image upload functionality
test.describe('Image Upload Functionality', () => {
  // This test requires authentication
  test.beforeEach(async ({ page }) => {
    // Mock login since we can't actually test with real credentials
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('mock-auth', JSON.stringify({ authenticated: true, role: 'admin' }));
    });
  });

  test('image uploader component renders correctly', async ({ page }) => {
    await page.goto('/admin/blog/new');
    await expect(page.locator('text=Featured Image')).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeVisible();
  });
});

// Test for admin functionality
test.describe('Admin Functionality', () => {
  // Mock admin authentication
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('mock-auth', JSON.stringify({ authenticated: true, role: 'admin' }));
    });
  });

  test('admin dashboard loads correctly', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('h1:has-text("Admin Dashboard")')).toBeVisible();
  });

  test('tool management interface loads correctly', async ({ page }) => {
    await page.goto('/admin/tools');
    await expect(page.locator('button:has-text("Add Tool")')).toBeVisible();
  });
});

// Test for multilingual routes
test.describe('Multilingual Routes', () => {
  const languages = ['en', 'zh', 'es', 'fr', 'pt', 'ar', 'ru'];
  
  for (const lang of languages) {
    test(`${lang} routes work correctly`, async ({ page }) => {
      // Test homepage in this language
      await page.goto(`/${lang}`);
      await expect(page).toHaveURL(new RegExp(`/${lang}`));
      
      // Test tools page in this language
      await page.goto(`/${lang}/tools`);
      await expect(page).toHaveURL(new RegExp(`/${lang}/tools`));
      
      // Test blog page in this language
      await page.goto(`/${lang}/blog`);
      await expect(page).toHaveURL(new RegExp(`/${lang}/blog`));
    });
  }
});

// Test for RTL support (Arabic)
test.describe('RTL Support', () => {
  test('Arabic pages have RTL direction', async ({ page }) => {
    await page.goto('/ar');
    
    // Check if the html or body has dir="rtl"
    const hasRtlDirection = await page.evaluate(() => {
      return document.documentElement.dir === 'rtl' || document.body.dir === 'rtl';
    });
    
    expect(hasRtlDirection).toBeTruthy();
  });
});

// Test for donation functionality
test.describe('Donation Functionality', () => {
  test('donation button shows payment options', async ({ page }) => {
    await page.goto('/');
    
    // Click donation button
    await page.locator('button:has-text("Donate")').click();
    
    // Check if payment options are shown
    await expect(page.locator('text=WeChat Pay')).toBeVisible();
    await expect(page.locator('text=Ko-fi')).toBeVisible();
  });
});

// Performance tests
test.describe('Performance', () => {
  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Page should load in less than 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });
});

// Accessibility tests
test.describe('Accessibility', () => {
  test('main elements have proper ARIA attributes', async ({ page }) => {
    await page.goto('/');
    
    // Check if navigation has proper role
    await expect(page.locator('nav')).toHaveAttribute('aria-label');
    
    // Check if buttons have accessible names
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const hasAccessibleName = await button.evaluate(el => {
        return el.hasAttribute('aria-label') || el.textContent.trim() !== '';
      });
      expect(hasAccessibleName).toBeTruthy();
    }
  });
});
