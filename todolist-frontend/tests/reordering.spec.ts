import { test, expect } from '@playwright/test';

test.describe('Todo Reordering Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and set up test data
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Add multiple todos for reordering tests
    const todos = [
      { title: 'First Todo', description: 'Ranking 1', ranking: '1' },
      { title: 'Second Todo', description: 'Ranking 2', ranking: '2' },
      { title: 'Third Todo', description: 'Ranking 3', ranking: '3' },
      { title: 'Fourth Todo', description: 'Ranking 4', ranking: '4' },
    ];

    for (const todo of todos) {
      await page.getByRole('button', { name: '+ Add Todo' }).click();
      await page.getByLabel('Title').fill(todo.title);
      await page.getByLabel('Description').fill(todo.description);
      await page.getByLabel('Ranking').fill(todo.ranking);
      await page.getByRole('button', { name: '+ Add Todo' }).nth(1).click();

      // Wait for modal to close after each todo
      await page.waitForSelector('.modal-content', { state: 'detached', timeout: 5000 });
      // Wait a bit for todo to appear in list
      await page.waitForTimeout(200);
    }

    // Verify all todos were added
    await expect(page.locator('.todo-item')).toHaveCount(4, { timeout: 5000 });
  });

  test('should display todos in ranking order', async ({ page }) => {
    // Verify todos are displayed in the correct order
    const todoItems = page.locator('.todo-item');
    await expect(todoItems).toHaveCount(4);

    // Check the order by examining the titles
    await expect(todoItems.nth(0)).toContainText('First Todo');
    await expect(todoItems.nth(1)).toContainText('Second Todo');
    await expect(todoItems.nth(2)).toContainText('Third Todo');
    await expect(todoItems.nth(3)).toContainText('Fourth Todo');
  });

  test('should show ranking indicators', async ({ page }) => {
    // Check that ranking indicators are visible using the correct selector
    // Rankings are displayed in spans with class "todo-ranking"
    const rankings = page.locator('.todo-ranking');
    await expect(rankings).toHaveCount(4);

    // Check that #1, #2, #3, #4 rankings are present
    await expect(page.locator('.todo-ranking', { hasText: '#1' })).toBeVisible();
    await expect(page.locator('.todo-ranking', { hasText: '#2' })).toBeVisible();
    await expect(page.locator('.todo-ranking', { hasText: '#3' })).toBeVisible();
    await expect(page.locator('.todo-ranking', { hasText: '#4' })).toBeVisible();
  });

  test('should apply color coding to rankings', async ({ page }) => {
    // High priority rankings (1-3) should have special styling
    const firstTodo = page.locator('.todo-item').filter({ hasText: 'First Todo' });
    const secondTodo = page.locator('.todo-item').filter({ hasText: 'Second Todo' });
    const thirdTodo = page.locator('.todo-item').filter({ hasText: 'Third Todo' });
    const fourthTodo = page.locator('.todo-item').filter({ hasText: 'Fourth Todo' });

    // Rankings 1-3 should have priority CSS classes on the todo item itself
    // Check for red-priority, yellow-priority, or other priority classes
    await expect(firstTodo).toHaveClass(/priority/);
    await expect(secondTodo).toHaveClass(/priority/);
    await expect(thirdTodo).toHaveClass(/priority/);

    // Ranking 4+ should not have high priority styling
    const fourthClass = await fourthTodo.getAttribute('class');
    expect(fourthClass).not.toContain('red-priority');
    expect(fourthClass).not.toContain('yellow-priority');
  });

  test('should perform basic drag and drop reordering', async ({ page }) => {
    // Get references to todo items
    const firstTodo = page.locator('.todo-item').filter({ hasText: 'First Todo' }).first();
    const thirdTodo = page.locator('.todo-item').filter({ hasText: 'Third Todo' }).first();

    // Perform drag and drop - move first todo to third position
    await firstTodo.dragTo(thirdTodo, { timeout: 10000 });

    // Confirmation modal should appear
    await expect(page.getByRole('heading', { name: 'Confirm Reorder' })).toBeVisible({ timeout: 5000 });

    // Confirm the reorder
    await page.getByRole('button', { name: 'Confirm' }).click();

    // Wait for modal to close
    await page.waitForSelector('.modal-content', { state: 'detached', timeout: 5000 });

    // Check that the order has changed
    const todoItems = page.locator('.todo-item');
    await expect(todoItems.nth(0)).toContainText('Second Todo');
    await expect(todoItems.nth(1)).toContainText('Third Todo');
    await expect(todoItems.nth(2)).toContainText('First Todo');
    await expect(todoItems.nth(3)).toContainText('Fourth Todo');
  });

  test('should cancel drag and drop reordering', async ({ page }) => {
    // Perform drag and drop
    const firstTodo = page.locator('.todo-item').filter({ hasText: 'First Todo' }).first();
    const thirdTodo = page.locator('.todo-item').filter({ hasText: 'Third Todo' }).first();
    await firstTodo.dragTo(thirdTodo, { timeout: 10000 });

    // Confirmation modal should appear
    await expect(page.getByRole('heading', { name: 'Confirm Reorder' })).toBeVisible({ timeout: 5000 });

    // Cancel the reorder
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Wait for modal to close
    await page.waitForSelector('.modal-content', { state: 'detached', timeout: 5000 });

    // Order should remain unchanged
    const todoItems = page.locator('.todo-item');
    await expect(todoItems.nth(0)).toContainText('First Todo');
    await expect(todoItems.nth(1)).toContainText('Second Todo');
    await expect(todoItems.nth(2)).toContainText('Third Todo');
    await expect(todoItems.nth(3)).toContainText('Fourth Todo');
  });

  test('should not allow reordering of completed todos', async ({ page }) => {
    // Complete the first todo
    const firstTodo = page.locator('.todo-item').filter({ hasText: 'First Todo' });
    await firstTodo.locator('input[type="checkbox"]').click();

    // Wait for completed section to appear
    await expect(page.getByText('Completed')).toBeVisible();

    // The completed todo should be in the completed section and not draggable
    const completedTodos = page.locator('.todos-container').last();
    const completedTodo = completedTodos.locator('.todo-item').filter({ hasText: 'First Todo' });

    // Check that completed todo doesn't have drag handle or sortable attributes
    await expect(completedTodo.locator('[data-testid="drag-handle"]')).not.toBeVisible();
  });

  test('should maintain separate ordering for incomplete and completed todos', async ({ page }) => {
    // Complete the second todo
    const secondTodo = page.locator('.todo-item').filter({ hasText: 'Second Todo' });
    await secondTodo.locator('input[type="checkbox"]').click();

    // Check incomplete todos order (should remove second todo)
    const incompleteTodos = page.locator('.todos-container').first().locator('.todo-item');
    await expect(incompleteTodos).toHaveCount(3);
    await expect(incompleteTodos.nth(0)).toContainText('First Todo');
    await expect(incompleteTodos.nth(1)).toContainText('Third Todo');
    await expect(incompleteTodos.nth(2)).toContainText('Fourth Todo');

    // Check completed todos section
    await expect(page.getByText('Completed')).toBeVisible();
    const completedTodos = page.locator('.todos-container').last().locator('.todo-item');
    await expect(completedTodos).toHaveCount(1);
    await expect(completedTodos.nth(0)).toContainText('Second Todo');
  });

  test('should handle reordering with gaps in ranking numbers', async ({ page }) => {
    // Add a todo with a large ranking gap
    await page.getByRole('button', { name: '+ Add Todo' }).click();
    await page.getByLabel('Title').fill('High Ranking Todo');
    await page.getByLabel('Description').fill('Ranking 10');
    await page.getByLabel('Ranking').fill('10');
    await page.getByRole('button', { name: '+ Add Todo' }).nth(1).click();

    // Wait for modal to close
    await page.waitForSelector('.modal-content', { state: 'detached', timeout: 5000 });

    // Verify it appears at the end
    const todoItems = page.locator('.todo-item');
    await expect(todoItems).toHaveCount(5);
    await expect(todoItems.last()).toContainText('High Ranking Todo');

    // Reorder should still work correctly
    const firstTodo = page.locator('.todo-item').filter({ hasText: 'First Todo' }).first();
    const highRankingTodo = page.locator('.todo-item').filter({ hasText: 'High Ranking Todo' }).first();

    await firstTodo.dragTo(highRankingTodo, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Confirm Reorder' })).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.waitForSelector('.modal-content', { state: 'detached', timeout: 5000 });

    // Check new order - First Todo should now be near the end
    const updatedItems = page.locator('.todo-item');
    await expect(updatedItems.last()).toContainText('First Todo');
  });

  test('should update category todo counts after reordering', async ({ page }) => {
    // Check initial count
    await expect(page.getByRole('button', { name: /Personal Goals.*\(4\)/ })).toBeVisible();

    // Complete a todo
    const firstTodo = page.locator('.todo-item').filter({ hasText: 'First Todo' });
    await firstTodo.locator('input[type="checkbox"]').click();

    // Count should decrease by 1 for incomplete todos
    await expect(page.getByRole('button', { name: /Personal Goals.*\(3\)/ })).toBeVisible();

    // Uncomplete the todo
    const completedTodo = page.locator('.todos-container').last().locator('.todo-item').filter({ hasText: 'First Todo' });
    await completedTodo.locator('input[type="checkbox"]').click();

    // Count should increase back to 4
    await expect(page.getByRole('button', { name: /Personal Goals.*\(4\)/ })).toBeVisible();
  });

  test('should preserve reordering across page reloads', async ({ page }) => {
    // Perform a reorder
    const firstTodo = page.locator('.todo-item').filter({ hasText: 'First Todo' }).first();
    const thirdTodo = page.locator('.todo-item').filter({ hasText: 'Third Todo' }).first();
    await firstTodo.dragTo(thirdTodo, { timeout: 10000 });

    // Wait for confirmation modal
    await expect(page.getByRole('heading', { name: 'Confirm Reorder' })).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: 'Confirm' }).click();

    // Wait for modal to close
    await page.waitForSelector('.modal-content', { state: 'detached', timeout: 5000 });

    // Reload the page
    await page.reload();

    // Check that the new order is preserved
    const todoItems = page.locator('.todo-item');
    await expect(todoItems.nth(0)).toContainText('Second Todo');
    await expect(todoItems.nth(1)).toContainText('Third Todo');
    await expect(todoItems.nth(2)).toContainText('First Todo');
    await expect(todoItems.nth(3)).toContainText('Fourth Todo');
  });

  test('should handle keyboard-based reordering', async ({ page }) => {
    // Focus on the first todo item
    const firstTodo = page.locator('.todo-item').filter({ hasText: 'First Todo' });
    await firstTodo.focus();

    // Use keyboard shortcuts for drag and drop (Space to grab, Arrow keys to move, Space to drop)
    await page.keyboard.press('Space'); // Start drag
    await page.keyboard.press('ArrowDown'); // Move down one position
    await page.keyboard.press('ArrowDown'); // Move down another position
    await page.keyboard.press('Space'); // Drop

    // Confirmation modal should appear
    await expect(page.getByRole('heading', { name: 'Confirm Reorder' })).toBeVisible();
    await page.getByRole('button', { name: 'Confirm' }).click();

    // Check that keyboard reordering worked
    const todoItems = page.locator('.todo-item');
    await expect(todoItems.nth(0)).toContainText('Second Todo');
    await expect(todoItems.nth(1)).toContainText('Third Todo');
    await expect(todoItems.nth(2)).toContainText('First Todo');
  });
});