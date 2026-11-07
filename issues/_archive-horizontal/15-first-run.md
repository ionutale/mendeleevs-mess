# Issue 15 — First run and empty states

- **Status:** open
- **Labels:** `ui`, `mendeleevs-mess`
- **Depends on:** [Issue 14](14-sound-motion.md)
- **Plan:** [Task 15](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

> Local implementation issue. The plan task is the source of truth; this file is the ticket.

## Goal

One-time first-run overlay and the empty-state copy.

## Work

**Files:**

- Create: `src/components/FirstRun.tsx`, `src/components/FirstRun.test.tsx`
- Modify: `src/App.tsx`, `src/components/NotebookScreen.tsx`, `src/components/TableScreen.tsx`

**Interfaces:**

- Consumes: `useGame`
- Produces: one-time intro overlay; empty copy for scrap log, search, and missing filter

- [ ] **Step 1: Write the failing tests**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App';
import { GameProvider } from '../game/useGame';
import { gameState } from '../test/fixtures';
import { SAVE_KEY } from '../game/storage';

beforeEach(() => localStorage.clear());

describe('first run', () => {
	it('shows the intro once and persists dismissal', async () => {
		const { unmount } = render(
			<GameProvider>
				<App />
			</GameProvider>
		);
		expect(screen.getByRole('dialog')).toHaveTextContent(/one hydrogen/i);
		await userEvent.click(screen.getByRole('button', { name: /get started/i }));
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		unmount();
		render(
			<GameProvider>
				<App />
			</GameProvider>
		);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('shows an empty search message', async () => {
		localStorage.setItem(
			SAVE_KEY,
			JSON.stringify({
				version: 1,
				state: gameState({ discovered: ['H', 'He'], discoveredAt: { H: 1, He: 2 } })
			})
		);
		render(
			<GameProvider>
				<App />
			</GameProvider>
		);
		await userEvent.click(screen.getByRole('button', { name: 'Notebook' }));
		await userEvent.type(screen.getByRole('searchbox'), 'zzz');
		expect(screen.getByText(/nothing matches/i)).toBeInTheDocument();
	});
});
```

Replace the second test with a seed helper that writes a valid `gameState({ introSeen: true })`, navigates to Notebook, searches `zzz`, and asserts `Nothing matches`.

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm vitest run src/components/FirstRun.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

- `FirstRun`: `role="dialog" aria-modal="true"`, copy "You have one hydrogen. The rest is a rumor.", button "Get started" → `dismissIntro()`.
- Empty states: scrap log "No failed experiments. Suspicious."; notebook search "Nothing matches. Yet."; table missing filter "Nothing missing. Show-off.".

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run src/components/FirstRun.test.tsx`
Expected: pass.

```bash
git add -A
git commit -m "feat: add first-run intro and empty states"
```

## Definition of done

- [ ] Every step above is checked.
- [ ] The task's verification commands pass.
- [ ] Changes are committed with the message given in the plan.
- [ ] `Status` above is changed to `done`.
