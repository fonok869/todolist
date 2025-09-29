import { test, expect } from '@playwright/test';

test.describe('Simple Anonymous User Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should load homepage and show basic elements', async ({ page }) => {
    await page.goto('/');

    // Should stay on homepage (not redirect)
    await expect(page).toHaveURL('/');

    // Should show title
    await expect(page.getByRole('heading', { name: 'Todo List Manager' })).toBeVisible();

    // Should show sign in link
    await expect(page.getByText('Sign In')).toBeVisible();

    // Should show category buttons
    await expect(page.getByRole('button', { name: /Personal Goals/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Professional Goals/ })).toBeVisible();
  });

  test('should add a new category', async ({ page }) => {
    await page.goto('/');

    // Click add category button
    await page.getByRole('button', { name: '+ Category' }).click();

    // Fill in category name and submit using nth to target the submit button
    await page.getByLabel('Category Name *').fill('Test Category');
    await page.getByRole('button', { name: '+ Category' }).nth(1).click();

    // Should show new category button
    await expect(page.getByRole('button', { name: /Test Category/ })).toBeVisible();
  });

  test('should add a todo item', async ({ page }) => {
    await page.goto('/');

    // Click add todo button
    await page.getByRole('button', { name: '+ Add Todo' }).click();

    // Fill form
    await page.getByLabel('Title').fill('Test Todo');
    await page.getByLabel('Description').fill('This is a test');
    await page.getByLabel('Ranking').fill('1');

    // Submit form using nth to target the submit button
    await page.getByRole('button', { name: '+ Add Todo' }).nth(1).click();

    // Should show todo
    await expect(page.getByText('Test Todo')).toBeVisible();
    await expect(page.getByText('This is a test')).toBeVisible();
  });

  test('should complete a todo', async ({ page }) => {
    await page.goto('/');

    // Add a todo first
    await page.getByRole('button', { name: '+ Add Todo' }).click();
    await page.getByLabel('Title').fill('Complete Me');
    await page.getByLabel('Ranking').fill('1');
    await page.getByRole('button', { name: '+ Add Todo' }).nth(1).click();

    // Click checkbox to complete
    const todoItem = page.locator('.todo-item').filter({ hasText: 'Complete Me' });
    await todoItem.locator('input[type="checkbox"]').click();

    // Should show completed section
    await expect(page.getByText('Completed')).toBeVisible();
  });

  test('should edit a todo', async ({ page }) => {
    await page.goto('/');

    // Add a todo first
    await page.getByRole('button', { name: '+ Add Todo' }).click();
    await page.getByLabel('Title').fill('Edit Me');
    await page.getByLabel('Description').fill('Original description');
    await page.getByLabel('Ranking').fill('1');
    await page.getByRole('button', { name: '+ Add Todo' }).nth(1).click();

    // Click edit button
    const todoItem = page.locator('.todo-item').filter({ hasText: 'Edit Me' });
    await todoItem.getByRole('button', { name: 'Edit' }).click();

    // Update the todo
    await page.getByLabel('Title').clear();
    await page.getByLabel('Title').fill('Updated Title');
    await page.getByRole('button', { name: 'Update Todo' }).click();

    // Should show updated todo
    await expect(page.getByText('Updated Title')).toBeVisible();
  });
});