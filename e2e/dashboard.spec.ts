import { test, expect } from '@playwright/test';

// Because of `playwright.config.ts`, this entire suite gets a browser injected with the `user.json` storage file ALREADY existing!
test.describe('Dashboard View (Pre-Authenticated)', () => {
  test('dashboard renders completely bypassing the login wall', async ({ page }) => {
    // 1. Because the JWT token already physically exists in this page's localStorage,
    // the Angular AuthGuard will allow this implicit navigation instantly!
    await page.goto('/dashboard');
    
    // 2. Validate we truly bypassed `/login` and stayed securely on the `/dashboard`
    await expect(page).toHaveURL(/\/dashboard/);

    // 3. Ensure some contextual identifier of the dashboard painted
    await expect(page.locator('body')).toContainText(/Secure Dashboard/i, { ignoreCase: true });
  });
});
