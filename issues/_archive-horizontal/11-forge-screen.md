# Issue 11 — Forge screen and discovery flow

- **Status:** open
- **Labels:** `ui`, `mendeleevs-mess`
- **Depends on:** [Issue 10](10-cards-tray.md)
- **Plan:** [Task 11](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

> Local implementation issue. The plan task is the source of truth; this file is the ticket.

## Goal

Complete forge loop with discovery, known/invalid outcomes, and a double-submit guard.

## Work

**Files:**

- Create: `src/components/ForgeScreen.tsx`, `src/components/DiscoveryOverlay.tsx`, `src/components/ElementPage.tsx`, `src/components/ForgeScreen.test.tsx`
- Modify: `src/App.tsx` (use the real forge screen)

**Interfaces:**

- Consumes: `useGame`, `findRecipe`, `ELEMENTS`, `FAILURE_LINES`, `Tray`, `Slot`
- Produces: the complete forge loop: fill slots, forge, outcomes, discovery overlay, failure toast, scrap log updates; and `ElementPage({ element, parents?, discoveredAt? })` for reuse by the notebook

- [ ] **Step 1: Write the failing forge tests**

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { GameProvider } from '../game/useGame';
import { ForgeScreen } from './ForgeScreen';
import { gameState } from '../test/fixtures';
import { SAVE_KEY } from '../game/storage';
import { ELEMENTS } from '../data/elements';
import { normalizePair } from '../game/engine';

function seed(overrides = {}) {
	localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 1, state: gameState(overrides) }));
}

beforeEach(() => localStorage.clear());

describe('ForgeScreen', () => {
	it('forges helium by tapping H twice and pressing FORGE', async () => {
		seed();
		render(
			<GameProvider>
				<ForgeScreen />
			</GameProvider>
		);
		const h = screen.getAllByRole('button', { name: /hydrogen/i });
		await userEvent.click(h[0]);
		await userEvent.click(screen.getAllByRole('button', { name: /hydrogen/i })[0]);
		await userEvent.click(screen.getByRole('button', { name: /^forge$/i }));
		expect(await screen.findByRole('dialog', { name: /helium/i })).toBeInTheDocument();
	});

	it('keeps both cards after an invalid pair and records scrap', async () => {
		const discovered = ELEMENTS.slice(0, 20).map((e) => e.symbol);
		const valid = new Set(
			ELEMENTS.filter((e) => e.recipe).map((e) =>
				normalizePair(e.recipe![0], e.recipe![1]).join('+')
			)
		);
		const [a, b] = discovered
			.flatMap((x, i) => discovered.slice(i).map((y) => [x, y] as [string, string]))
			.find(([x, y]) => !valid.has(normalizePair(x, y).join('+')))!;
		seed({ discovered, discoveredAt: Object.fromEntries(discovered.map((s, i) => [s, i + 1])) });
		render(
			<GameProvider>
				<ForgeScreen />
			</GameProvider>
		);
		const name = (s: string) => new RegExp(ELEMENTS.find((e) => e.symbol === s)!.name, 'i');
		await userEvent.click(screen.getByRole('button', { name: name(a) }));
		await userEvent.click(screen.getByRole('button', { name: name(b) }));
		await userEvent.click(screen.getByRole('button', { name: /^forge$/i }));
		expect(await screen.findByRole('status')).toHaveTextContent(/.+/);
		expect(screen.getByRole('button', { name: /clear slot 1/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /clear slot 2/i })).toBeInTheDocument();
		await waitFor(() => {
			expect(JSON.parse(localStorage.getItem(SAVE_KEY)!).state.scrapLog).toHaveLength(1);
		});
	});

	it('does not double-forge on a rapid double click', async () => {
		seed();
		render(
			<GameProvider>
				<ForgeScreen />
			</GameProvider>
		);
		const h = screen.getAllByRole('button', { name: /hydrogen/i });
		await userEvent.click(h[0]);
		await userEvent.click(h[0]);
		const forge = screen.getByRole('button', { name: /^forge$/i });
		await userEvent.dblClick(forge);
		await waitFor(() => {
			expect(JSON.parse(localStorage.getItem(SAVE_KEY)!).state.attempts).toBe(1);
		});
	});

	it('shows a quiet known message for an already-discovered pair', async () => {
		seed({ discovered: ['H', 'He'], discoveredAt: { H: 1, He: 2 } });
		render(
			<GameProvider>
				<ForgeScreen />
			</GameProvider>
		);
		const h = screen.getAllByRole('button', { name: /hydrogen/i });
		await userEvent.click(h[0]);
		await userEvent.click(h[0]);
		await userEvent.click(screen.getByRole('button', { name: /^forge$/i }));
		expect(await screen.findByRole('status')).toHaveTextContent(/already in the notebook/i);
	});
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm vitest run src/components/ForgeScreen.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement the forge screen**

- Slots state: `[string | null, string | null]`. Tapping a tray card fills the first empty slot; tapping the same card again fills the second. Both filled → FORGE enabled.
- `forging` state set synchronously on press; button `disabled` until the overlay/toast settles (400 ms). This makes the double-click test pass.
- `forgePair(a, b)` returns the outcome:
  - `new`: render `DiscoveryOverlay` (a focus-trapped dialog) containing `ElementPage`; progress updates through context.
  - `known`: show status "Already in the notebook." for 2 s.
  - `invalid`: pick a random `FAILURE_LINES` entry, show it in a `role="status"` tag, wobble the slots; leave both cards filled.
- `DiscoveryOverlay`: `role="dialog" aria-modal="true"`, labelled by the element name, dismiss button "Nice", Escape closes, focus returns to FORGE.
- Desktop drag (progressive enhancement): tray cards are `draggable`; `onDragStart` stores the symbol in `dataTransfer`; `Slot` handles `onDragOver` (preventDefault) and `onDrop` to call the same fill handler. Tap remains the only required path.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run src/components/ForgeScreen.test.tsx`
Expected: pass.

```bash
git add -A
git commit -m "feat: add forge loop with discovery, failure, and double-submit guard"
```

## Definition of done

- [ ] Every step above is checked.
- [ ] The task's verification commands pass.
- [ ] Changes are committed with the message given in the plan.
- [ ] `Status` above is changed to `done`.
