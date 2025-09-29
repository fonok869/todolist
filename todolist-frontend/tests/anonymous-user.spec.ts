import { test, expect } from '@playwright/test';

test.describe('Anonymous User Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test to ensure clean state
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should load anonymous homepage without authentication', async ({ page }) => {
    await page.goto('/');

    // Should stay on homepage (not redirect to login)
    await expect(page).toHaveURL('/');

    // Should show main UI elements
    await expect(page.getByRole('heading', { name: 'Todo List Manager' })).toBeVisible();
    await expect(page.getByText('Sign In')).toBeVisible();

    // Should show default categories (use button selectors to avoid conflicts)
    await expect(page.getByRole('button', { name: /Personal Goals/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Professional Goals/ })).toBeVisible();
  });

  test('should add a new category', async ({ page }) => {
    await page.goto('/');

    // Click add category button
    await page.getByRole('button', { name: '+ Category' }).click();

    // Modal should appear
    await expect(page.getByRole('heading', { name: 'Add New Category' })).toBeVisible();

    // Fill in category name
    await page.getByLabel('Category Name *').fill('Health & Fitness');

    // Submit the form - use the submit button inside the form
    await page.getByRole('button', { name: '+ Category' }).nth(1).click();

    // New category should appear
    await expect(page.getByRole('button', { name: /Health & Fitness/ })).toBeVisible();
  });

  test('should prevent adding duplicate categories', async ({ page }) => {
    await page.goto('/');

    // Try to add a category with same name as existing one
    await page.getByRole('button', { name: '+ Category' }).click();
    await page.getByLabel('Category Name *').fill('Personal Goals');

    // Handle the alert dialog that appears for duplicate categories
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('already exists');
      await dialog.accept();
    });

    await page.getByRole('button', { name: '+ Category' }).nth(1).click();

    // Modal should still be open after error
    await expect(page.getByRole('heading', { name: 'Add New Category' })).toBeVisible();

    // Close the modal
    await page.getByRole('button', { name: 'Cancel' }).click();
  });

  test('should add multiple todos to a category', async ({ page }) => {
    await page.goto('/');

    // Ensure we're on Personal Goals category
    await page.getByRole('button', { name: /Personal Goals/ }).click();

    // Add first todo
    await page.getByRole('button', { name: '+ Add Todo' }).click();
    await expect(page.getByRole('heading', { name: 'Add Todo' })).toBeVisible();

    await page.getByLabel('Title').fill('Learn React Testing');
    await page.getByLabel('Description').fill('Master Playwright for E2E testing');
    await page.getByLabel('Ranking').fill('1');
    await page.getByRole('button', { name: '+ Add Todo' }).nth(1).click();

    // First todo should appear
    await expect(page.getByText('Learn React Testing')).toBeVisible();
    await expect(page.getByText('Master Playwright for E2E testing')).toBeVisible();

    // Add second todo
    await page.getByRole('button', { name: '+ Add Todo' }).nth(0).click();
    await page.getByLabel('Title').fill('Exercise Daily');
    await page.getByLabel('Description').fill('30 minutes of cardio exercise');
    await page.getByLabel('Ranking').fill('2');
    await page.getByRole('button', { name: '+ Add Todo' }).nth(1).click();

    // Second todo should appear
    await expect(page.getByText('Exercise Daily')).toBeVisible();
    await expect(page.getByText('30 minutes of cardio exercise')).toBeVisible();

    // Category button should show count
    await expect(page.getByRole('button', { name: /Personal Goals.*\(2\)/ })).toBeVisible();
  });

  test('should handle ranking conflicts with modal', async ({ page }) => {
    await page.goto('/');

    // Add first todo with ranking 3
    await page.getByRole('button', { name: '+ Add Todo' }).click();
    await page.getByLabel('Title').fill('First Todo');
    await page.getByLabel('Description').fill('This has ranking 3');
    await page.getByLabel('Ranking').fill('3');
    await page.getByRole('button', { name: '+ Add Todo' }).nth(1).click();

    // Add second todo with same ranking (should trigger conflict modal)
    await page.getByRole('button', { name: '+ Add Todo' }).nth(0).click();
    await page.getByLabel('Title').fill('Second Todo');
    await page.getByLabel('Description').fill('This also wants ranking 3');
    await page.getByLabel('Ranking').fill('3');
    await page.getByRole('button', { name: '+ Add Todo' }).nth(1).click();

    // Conflict modal should appear
    await expect(page.getByRole('heading', { name: 'Ranking Conflict Detected' })).toBeVisible();
    await expect(page.getByText('First Todo')).toBeVisible();
    await expect(page.getByText('Second Todo')).toBeVisible();

    // Choose to push items down
    await page.getByRole('button', { name: 'Yes, Push Items Down' }).click();

    // Both todos should now be visible
    await expect(page.getByText('First Todo')).toBeVisible();
    await expect(page.getByText('Second Todo')).toBeVisible();
  });

  test('should complete and uncomplete todos', async ({ page }) => {
    await page.goto('/');

    // Add a todo
    await page.getByRole('button', { name: '+ Add Todo' }).click();
    await page.getByLabel('Title').fill('Test Todo');
    await page.getByLabel('Description').fill('This is for testing completion');
    await page.getByLabel('Ranking').fill('1');
    await page.getByRole('button', { name: '+ Add Todo' }).nth(1).click();

    // Find and click the checkbox to complete the todo
    const todoItem = page.locator('.todo-item').filter({ hasText: 'Test Todo' });
    await todoItem.locator('input[type="checkbox"]').click();

    // Todo should move to completed section
    await expect(page.getByText('Completed')).toBeVisible();

    // Click checkbox again to uncomplete
    const completedTodo = page.locator('.todos-container').last().locator('.todo-item').filter({ hasText: 'Test Todo' });
    await completedTodo.locator('input[type="checkbox"]').click();

    // Todo should move back to active section
    await expect(page.locator('.todos-container').first()).toContainText('Test Todo');
  });

  test('should edit existing todos', async ({ page }) => {
    await page.goto('/');

    // Add a todo
    await page.getByRole('button', { name: '+ Add Todo' }).click();
    await page.getByLabel('Title').fill('Original Title');
    await page.getByLabel('Description').fill('Original description');
    await page.getByLabel('Ranking').fill('5');
    await page.getByRole('button', { name: '+ Add Todo' }).nth(1).click();

    // Find and click edit button
    const todoItem = page.locator('.todo-item').filter({ hasText: 'Original Title' });
    await todoItem.getByRole('button', { name: 'Edit' }).click();

    // Edit modal should appear with pre-filled values
    await expect(page.getByRole('heading', { name: 'Edit Todo' })).toBeVisible();
    await expect(page.getByDisplayValue('Original Title')).toBeVisible();

    // Update the todo
    await page.getByLabel('Title').clear();
    await page.getByLabel('Title').fill('Updated Title');
    await page.getByLabel('Description').clear();
    await page.getByLabel('Description').fill('Updated description');
    await page.getByLabel('Ranking').clear();
    await page.getByLabel('Ranking').fill('7');
    await page.getByRole('button', { name: 'Update Todo' }).click();

    // Updated todo should be visible
    await expect(page.getByText('Updated Title')).toBeVisible();
    await expect(page.getByText('Updated description')).toBeVisible();
  });

  test('should switch between categories', async ({ page }) => {
    await page.goto('/');

    // Add todo to Personal Goals
    await page.getByRole('button', { name: /Personal Goals/ }).click();
    await page.getByRole('button', { name: '+ Add Todo' }).click();
    await page.getByLabel('Title').fill('Personal Task');
    await page.getByLabel('Ranking').fill('1');
    await page.getByRole('button', { name: '+ Add Todo' }).nth(1).click();

    // Switch to Professional Goals
    await page.getByRole('button', { name: /Professional Goals/ }).click();

    // Should not see personal task
    await expect(page.getByText('Personal Task')).not.toBeVisible();

    // Add todo to Professional Goals
    await page.getByRole('button', { name: '+ Add Todo' }).click();
    await page.getByLabel('Title').fill('Work Task');
    await page.getByLabel('Ranking').fill('1');
    await page.getByRole('button', { name: '+ Add Todo' }).nth(1).click();

    // Should see work task
    await expect(page.getByText('Work Task')).toBeVisible();

    // Switch back to Personal Goals
    await page.getByRole('button', { name: /Personal Goals/ }).click();

    // Should see personal task again, but not work task
    await expect(page.getByText('Personal Task')).toBeVisible();
    await expect(page.getByText('Work Task')).not.toBeVisible();
  });

  test('should delete categories with confirmation', async ({ page }) => {
    await page.goto('/');

    // Add a new category first
    await page.getByRole('button', { name: '+ Category' }).click();
    await page.getByLabel('Category Name *').fill('Temporary Category');
    await page.getByRole('button', { name: '+ Category' }).nth(1).click();

    // Find and click remove button on the new category
    const categoryItem = page.locator('.category-item').filter({ hasText: 'Temporary Category' });
    await categoryItem.locator('.remove-category-button').click();

    // Confirmation modal should appear
    await expect(page.getByRole('heading', { name: 'Delete Category' })).toBeVisible();

    // Confirm deletion
    await page.getByRole('button', { name: 'Yes, Delete Category' }).click();

    // Category should be removed
    await expect(page.getByText('Temporary Category')).not.toBeVisible();
  });

  test('should preserve data in localStorage', async ({ page }) => {
    await page.goto('/');

    // Add a category and todo
    await page.getByRole('button', { name: '+ Category' }).click();
    await page.getByLabel('Category Name *').fill('Persistent Category');
    await page.getByRole('button', { name: '+ Category' }).nth(1).click();

    await page.getByRole('button', { name: '+ Add Todo' }).click();
    await page.getByLabel('Title').fill('Persistent Todo');
    await page.getByLabel('Ranking').fill('1');
    await page.getByRole('button', { name: '+ Add Todo' }).nth(1).click();

    // Reload the page
    await page.reload();

    // Data should still be there
    await expect(page.getByRole('button', { name: /Persistent Category/ })).toBeVisible();
    await expect(page.getByText('Persistent Todo')).toBeVisible();
  });

  test('should handle empty state messaging', async ({ page }) => {
    await page.goto('/');

    // Should show empty state for default categories
    await expect(page.getByText('No todos in this category yet. Add your first todo!')).toBeVisible();

    // Add a todo
    await page.getByRole('button', { name: '+ Add Todo' }).click();
    await page.getByLabel('Title').fill('First Todo');
    await page.getByLabel('Ranking').fill('1');
    await page.getByRole('button', { name: '+ Add Todo' }).nth(1).click();

    // Empty state should disappear
    await expect(page.getByText('No todos in this category yet. Add your first todo!')).not.toBeVisible();

    // Switch to empty category
    await page.getByRole('button', { name: /Professional Goals/ }).click();

    // Should show empty state again
    await expect(page.getByText('No todos in this category yet. Add your first todo!')).toBeVisible();
  });
});