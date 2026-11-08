import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

async function openApp(page: import('@playwright/test').Page): Promise<void> {
	await page.goto('/');
	const intro = page.getByRole('button', { name: /get started/i });
	await intro.waitFor({ state: 'visible', timeout: 1_500 }).catch(() => {});
	if (await intro.isVisible()) await intro.click();
}

for (const screen of ['Bench', 'Notebook', 'Table', 'Settings']) {
	test(`${screen} has no axe violations`, async ({ page }) => {
		await openApp(page);
		if (screen !== 'Bench') {
			await page.getByRole('button', { name: screen }).click();
		}

		const results = await new AxeBuilder({ page }).analyze();
		expect(results.violations).toEqual([]);
	});
}

test('forges with the keyboard only', async ({ page }) => {
	await openApp(page);

	const hydrogen = page.getByRole('button', { name: /hydrogen/i }).first();
	await hydrogen.focus();
	await page.keyboard.press('Enter');
	await page.keyboard.press('Enter');

	await page.getByRole('button', { name: /^forge$/i }).focus();
	await page.keyboard.press('Enter');

	await expect(page.getByRole('dialog', { name: /helium/i })).toBeVisible();
});
