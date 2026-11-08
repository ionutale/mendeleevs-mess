import { expect, test, type Page } from '@playwright/test';

async function openApp(page: Page): Promise<void> {
	await page.goto('/');
	const intro = page.getByRole('button', { name: /get started/i });
	await intro.waitFor({ state: 'visible', timeout: 1_500 }).catch(() => {});
	if (await intro.isVisible()) await intro.click();
}

test('forges helium and keeps it after reload', async ({ page }) => {
	await openApp(page);

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
	await openApp(page);
	await page.getByRole('button', { name: 'Table' }).click();

	await expect(page.getByRole('heading', { name: /the table/i })).toBeVisible();
	await expect(page.getByTestId('table-tile')).toHaveCount(118);
	await expect(page.getByRole('button', { name: /classic table/i })).toBeVisible();
});
