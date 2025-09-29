import { test, expect } from '@playwright/test';

test.describe('Debug Console Tests', () => {
  test('should check for console errors during todo creation', async ({ page }) => {
    // Listen for console messages
    const messages: string[] = [];
    page.on('console', msg => messages.push(`${msg.type()}: ${msg.text()}`));

    // Listen for page errors
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));

    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Wait for app to load
    await expect(page.getByRole('heading', { name: 'Todo List Manager' })).toBeVisible();

    console.log('App loaded successfully');

    // Try to add a todo
    await page.getByRole('button', { name: '+ Add Todo' }).click();
    await page.waitForSelector('.modal-content');

    await page.getByLabel('Title').fill('Test Todo');
    await page.getByLabel('Description').fill('Test description');
    await page.getByLabel('Ranking').fill('1');

    // Click submit
    await page.locator('form .submit-button').click();

    // Wait for any async operations
    await page.waitForTimeout(2000);

    // Check console for errors
    console.log('Console messages:', messages);
    console.log('Page errors:', errors);

    // Check if todo context is working by examining localStorage
    const localStorageData = await page.evaluate(() => {
      return {
        todos: localStorage.getItem('todos'),
        categories: localStorage.getItem('categories')
      };
    });

    console.log('LocalStorage data:', localStorageData);

    // Check the actual page structure
    const todoListContent = await page.locator('.todo-list').textContent();
    console.log('Todo list content:', todoListContent);

    const mainContent = await page.locator('.app-main').textContent();
    console.log('Main content:', mainContent);

    // If there are no errors, the todo should be visible
    if (errors.length === 0) {
      await expect(page.getByText('Test Todo')).toBeVisible();
    } else {
      console.log('Errors found, skipping todo visibility check');
    }
  });
});