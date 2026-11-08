import { expect, test } from '@playwright/test';

test('is installable and works offline after the first load', async ({ page, context }) => {
	await page.goto('/');

	const manifestLink = page.locator('link[rel="manifest"]');
	await expect(manifestLink).toHaveAttribute('href', '/manifest.webmanifest');

	const manifest = await (
		await page.request.get(new URL('/manifest.webmanifest', page.url()).toString())
	).json();
	const sizes = manifest.icons.map((icon: { sizes: string }) => icon.sizes);
	expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']));

	await page.evaluate(async () => {
		await navigator.serviceWorker.ready;
	});

	await context.setOffline(true);
	await page.goto('/');
	await expect(page.getByRole('heading', { name: /mendeleev's mess/i })).toBeVisible();
	await context.setOffline(false);
});
