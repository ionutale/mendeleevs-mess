# Issue 12 — Notebook, element page, and scrap log

- **Status:** open
- **Labels:** `ui`, `mendeleevs-mess`
- **Depends on:** [Issue 11](11-forge-screen.md)
- **Plan:** [Task 12](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

> Local implementation issue. The plan task is the source of truth; this file is the ticket.

## Goal

Notebook grid, element pages, and the persisted scrap log.

## Work

**Files:**

- Create: `src/components/NotebookScreen.tsx`, `src/components/ScrapLog.tsx`, `src/components/NotebookScreen.test.tsx`, `src/styles/screens.css`
- Modify: `src/components/ElementPage.tsx` (add parent/date fields), `src/App.tsx` (use the real notebook screen)

**Interfaces:**

- Consumes: `useGame`, `ELEMENTS`, `ELEMENT_BY_SYMBOL`, `CATEGORIES`
- Produces:
  - `ElementPage({ element, parents?, discoveredAt? })`
  - `NotebookScreen()` with newest-first grid, sort, category filter, search, detail view, and scrap log
  - `ScrapLog({ entries, onClear })`

- [ ] **Step 1: Write the failing tests**

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { GameProvider } from '../game/useGame';
import { NotebookScreen } from './NotebookScreen';
import { gameState } from '../test/fixtures';
import { SAVE_KEY } from '../game/storage';
import { ELEMENTS } from '../data/elements';

beforeEach(() => localStorage.clear());
function seed(overrides = {}) {
	localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 1, state: gameState(overrides) }));
}

describe('NotebookScreen', () => {
	it('opens an element page with its joke and discovery date', async () => {
		seed({ discovered: ['H', 'He'], discoveredAt: { H: 1_000, He: 2_000 } });
		render(
			<GameProvider>
				<NotebookScreen />
			</GameProvider>
		);
		await userEvent.click(screen.getByRole('button', { name: /helium/i }));
		const helium = ELEMENTS.find((e) => e.symbol === 'He')!;
		expect(screen.getByRole('heading', { name: /helium/i })).toBeInTheDocument();
		expect(screen.getByText(helium.flavor)).toBeInTheDocument();
		expect(screen.getByText(/discovered/i)).toBeInTheDocument();
	});

	it('lists and clears failed experiments', async () => {
		seed({
			discovered: ['H', 'Fe'],
			discoveredAt: { H: 1, Fe: 2 },
			scrapLog: [{ pair: ['H', 'Fe'], at: 3 }]
		});
		render(
			<GameProvider>
				<NotebookScreen />
			</GameProvider>
		);
		expect(screen.getByText(/H \+ Fe/)).toBeInTheDocument();
		await userEvent.click(screen.getByRole('button', { name: /clear failed experiments/i }));
		await waitFor(() => expect(screen.queryByText(/H \+ Fe/)).not.toBeInTheDocument());
	});

	it('searches discovered pages only', async () => {
		seed({ discovered: ['H', 'He'], discoveredAt: { H: 1, He: 2 } });
		render(
			<GameProvider>
				<NotebookScreen />
			</GameProvider>
		);
		await userEvent.type(screen.getByRole('searchbox'), 'iron');
		expect(screen.queryByRole('button', { name: /helium/i })).not.toBeInTheDocument();
	});
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm vitest run src/components/NotebookScreen.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

- `ElementPage`: large card, symbol, number, name, category label, flavor, category doodle motif placeholder, "First forged from X + Y" when parents exist, and `new Date(discoveredAt).toLocaleDateString()`.
- `NotebookScreen`: grid sorted newest-first by `discoveredAt`; sort control (`Newest`, `Number`, `Name`); category filter; search; click → detail; scrap log collapsible at the bottom with a clear action.
- `ScrapLog`: renders `A + B` using symbols, newest first; empty copy "No failed experiments. Suspicious."; clear button labeled "Clear failed experiments".

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run src/components/NotebookScreen.test.tsx`
Expected: pass.

```bash
git add -A
git commit -m "feat: add notebook, element pages, and scrap log"
```

## Definition of done

- [ ] Every step above is checked.
- [ ] The task's verification commands pass.
- [ ] Changes are committed with the message given in the plan.
- [ ] `Status` above is changed to `done`.
