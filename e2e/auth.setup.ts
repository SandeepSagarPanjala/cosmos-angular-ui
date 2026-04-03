import { test as setup, expect } from '@playwright/test';
import { STORAGE_STATE } from '../playwright.config';
import fs from 'fs';
import path from 'path';

setup('authenticate and safely cache state', async ({ page }) => {
  // Ensure the authentication directory exists for Playwright to write to
  const authDir = path.dirname(STORAGE_STATE);
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

  // 1. Intercept the network POST request exactly like a human user logging in
  await page.route('**/api/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      json: {
        accessToken: 'global-fake-e2e-jwt-token',
        user: { id: 1, name: 'Sandeep', username: 'sandeep' },
      },
    });
  });

  await page.goto('/login');

  await page.fill('input[formControlName="username"]', 'sandeep');
  await page.fill('input[formControlName="password"]', 'test1234');
  await page.click('button[type="submit"]');

  // 2. Ensuring the frontend correctly accepts our mock and routes to the dashboard
  await expect(page).toHaveURL(/\/dashboard/);

  // Implicitly waiting guarantees the application had exactly enough time to commit tokens to localStorage natively via the guard mechanisms
  await page.waitForTimeout(500);

  // 3. Command Playwright to strictly extract all `localStorage`, `sessionStorage` and cookies
  // Playwright physically writes this output into `user.json`
  await page.context().storageState({ path: STORAGE_STATE });
});
