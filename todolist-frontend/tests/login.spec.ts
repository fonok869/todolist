import { test, expect } from '@playwright/test';

test.describe('Login functionality', () => {
  test('should load the login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Vite \+ React \+ TS/);
    await expect(page.getByRole('heading', { name: 'Log in to Your Todo List' })).toBeVisible();
  });

  test('should show UI elements correctly', async ({ page }) => {
    await page.goto('/login');

    // Check form elements are present
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
  });

  test('should show database error when backend is not properly configured', async ({ page }) => {
    await page.goto('/login');

    // Fill in the login form
    await page.getByLabel('Username').fill('testuser');
    await page.getByLabel('Password').fill('HalekTamasAKiraly');

    // Click login button
    await page.getByRole('button', { name: 'Log In' }).click();

    // Should show database error (since backend DB is not set up)
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.getByText(/Table.*not found/)).toBeVisible();
  });

  test('should stay on login page when form submission fails', async ({ page }) => {
    await page.goto('/login');

    // Fill in the login form
    await page.getByLabel('Username').fill('testuser');
    await page.getByLabel('Password').fill('HalekTamasAKiraly');

    // Click login button
    await page.getByRole('button', { name: 'Log In' }).click();

    // Should stay on login page due to backend error
    await expect(page).toHaveURL('/login');
  });
});