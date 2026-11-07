# Issue 20 — E2E regression, performance budget, and README

- **Status:** open
- **Labels:** `qa`, `mendeleevs-mess`
- **Depends on:** [Issue 19](19-accessibility.md)
- **Plan:** [Task 20](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

> Local implementation issue. The plan task is the source of truth; this file is the ticket.

## Goal

Regression e2e, 250 KB budget check, doodle motif art, and README.

## Work

**Files:**

- Create: `e2e/game.spec.ts`, `scripts/check-bundle.mjs`, `README.md`, `src/components/CategoryDoodle.tsx`
- Modify: `package.json` (scripts), styles for wide screens

**Interfaces:**

- Consumes: the finished app
- Produces: the full regression suite, gzip budget check, and operator documentation

- [ ] **Step 1: Write the regression e2e**

`e2e/game.spec.ts`:

```ts
import { expect, test } from '@playwright/test';
import { ELEMENTS, ELEMENT_BY_SYMBOL } from '../src/data/elements';

test('cold start forges helium in under 30 seconds', async ({ page }) => {
	const start = Date.now();
	await page.goto('/');
	await page.getByRole('button', { name: /get started/i }).click();
	await page
		.getByRole('button', { name: /hydrogen/i })
		.first()
		.click();
	await page
		.getByRole('button', { name: /hydrogen/i })
		.first()
		.click();
	await page.getByRole('button', { name: /^forge$/i }).click();
	await expect(page.getByRole('dialog', { name: /helium/i })).toBeVisible();
	await page.getByRole('button', { name: /nice/i }).click();
	await expect(page.getByText('2 / 118')).toBeVisible();
	expect(Date.now() - start).toBeLessThan(30_000);
});

test('desktop drag fills a forge slot', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/');
	await page.getByRole('button', { name: /get started/i }).click();
	const card = page.getByRole('button', { name: /hydrogen/i }).first();
	const slot = page.getByTestId('slot-1');
	await card.dragTo(slot);
	await expect(slot).toContainText('H');
});

test('progress survives a reload', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: /get started/i }).click();
	await page
		.getByRole('button', { name: /hydrogen/i })
		.first()
		.click();
	await page
		.getByRole('button', { name: /hydrogen/i })
		.first()
		.click();
	await page.getByRole('button', { name: /^forge$/i }).click();
	await page.getByRole('button', { name: /nice/i }).click();
	await page.reload();
	await expect(page.getByText('2 / 118')).toBeVisible();
});

test('completes at 118 without repeating the certificate', async ({ page }) => {
	const target = ELEMENTS[ELEMENTS.length - 1];
	const [a, b] = target.recipe!;
	const discovered = ELEMENTS.map((e) => e.symbol).filter((s) => s !== target.symbol);
	const state = {
		version: 1,
		discovered,
		discoveredAt: Object.fromEntries(discovered.map((s, i) => [s, i + 1])),
		attempts: 0,
		scrapLog: [],
		startedAt: 1,
		introSeen: true,
		completedAt: null,
		certificateSeen: false,
		completionStats: null,
		settings: { sound: false, reduceMotion: true },
		lastScreen: 'forge'
	};

	await page.goto('/');
	await page.evaluate(([key, saved]) => localStorage.setItem(key, saved), [
		'mendeleevs-mess:save:v1',
		JSON.stringify({ version: 1, state })
	] as const);
	await page.reload();

	const name = (s: string) => new RegExp(ELEMENT_BY_SYMBOL.get(s)!.name, 'i');
	await page
		.getByRole('button', { name: name(a) })
		.first()
		.click();
	await page
		.getByRole('button', { name: name(b) })
		.first()
		.click();
	await page.getByRole('button', { name: /^forge$/i }).click();
	await expect(page.getByRole('dialog', { name: /certificate/i })).toBeVisible();
	await page.getByRole('button', { name: /keep looking/i }).click();
	await expect(page.getByRole('dialog', { name: /certificate/i })).toHaveCount(0);
	await page.reload();
	await expect(page.getByRole('dialog', { name: /certificate/i })).toHaveCount(0);
});
```

Fill the third test concretely during implementation: import `ELEMENTS` from `../src/data/elements`, build `discovered` = all but the final element, set `completedAt: null`, set `discoveredAt`, and `page.addInitScript` to write the save. Find the missing element whose both parents are already in the set; forge that pair with two taps.

- [ ] **Step 2: Add the bundle budget**

`scripts/check-bundle.mjs`:

```js
import { readdirSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const dir = 'dist/assets';
const total = readdirSync(dir)
	.filter((f) => f.endsWith('.js'))
	.reduce((n, f) => n + gzipSync(readFileSync(`${dir}/${f}`)).length, 0);
const kb = total / 1024;
console.log(`Initial JS gzip: ${kb.toFixed(1)} KB`);
if (kb > 250) {
	console.error('Budget exceeded: initial JS must stay at or below 250 KB gzip.');
	process.exit(1);
}
```

Add `"check:bundle": "node scripts/check-bundle.mjs"`.

- [ ] **Step 3: Polish**

- Wide screens: two-column forge + tray, table visible at ≥ 1024 px; keep the 360 px layout intact.
- Paper texture and ruled lines; card wobble; ink stamp on discovery.
- Create `src/components/CategoryDoodle.tsx` with 10 simple inline SVG line doodles, one per category, plus a Mendeleev mascot used on the certificate and first-run screen. Reuse them on element pages and empty states instead of 118 bespoke illustrations.
- Verify `prefers-reduced-motion` and the settings toggle both suppress motion.
- README: what the game is, `pnpm dev`, `pnpm test`, `pnpm validate`, `pnpm build`, `pnpm preview`, `pnpm e2e`, how to add/flavor an element, the recipe reachability rule, deployment as static files.

- [ ] **Step 4: Final verification**

```bash
pnpm validate
pnpm typecheck
pnpm test
pnpm build
pnpm check:bundle
pnpm e2e
```

Expected: validator prints `118 elements, 118 reachable`; typecheck and tests pass; bundle ≤ 250 KB gzip; all e2e pass (including PWA/a11y).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test: add full regression suite, bundle budget, and README"
```

## Definition of done

- [ ] Every step above is checked.
- [ ] The task's verification commands pass.
- [ ] Changes are committed with the message given in the plan.
- [ ] `Status` above is changed to `done`.
