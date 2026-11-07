# Issue 06 — Recipe engine

- **Status:** open
- **Labels:** `engine`, `mendeleevs-mess`
- **Depends on:** [Issue 05](05-elements-87-118.md)
- **Plan:** [Task 6](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

> Local implementation issue. The plan task is the source of truth; this file is the ticket.

## Goal

Pure recipe lookup and forge transitions with scrap-log and completion rules.

## Work

**Files:**

- Create: `src/game/engine.ts`, `src/game/engine.test.ts`
- Modify: `src/test/fixtures.ts` (add `gameState` factory)

**Interfaces:**

- Consumes: `ElementRecord`, `GameState`, `CompletionStats`
- Produces:
  - `normalizePair(a, b): [string, string]`
  - `findRecipe(elements, a, b): ElementRecord | null`
  - `addScrapEntry(log, pair, at): ScrapEntry[]`
  - `forge(state, a, b, elements, now): { state: GameState; outcome: ForgeOutcome }`
  - `type ForgeOutcome = { kind: 'new'; element } | { kind: 'known'; element } | { kind: 'invalid' }`

- [ ] **Step 1: Write the failing tests**

Add to `src/test/fixtures.ts`:

```ts
import type { GameState } from '../types';

export function gameState(overrides: Partial<GameState> = {}): GameState {
	const startedAt = 1_000;
	return {
		version: 1,
		discovered: ['H'],
		discoveredAt: { H: startedAt },
		attempts: 0,
		scrapLog: [],
		startedAt,
		introSeen: true,
		completedAt: null,
		certificateSeen: false,
		completionStats: null,
		settings: { sound: true, reduceMotion: false },
		lastScreen: 'forge',
		...overrides
	};
}
```

`src/game/engine.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { gameState, tinyElements } from '../test/fixtures';
import { addScrapEntry, findRecipe, forge } from './engine';

const NOW = 5_000;

describe('findRecipe', () => {
	it('is order-independent and supports identical parents', () => {
		expect(findRecipe(tinyElements, 'H', 'H')?.symbol).toBe('He');
		expect(findRecipe(tinyElements, 'H', 'He')?.symbol).toBe('Li');
		expect(findRecipe(tinyElements, 'He', 'H')?.symbol).toBe('Li');
	});
});

describe('forge', () => {
	it('discovers a new element and records its timestamp', () => {
		const { state, outcome } = forge(gameState(), 'H', 'H', tinyElements, NOW);
		expect(outcome).toMatchObject({ kind: 'new', element: { symbol: 'He' } });
		expect(state.discovered).toEqual(['H', 'He']);
		expect(state.discoveredAt.He).toBe(NOW);
		expect(state.attempts).toBe(1);
		expect(state.scrapLog).toEqual([]);
	});

	it('treats a known pair as known without duplicating or scraping', () => {
		const start = gameState({
			discovered: ['H', 'He'],
			discoveredAt: { H: 1, He: 2 },
			attempts: 4
		});
		const { state, outcome } = forge(start, 'H', 'H', tinyElements, NOW);
		expect(outcome.kind).toBe('known');
		expect(state.discovered).toEqual(['H', 'He']);
		expect(state.attempts).toBe(5);
		expect(state.scrapLog).toEqual([]);
	});

	it('records invalid pairs, deduplicates, and leaves discovered untouched', () => {
		const start = gameState({
			discovered: ['H', 'He', 'Li'],
			discoveredAt: { H: 1, He: 2, Li: 3 }
		});
		const once = forge(start, 'He', 'He', tinyElements, NOW).state;
		expect(once.scrapLog).toEqual([{ pair: ['He', 'He'], at: NOW }]);
		const twice = forge(once, 'He', 'He', tinyElements, NOW + 1).state;
		expect(twice.scrapLog).toHaveLength(1);
		expect(twice.scrapLog[0].at).toBe(NOW + 1);
		expect(twice.discovered).toEqual(['H', 'He', 'Li']);
	});

	it('treats unknown symbols as invalid without scraping them', () => {
		const { state, outcome } = forge(gameState(), 'H', 'Xx', tinyElements, NOW);
		expect(outcome.kind).toBe('invalid');
		expect(state.attempts).toBe(1);
		expect(state.scrapLog).toEqual([]);
	});

	it('completes once at the element-count boundary with a stats snapshot', () => {
		const start = gameState({
			discovered: ['H', 'He'],
			discoveredAt: { H: 1, He: 2 },
			attempts: 9
		});
		const { state } = forge(start, 'H', 'He', tinyElements, NOW);
		expect(state.discovered).toHaveLength(3);
		expect(state.completedAt).toBe(NOW);
		expect(state.completionStats).toEqual({
			attempts: 10,
			startedAt: 1_000,
			completedAt: NOW,
			elapsedMs: 4_000
		});
		const again = forge(state, 'H', 'H', tinyElements, NOW + 10).state;
		expect(again.completionStats).toEqual(state.completionStats);
		expect(again.completedAt).toBe(NOW);
	});
});

describe('addScrapEntry', () => {
	it('caps the log at 20 newest entries', () => {
		let log = [] as ReturnType<typeof addScrapEntry>;
		for (let i = 0; i < 25; i++) log = addScrapEntry(log, ['H', `X${i}`], i);
		expect(log).toHaveLength(20);
		expect(log[0]).toEqual({ pair: ['H', 'X24'], at: 24 });
	});
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm vitest run src/game/engine.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the engine**

Rules:

- `normalizePair(a, b)` sorts using `a <= b`.
- `findRecipe` first verifies both symbols exist in `elements`; then matches an element whose recipe is the normalized pair.
- `forge` always increments `attempts` once.
  - Unknown/undiscovered symbol or no recipe → `invalid`; add to scrap only when both symbols exist in `elements`; dedupe by normalized pair, newest first, cap 20.
  - Recipe found and already in `discovered` → `known`; no other state change.
  - Recipe found and new → append to `discovered`, set `discoveredAt[symbol] = now`; if `discovered.length === elements.length`, set `completedAt = now`, `certificateSeen = false`, and a `completionStats` snapshot using the incremented attempt count and `now - startedAt`.
- Never mutate the input state.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run src/game/engine.test.ts`
Expected: all pass.

```bash
git add -A
git commit -m "feat: add recipe lookup and forge engine"
```

## Definition of done

- [ ] Every step above is checked.
- [ ] The task's verification commands pass.
- [ ] Changes are committed with the message given in the plan.
- [ ] `Status` above is changed to `done`.
