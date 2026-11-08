import { expect, test } from '@playwright/test';

test('forges helium and keeps it after reload', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByRole('heading', { name: /mendeleev's mess/i })).toBeVisible();
	await expect(page.getByText('1 / 118')).toBeVisible();

	const hydrogen = page.getByRole('button', { name: /hydrogen/i });
	await hydrogen.click();
	await hydrogen.click();
	await page.getByRole('button', { name: /^forge$/i }).click();

	await expect(page.getByRole('dialog', { name: /helium/i })).toBeVisible();
	await expect(page.getByText('2 / 118')).toBeVisible();
	await page.getByRole('button', { name: /nice/i }).click();

	await page.reload();
	await expect(page.getByText('2 / 118')).toBeVisible();
	await expect(page.getByRole('button', { name: /helium/i })).toBeVisible();
});

test('opens the table and shows all 118 tiles', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Table' }).click();

	await expect(page.getByRole('heading', { name: /the table/i })).toBeVisible();
	await expect(page.getByTestId('table-tile')).toHaveCount(118);
	await expect(page.getByRole('button', { name: /classic table/i })).toBeVisible();
});
