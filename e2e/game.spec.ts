import { expect, test, type Page } from '@playwright/test';
import { ELEMENTS } from '../src/lib/data/elements';

const SAVE_KEY = 'mendeleevs-mess:save:v1';
const allSymbols = ELEMENTS.map((element) => element.symbol);

async function openApp(page: Page): Promise<void> {
	await page.goto('/');
	const intro = page.getByRole('button', { name: /get started/i });
	await intro.waitFor({ state: 'visible', timeout: 1_500 }).catch(() => {});
	if (await intro.isVisible()) await intro.click();
}

async function seed(page: Page, state: Record<string, unknown>): Promise<void> {
	await page.goto('/');
	await page.evaluate(({ key, save }) => localStorage.setItem(key, save), {
		key: SAVE_KEY,
		save: JSON.stringify({ version: 1, state })
	});
	await page.reload();
}

test('completion shows once and stays reachable from settings', async ({ page }) => {
	await seed(page, {
		version: 1,
		discovered: allSymbols,
		discoveredAt: Object.fromEntries(allSymbols.map((symbol, index) => [symbol, index + 1])),
		attempts: 240,
		scrapLog: [],
		startedAt: 1,
		introSeen: true,
		completedAt: 9_000,
		certificateSeen: false,
		completionStats: { attempts: 240, startedAt: 1, completedAt: 9_000, elapsedMs: 8_999 },
		settings: { sound: true, reduceMotion: false },
		lastScreen: 'forge'
	});

	const certificate = page.getByRole('dialog', { name: /certificate/i });
	await expect(certificate).toBeVisible();
	await expect(certificate.getByText('118 / 118')).toBeVisible();
	await page.getByRole('button', { name: /keep looking/i }).click();

	await page.reload();
	await expect(page.getByRole('dialog', { name: /certificate/i })).toHaveCount(0);

	await page.getByRole('button', { name: 'Settings' }).click();
	await page.getByRole('button', { name: /view certificate/i }).click();
	await expect(page.getByRole('dialog', { name: /certificate/i })).toBeVisible();
});

test('settings survive a reload', async ({ page }) => {
	await openApp(page);
	await page.getByRole('button', { name: 'Settings' }).click();

	const sound = page.getByRole('checkbox', { name: /sound/i });
	await sound.uncheck();
	await page.reload();
	await page.getByRole('button', { name: 'Settings' }).click();
	await expect(page.getByRole('checkbox', { name: /sound/i })).not.toBeChecked();
});

test('desktop drag fills a forge slot', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await openApp(page);

	const card = page.getByRole('button', { name: /hydrogen/i }).first();
	const slot = page.getByTestId('slot-1');
	await card.dragTo(slot);
	await expect(slot).toContainText('H');
});

test('the notebook opens an element page', async ({ page }) => {
	await seed(page, {
		version: 1,
		discovered: ['H', 'He', 'O'],
		discoveredAt: { H: 1, He: 2, O: 3 },
		attempts: 3,
		scrapLog: [{ pair: ['H', 'Fe'], at: 4 }],
		startedAt: 1,
		introSeen: true,
		completedAt: null,
		certificateSeen: false,
		completionStats: null,
		settings: { sound: true, reduceMotion: false },
		lastScreen: 'notebook'
	});

	await expect(page.getByRole('heading', { name: /the notebook/i })).toBeVisible();
	await page.getByRole('button', { name: /oxygen/i }).click();
	await expect(page.getByRole('heading', { name: /oxygen/i })).toBeVisible();
	await expect(page.getByText(/first forged from/i)).toBeVisible();
	await expect(page.getByText('H + Fe')).toBeVisible();
});
