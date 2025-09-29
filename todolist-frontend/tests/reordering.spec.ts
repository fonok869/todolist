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
    }
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
    // Check that ranking indicators are visible
    await expect(page.getByText('#1')).toBeVisible();
    await expect(page.getByText('#2')).toBeVisible();
    await expect(page.getByText('#3')).toBeVisible();
    await expect(page.getByText('#4')).toBeVisible();
  });

  test('should apply color coding to rankings', async ({ page }) => {
    // High priority rankings (1-3) should have special styling
    const firstTodo = page.locator('.todo-item').filter({ hasText: 'First Todo' });
    const secondTodo = page.locator('.todo-item').filter({ hasText: 'Second Todo' });
    const thirdTodo = page.locator('.todo-item').filter({ hasText: 'Third Todo' });
    const fourthTodo = page.locator('.todo-item').filter({ hasText: 'Fourth Todo' });

    // Rankings 1-3 should have priority styling (red/yellow classes)
    await expect(firstTodo.locator('.ranking-indicator')).toHaveClass(/ranking-[1-3]/);
    await expect(secondTodo.locator('.ranking-indicator')).toHaveClass(/ranking-[1-3]/);
    await expect(thirdTodo.locator('.ranking-indicator')).toHaveClass(/ranking-[1-3]/);

    // Ranking 4+ should have default styling
    await expect(fourthTodo.locator('.ranking-indicator')).not.toHaveClass(/ranking-[1-3]/);
  });

  test('should perform basic drag and drop reordering', async ({ page }) => {
    // Get references to todo items
    const firstTodo = page.locator('.todo-item').filter({ hasText: 'First Todo' });
    const thirdTodo = page.locator('.todo-item').filter({ hasText: 'Third Todo' });

    // Perform drag and drop - move first todo to third position
    await firstTodo.dragTo(thirdTodo);

    // Confirmation modal should appear
    await expect(page.getByRole('heading', { name: 'Confirm Reorder' })).toBeVisible();
    await expect(page.getByText('Are you sure you want to save this new order?')).toBeVisible();

    // Confirm the reorder
    await page.getByRole('button', { name: 'Confirm' }).click();

    // Check that the order has changed
    const todoItems = page.locator('.todo-item');
    await expect(todoItems.nth(0)).toContainText('Second Todo');
    await expect(todoItems.nth(1)).toContainText('Third Todo');
    await expect(todoItems.nth(2)).toContainText('First Todo');
    await expect(todoItems.nth(3)).toContainText('Fourth Todo');
  });

  test('should cancel drag and drop reordering', async ({ page }) => {
    // Get current order
    const todoItems = page.locator('.todo-item');
    const originalFirstTitle = await todoItems.nth(0).textContent();

    // Perform drag and drop
    const firstTodo = page.locator('.todo-item').filter({ hasText: 'First Todo' });
    const thirdTodo = page.locator('.todo-item').filter({ hasText: 'Third Todo' });
    await firstTodo.dragTo(thirdTodo);

    // Confirmation modal should appear
    await expect(page.getByRole('heading', { name: 'Confirm Reorder' })).toBeVisible();

    // Cancel the reorder
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Order should remain unchanged
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

    // Verify it appears at the end
    const todoItems = page.locator('.todo-item');
    await expect(todoItems).toHaveCount(5);
    await expect(todoItems.last()).toContainText('High Ranking Todo');

    // Reorder should still work correctly
    const firstTodo = page.locator('.todo-item').filter({ hasText: 'First Todo' });
    const highRankingTodo = page.locator('.todo-item').filter({ hasText: 'High Ranking Todo' });

    await firstTodo.dragTo(highRankingTodo);
    await page.getByRole('button', { name: 'Confirm' }).click();

    // Check new order
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
    const firstTodo = page.locator('.todo-item').filter({ hasText: 'First Todo' });
    const thirdTodo = page.locator('.todo-item').filter({ hasText: 'Third Todo' });
    await firstTodo.dragTo(thirdTodo);
    await page.getByRole('button', { name: 'Confirm' }).click();

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