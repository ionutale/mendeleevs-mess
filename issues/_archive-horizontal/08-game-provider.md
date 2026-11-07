# Issue 08 — Game provider and autosave

- **Status:** open
- **Labels:** `state`, `mendeleevs-mess`
- **Depends on:** [Issue 07](07-save-load.md)
- **Plan:** [Task 8](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

> Local implementation issue. The plan task is the source of truth; this file is the ticket.

## Goal

React provider that owns game state, autosaves, and exposes actions.

## Work

**Files:**

- Create: `src/game/useGame.tsx`, `src/game/useGame.test.tsx`

**Interfaces:**

- Consumes: `forge`, `findRecipe`, storage functions, `GameState`, `Screen`
- Produces:

```ts
interface GameContextValue {
	state: GameState;
	recovered: boolean;
	forgePair: (a: string, b: string) => ForgeOutcome;
	setScreen: (screen: Screen) => void;
	dismissIntro: () => void;
	updateSettings: (patch: Partial<GameSettings>) => void;
	markCertificateSeen: () => void;
	resetGame: () => void;
	exportSave: () => string;
	importSave: (json: string) => boolean;
}
export function GameProvider(props: { children: React.ReactNode; now?: () => number }): JSX.Element;
export function useGame(): GameContextValue;
```

- [ ] **Step 1: Write the failing provider tests**

```tsx
import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, beforeEach } from 'vitest';
import { GameProvider, useGame } from './useGame';
import { SAVE_KEY } from './storage';

function Probe() {
	const g = useGame();
	return (
		<div>
			<output data-testid="count">{g.state.discovered.length}</output>
			<output data-testid="recovered">{String(g.recovered)}</output>
			<button onClick={() => g.forgePair('H', 'H')}>forge</button>
		</div>
	);
}

beforeEach(() => localStorage.clear());

describe('useGame', () => {
	it('discovers helium and persists it', async () => {
		render(
			<GameProvider now={() => 5_000}>
				<Probe />
			</GameProvider>
		);
		expect(screen.getByTestId('count')).toHaveTextContent('1');
		await userEvent.click(screen.getByRole('button', { name: 'forge' }));
		await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('2'));
		const saved = JSON.parse(localStorage.getItem(SAVE_KEY)!);
		expect(saved.state.discovered).toContain('He');
	});

	it('recovers from a corrupt save and reports it', () => {
		localStorage.setItem(SAVE_KEY, '{oops');
		render(
			<GameProvider>
				<Probe />
			</GameProvider>
		);
		expect(screen.getByTestId('recovered')).toHaveTextContent('true');
	});

	it('rejects a corrupt import and accepts a valid one', async () => {
		function ImportProbe() {
			const g = useGame();
			const [result, setResult] = useState('');
			return (
				<>
					<button onClick={() => setResult(String(g.importSave('{oops')))}>bad</button>
					<button
						onClick={() =>
							setResult(String(g.importSave(JSON.stringify({ version: 1, state: g.state }))))
						}
					>
						good
					</button>
					<output role="status">{result}</output>
				</>
			);
		}
		render(
			<GameProvider>
				<ImportProbe />
			</GameProvider>
		);
		await userEvent.click(screen.getByRole('button', { name: 'bad' }));
		expect(screen.getByRole('status')).toHaveTextContent('false');
		await userEvent.click(screen.getByRole('button', { name: 'good' }));
		expect(screen.getByRole('status')).toHaveTextContent('true');
	});
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm vitest run src/game/useGame.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the provider**

Use `useReducer`. Initialize once with `loadState(Date.now())`, keeping the `recovered` flag. State-changing actions:

- `FORGE` (via `forgePair`): compute `forge(state, a, b, ELEMENTS, now())`, dispatch the new state, return the outcome.
- `SCREEN`, `DISMISS_INTRO`, `SETTINGS`, `CERT_SEEN`, `RESET`, `IMPORT`.

Wrap the reducer's next state in `useEffect(() => { saveState(state) }, [state])`; one save per state change is intentional and cheap. `exportSave()` returns `JSON.stringify({ version: 1, state })`. `importSave(json)` calls `parseState`; on success dispatch and return true, else false. `resetGame()` clears the key, dispatches `createInitialState(now())`, and preserves no settings.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run src/game/useGame.test.tsx`
Expected: all pass.

```bash
git add -A
git commit -m "feat: add game provider with autosave and import/export"
```

## Definition of done

- [ ] Every step above is checked.
- [ ] The task's verification commands pass.
- [ ] Changes are committed with the message given in the plan.
- [ ] `Status` above is changed to `done`.
