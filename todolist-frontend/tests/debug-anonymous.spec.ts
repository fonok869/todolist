import { test, expect } from '@playwright/test';

test.describe('Debug Anonymous User Tests', () => {
  test('should debug todo form submission', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Debug: Check initial state
    console.log('Initial page loaded');

    // Click add todo button
    await page.getByRole('button', { name: '+ Add Todo' }).click();

    // Wait for modal and debug its contents
    await page.waitForSelector('.modal-content');
    console.log('Modal opened');

    // Check if form fields are present
    const titleInput = page.getByLabel('Title');
    await expect(titleInput).toBeVisible();
    console.log('Title input found');

    const descInput = page.getByLabel('Description');
    await expect(descInput).toBeVisible();
    console.log('Description input found');

    const rankingInput = page.getByLabel('Ranking');
    await expect(rankingInput).toBeVisible();
    console.log('Ranking input found');

    // Fill the form
    await titleInput.fill('Debug Todo');
    await descInput.fill('Debug description');
    await rankingInput.fill('1');
    console.log('Form filled');

    // Debug: Check button count and text
    const buttons = await page.getByRole('button', { name: /Add Todo/i }).all();
    console.log(`Found ${buttons.length} "Add Todo" buttons`);

    for (let i = 0; i < buttons.length; i++) {
      const text = await buttons[i].textContent();
      console.log(`Button ${i}: "${text}"`);
    }

    // Try clicking the submit button using form selector
    const submitButton = page.locator('form .submit-button');
    await expect(submitButton).toBeVisible();
    console.log('Submit button found');

    await submitButton.click();
    console.log('Submit button clicked');

    // Wait a bit and check if todo appears
    await page.waitForTimeout(1000);

    // Check if modal closed
    const modalVisible = await page.locator('.modal-content').isVisible();
    console.log(`Modal still visible: ${modalVisible}`);

    // Check if todo appears
    const todoVisible = await page.getByText('Debug Todo').isVisible();
    console.log(`Todo visible: ${todoVisible}`);

    if (!todoVisible) {
      // Debug: Check what's in the page
      const pageContent = await page.locator('body').textContent();
      console.log('Page content:', pageContent);
    }

    await expect(page.getByText('Debug Todo')).toBeVisible();
  });
});