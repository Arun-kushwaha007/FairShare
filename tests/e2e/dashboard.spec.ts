import { test, expect } from '@playwright/test';

const randomEmail = () => `dashboard_ui_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`;

test.describe('Dashboard UI', () => {
  test('User can log in and view dashboard', async ({ page, request }) => {
    const email = randomEmail();
    const password = 'PasswordUI123!';

    // Seed user via API to avoid UI registration flakiness in testing
    const apiBaseUrl = process.env.E2E_API_BASE_URL ?? 'http://localhost:3001/api/v1';
    const registerResp = await request.post(`${apiBaseUrl}/auth/register`, {
      data: { name: 'UI User', email, password },
    });
    expect(registerResp.ok()).toBeTruthy();

    await test.step('Log into web app', async () => {
      await page.goto('/login');
      await page.fill('input[type="email"]', email);
      await page.fill('input[type="password"]', password);
      await page.click('button[type="submit"]');

      // Should redirect to dashboard
      await expect(page).toHaveURL(/\/dashboard/);
    });

    await test.step('Verify Dashboard Elements', async () => {
      // Check for navigation or header
      await expect(page.locator('h1', { hasText: 'Dashboard' }).first()).toBeVisible();
      
      // Removed flaky networkidle wait


      // The user doesn't have any groups yet, so check for empty state
      await expect(page.getByText('group', { exact: false }).first()).toBeVisible();
    });
  });
});
