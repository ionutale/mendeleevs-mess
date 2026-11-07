# Issue 09 — App shell, navigation, and recovery notice

- **Status:** open
- **Labels:** `ui`, `mendeleevs-mess`
- **Depends on:** [Issue 08](08-game-provider.md)
- **Plan:** [Task 9](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

> Local implementation issue. The plan task is the source of truth; this file is the ticket.

## Goal

App shell with navigation, progress, and the save-recovery notice.

## Work

**Files:**

- Create: `src/components/AppBar.tsx`, `src/components/BottomNav.tsx`, `src/App.tsx` (replace), `src/App.test.tsx` (replace), `src/styles/app.css`
- Modify: `src/main.tsx` (wrap in `GameProvider`)

**Interfaces:**

- Consumes: `useGame`, `Screen`
- Produces:
  - `AppBar({ progress, total }: { progress: number; total: number })`
  - `BottomNav({ current, onChange }: { current: Screen; onChange: (s: Screen) => void })` renders inside `<nav aria-label="Main">`
  - `App` renders the active screen, a recovered-save banner, and the first-run overlay slot

- [ ] **Step 1: Write the failing shell tests**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { GameProvider } from './game/useGame';
import { gameState } from './test/fixtures';
import { SAVE_KEY } from './game/storage';

beforeEach(() => {
	localStorage.clear();
	localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 1, state: gameState() }));
});
const app = () =>
	render(
		<GameProvider>
			<App />
		</GameProvider>
	);

describe('app shell', () => {
	it('shows hydrogen progress and switches screens', async () => {
		app();
		expect(screen.getByText('1 / 118')).toBeInTheDocument();
		await userEvent.click(screen.getByRole('button', { name: 'Table' }));
		expect(screen.getByRole('heading', { name: 'The table' })).toBeInTheDocument();
	});

	it('marks the active tab', async () => {
		app();
		expect(screen.getByRole('button', { name: 'Forge' })).toHaveAttribute('aria-current', 'page');
	});

	it('announces a recovered save', () => {
		localStorage.setItem('mendeleevs-mess:save:v1', '{bad');
		app();
		expect(screen.getByRole('status')).toHaveTextContent(/save/i);
	});
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm vitest run src/App.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement the shell**

- `AppBar`: paper sticky bar, title, `{progress} / {total}`.
- `BottomNav`: four buttons, `aria-current="page"` on the active one, 44 px minimum.
- `App`: reads `state.lastScreen`; renders `ForgeScreen`, `NotebookScreen`, `TableScreen`, or `SettingsScreen`; renders the recovered banner when `recovered`; renders `FirstRun` when `!state.introSeen`.
- `main.tsx`: wrap `<App />` in `<GameProvider>`.

Screens not built yet: create temporary placeholder components returning an `<h2>` (`The forge`, `The notebook`, `The table`, `Settings`) so this task's tests pass. Later tasks replace them.

- [ ] **Step 4: Verify and commit**

Run: `pnpm test && pnpm typecheck`
Expected: pass.

```bash
git add -A
git commit -m "feat: add app shell, navigation, and recovery notice"
```

## Definition of done

- [ ] Every step above is checked.
- [ ] The task's verification commands pass.
- [ ] Changes are committed with the message given in the plan.
- [ ] `Status` above is changed to `done`.
