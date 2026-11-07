# Issue 13 — Table view and layout data

- **Status:** open
- **Labels:** `ui`, `mendeleevs-mess`
- **Depends on:** [Issue 12](12-notebook.md)
- **Plan:** [Task 13](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

> Local implementation issue. The plan task is the source of truth; this file is the ticket.

## Goal

Sticker grid and classic 18-column periodic table views.

## Work

**Files:**

- Create: `src/data/tableLayout.ts`, `src/data/tableLayout.test.ts`, `src/components/TableScreen.tsx`, `src/components/PeriodicTable.tsx`, `src/components/StickerGrid.tsx`, `src/components/TableScreen.test.tsx`
- Modify: `src/App.tsx` (use the real table screen)

**Interfaces:**

- Consumes: `useGame`, `ELEMENTS`, `CATEGORIES`, `TABLE_LAYOUT`
- Produces:
  - `TABLE_LAYOUT: Record<string, { col: number; row: number }>`
  - `TableScreen()` with sticker/classic toggle and a missing-only filter
  - `PeriodicTable({ discovered, missingOnly })`
  - `StickerGrid({ discovered, missingOnly })`

- [ ] **Step 1: Write the failing layout test**

```ts
import { describe, expect, it } from 'vitest';
import { ELEMENTS } from './elements';
import { TABLE_LAYOUT } from './tableLayout';

describe('TABLE_LAYOUT', () => {
	it('places all 118 elements once', () => {
		expect(Object.keys(TABLE_LAYOUT)).toHaveLength(118);
		for (const e of ELEMENTS) expect(TABLE_LAYOUT[e.symbol]).toBeDefined();
		for (const { col, row } of Object.values(TABLE_LAYOUT)) {
			expect(col).toBeGreaterThanOrEqual(1);
			expect(col).toBeLessThanOrEqual(18);
			expect(row).toBeGreaterThanOrEqual(1);
			expect(row).toBeLessThanOrEqual(9);
		}
	});
});
```

- [ ] **Step 2: Write the failing screen tests**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { GameProvider } from '../game/useGame';
import { TableScreen } from './TableScreen';
import { gameState } from '../test/fixtures';
import { SAVE_KEY } from '../game/storage';

beforeEach(() => localStorage.clear());
function seed(discovered = ['H', 'He']) {
	localStorage.setItem(
		SAVE_KEY,
		JSON.stringify({
			version: 1,
			state: gameState({
				discovered,
				discoveredAt: Object.fromEntries(discovered.map((s, i) => [s, i + 1]))
			})
		})
	);
}

describe('TableScreen', () => {
	it('hides undiscovered symbols and reveals discovered ones', () => {
		seed(['H', 'He']);
		render(
			<GameProvider>
				<TableScreen />
			</GameProvider>
		);
		expect(screen.getAllByText('He').length).toBeGreaterThan(0);
		expect(screen.queryByText('Li')).not.toBeInTheDocument();
		expect(screen.getByText('2 / 118')).toBeInTheDocument();
	});

	it('toggles the classic layout', async () => {
		seed();
		render(
			<GameProvider>
				<TableScreen />
			</GameProvider>
		);
		await userEvent.click(screen.getByRole('button', { name: /classic table/i }));
		expect(screen.getByRole('region', { name: /periodic table/i })).toBeInTheDocument();
	});

	it('filters to missing elements', async () => {
		seed(['H']);
		render(
			<GameProvider>
				<TableScreen />
			</GameProvider>
		);
		await userEvent.click(screen.getByRole('checkbox', { name: /only missing/i }));
		expect(screen.queryByText('H')).not.toBeInTheDocument();
	});
});
```

- [ ] **Step 3: Run and confirm failure**

Run: `pnpm vitest run src/components/TableScreen.test.tsx src/data/tableLayout.test.ts`
Expected: FAIL.

- [ ] **Step 4: Implement**

- `TABLE_LAYOUT`: standard 18-column map. Main rows 1–7; lanthanides row 8 and actinides row 9, offset under columns 3–17.
- `StickerGrid`: rows of 10 by atomic number; this is the default on phones.
- `PeriodicTable`: CSS grid with `grid-column: col` and `grid-row: row`; horizontally pannable; `aria-label="Periodic table"`; undiscovered tiles show only the number and `aria-label="Element {n}, undiscovered"`.
- `TableScreen`: progress `{discovered.length} / 118`; toggle buttons "Sticker grid" and "Classic table"; checkbox "Only missing"; both views consume the same filtered list.

- [ ] **Step 5: Verify and commit**

Run: `pnpm vitest run src/components/TableScreen.test.tsx src/data/tableLayout.test.ts`
Expected: pass.

```bash
git add -A
git commit -m "feat: add sticker and classic periodic table views"
```

## Definition of done

- [ ] Every step above is checked.
- [ ] The task's verification commands pass.
- [ ] Changes are committed with the message given in the plan.
- [ ] `Status` above is changed to `done`.
