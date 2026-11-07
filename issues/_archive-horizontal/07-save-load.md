# Issue 07 — Save, load, and corruption recovery

- **Status:** open
- **Labels:** `persistence`, `mendeleevs-mess`
- **Depends on:** [Issue 06](06-recipe-engine.md)
- **Plan:** [Task 7](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

> Local implementation issue. The plan task is the source of truth; this file is the ticket.

## Goal

Versioned localStorage save with corruption recovery and parse/export primitives.

## Work

**Files:**

- Create: `src/game/storage.ts`, `src/game/storage.test.ts`

**Interfaces:**

- Consumes: `GameState`
- Produces:
  - `SAVE_KEY = 'mendeleevs-mess:save:v1'`
  - `createInitialState(now: number): GameState`
  - `parseState(raw: string): GameState | null`
  - `loadState(now: number, storage?: Storage): { state: GameState; recovered: boolean }`
  - `saveState(state: GameState, storage?: Storage): boolean`
  - `clearState(storage?: Storage): void`

- [ ] **Step 1: Write the failing tests**

`src/game/storage.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createInitialState, loadState, parseState, saveState, SAVE_KEY } from './storage';

function memoryStorage(): Storage {
	const map = new Map<string, string>();
	return {
		get length() {
			return map.size;
		},
		clear: () => map.clear(),
		getItem: (k) => map.get(k) ?? null,
		key: (i) => [...map.keys()][i] ?? null,
		removeItem: (k) => void map.delete(k),
		setItem: (k, v) => void map.set(k, v)
	};
}

describe('storage', () => {
	it('starts with hydrogen discovered and an empty notebook otherwise', () => {
		const s = createInitialState(1_000);
		expect(s.discovered).toEqual(['H']);
		expect(s.discoveredAt.H).toBe(1_000);
		expect(s.attempts).toBe(0);
		expect(s.completedAt).toBeNull();
		expect(s.settings.sound).toBe(true);
	});

	it('round-trips a save', () => {
		const storage = memoryStorage();
		const state = { ...createInitialState(1_000), discovered: ['H', 'He'], attempts: 3 };
		expect(saveState(state, storage)).toBe(true);
		expect(loadState(2_000, storage)).toEqual({ state, recovered: false });
	});

	it('recovers from corrupt JSON', () => {
		const storage = memoryStorage();
		storage.setItem(SAVE_KEY, '{not json');
		const result = loadState(2_000, storage);
		expect(result.recovered).toBe(true);
		expect(result.state.discovered).toEqual(['H']);
	});

	it('recovers from a wrong version or missing hydrogen', () => {
		const storage = memoryStorage();
		storage.setItem(SAVE_KEY, JSON.stringify({ version: 99, state: createInitialState(1) }));
		expect(loadState(2_000, storage).recovered).toBe(true);

		const bad = { ...createInitialState(1), discovered: ['He'] };
		storage.setItem(SAVE_KEY, JSON.stringify({ version: 1, state: bad }));
		expect(loadState(2_000, storage).recovered).toBe(true);
	});

	it('reports a failed write instead of throwing', () => {
		const storage = memoryStorage();
		storage.setItem = () => {
			throw new Error('quota');
		};
		expect(saveState(createInitialState(1), storage)).toBe(false);
	});
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm vitest run src/game/storage.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement storage**

`parseState` accepts only `version === 1`, a `state` object with all required fields, and `discovered` containing `'H'`. It also backfills `discoveredAt.H` from `startedAt` when missing and merges missing settings defaults. Any other malformation returns `null`.

`loadState` reads `SAVE_KEY`; absent → initial state; parse failure → initial state with `recovered: true`.

`saveState` wraps `setItem` in try/catch and returns `false` on failure. `clearState` removes the key and never throws.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run src/game/storage.test.ts`
Expected: all pass.

```bash
git add -A
git commit -m "feat: add versioned save with corruption recovery"
```

## Definition of done

- [ ] Every step above is checked.
- [ ] The task's verification commands pass.
- [ ] Changes are committed with the message given in the plan.
- [ ] `Status` above is changed to `done`.
