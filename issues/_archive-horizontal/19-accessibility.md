# Issue 19 — Accessibility and keyboard flow

- **Status:** open
- **Labels:** `a11y`, `mendeleevs-mess`
- **Depends on:** [Issue 18](18-pwa.md)
- **Plan:** [Task 19](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

> Local implementation issue. The plan task is the source of truth; this file is the ticket.

## Goal

Keyboard-complete, screen-reader-friendly, axe-clean screens.

## Work

**Files:**

- Modify: `src/components/*` (focus styles, labels, live regions)
- Create: `e2e/a11y.spec.ts`
- Add dependency: `@axe-core/playwright`

**Interfaces:**

- Consumes: all screens
- Produces: keyboard-complete forge flow, focus-trapped overlays, no axe violations on primary screens

- [ ] **Step 1: Install and write the failing tests**

```bash
pnpm add -D @axe-core/playwright
```

`e2e/a11y.spec.ts`:

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const screen of ['Forge', 'Notebook', 'Table', 'Settings']) {
	test(`${screen} has no axe violations`, async ({ page }) => {
		await page.goto('/');
		const intro = page.getByRole('button', { name: /get started/i });
		if (await intro.count()) await intro.click();
		await page.getByRole('navigation').getByRole('button', { name: screen, exact: true }).click();
		const results = await new AxeBuilder({ page }).analyze();
		expect(results.violations).toEqual([]);
	});
}

test('forges with the keyboard only', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: /get started/i }).click();
	await page
		.getByRole('button', { name: /hydrogen/i })
		.first()
		.focus();
	await page.keyboard.press('Enter');
	await page
		.getByRole('button', { name: /hydrogen/i })
		.first()
		.focus();
	await page.keyboard.press('Enter');
	await page.getByRole('button', { name: /^forge$/i }).press('Enter');
	await expect(page.getByRole('dialog', { name: /helium/i })).toBeVisible();
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm e2e e2e/a11y.spec.ts`
Expected: FAIL on focus order or a missing accessible name.

- [ ] **Step 3: Fix**

- Ensure all interactive elements are native buttons/inputs with visible `:focus-visible` outlines.
- Add a single polite `aria-live` status region for discovery/failure/known messages.
- Focus trap in `DiscoveryOverlay`, `FirstRun`, and `WinScreen`; Escape closes; focus returns to the invoking control.
- 44 px minimum on nav, tray cards, slots, and toggles.
- Contrast ≥ 4.5:1 for text; category colors are stripes only.

- [ ] **Step 4: Verify**

Run: `pnpm e2e e2e/a11y.spec.ts`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "fix: complete keyboard, focus, and contrast accessibility"
```

## Definition of done

- [ ] Every step above is checked.
- [ ] The task's verification commands pass.
- [ ] Changes are committed with the message given in the plan.
- [ ] `Status` above is changed to `done`.
