# Issue 02 — Types, categories, validator, fixtures

- **Status:** open
- **Labels:** `data`, `mendeleevs-mess`
- **Depends on:** [Issue 01](01-scaffold.md)
- **Plan:** [Task 2](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

> Local implementation issue. The plan task is the source of truth; this file is the ticket.

## Goal

Shared game types, the category palette, and a validator that proves recipe reachability.

## Work

**Files:**

- Create: `src/types.ts`, `src/data/categories.ts`, `src/game/validate.ts`, `src/game/validate.test.ts`, `src/test/fixtures.ts`

**Interfaces:**

- Consumes: nothing
- Produces:
  - `ElementRecord`, `Category`, `Screen`, `ScrapEntry`, `CompletionStats`, `GameSettings`, `GameState`
  - `CATEGORIES: Record<Category, { label: string; color: string }>`
  - `validateElements(elements: readonly ElementRecord[]): ValidationResult`
  - `reachableSymbols(elements: readonly ElementRecord[], starters: readonly string[]): Set<string>`
  - test factories `element(...)`, `tinyElements`

- [ ] **Step 1: Write the types**

`src/types.ts`:

```ts
export type Category =
	| 'alkali-metal'
	| 'alkaline-earth-metal'
	| 'transition-metal'
	| 'post-transition-metal'
	| 'metalloid'
	| 'reactive-nonmetal'
	| 'halogen'
	| 'noble-gas'
	| 'lanthanide'
	| 'actinide';

export type Screen = 'forge' | 'notebook' | 'table' | 'settings';

export interface ElementRecord {
	number: number;
	symbol: string;
	name: string;
	category: Category;
	flavor: string;
	recipe: [string, string] | null;
}

export interface ScrapEntry {
	pair: [string, string];
	at: number;
}

export interface CompletionStats {
	attempts: number;
	startedAt: number;
	completedAt: number;
	elapsedMs: number;
}

export interface GameSettings {
	sound: boolean;
	reduceMotion: boolean;
}

export interface GameState {
	version: 1;
	discovered: string[];
	discoveredAt: Record<string, number>;
	attempts: number;
	scrapLog: ScrapEntry[];
	startedAt: number;
	introSeen: boolean;
	completedAt: number | null;
	certificateSeen: boolean;
	completionStats: CompletionStats | null;
	settings: GameSettings;
	lastScreen: Screen;
}
```

- [ ] **Step 2: Write categories**

`src/data/categories.ts` with labels and marker colors (stripes only; text stays ink):

```ts
import type { Category } from '../types';

export const CATEGORIES: Record<Category, { label: string; color: string }> = {
	'alkali-metal': { label: 'Alkali metal', color: '#E8A15C' },
	'alkaline-earth-metal': { label: 'Alkaline earth', color: '#E8C45C' },
	'transition-metal': { label: 'Transition metal', color: '#8FB6D9' },
	'post-transition-metal': { label: 'Post-transition metal', color: '#9FAAB8' },
	metalloid: { label: 'Metalloid', color: '#7FBF9E' },
	'reactive-nonmetal': { label: 'Reactive nonmetal', color: '#6FB6E8' },
	halogen: { label: 'Halogen', color: '#5FB89A' },
	'noble-gas': { label: 'Noble gas', color: '#B48CE0' },
	lanthanide: { label: 'Lanthanide', color: '#D98FB5' },
	actinide: { label: 'Actinide', color: '#C97F9E' }
};
```

- [ ] **Step 3: Write the failing validator tests**

`src/test/fixtures.ts`:

```ts
import type { ElementRecord } from '../types';

export function element(
	number: number,
	symbol: string,
	recipe: [string, string] | null = null,
	overrides: Partial<ElementRecord> = {}
): ElementRecord {
	return {
		number,
		symbol,
		name: symbol,
		category: 'reactive-nonmetal',
		flavor: `${symbol} is a rumor with a number.`,
		recipe,
		...overrides
	};
}

export const tinyElements: ElementRecord[] = [
	element(1, 'H', null, { name: 'Hydrogen' }),
	element(2, 'He', ['H', 'H'], { name: 'Helium', category: 'noble-gas' }),
	element(3, 'Li', ['He', 'H'], { name: 'Lithium', category: 'alkali-metal' })
];
```

`src/game/validate.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { element, tinyElements } from '../test/fixtures';
import { reachableSymbols, validateElements } from './validate';

describe('validateElements', () => {
	it('accepts a complete, reachable set', () => {
		expect(validateElements(tinyElements)).toEqual({ ok: true, errors: [] });
		expect(reachableSymbols(tinyElements, ['H'])).toEqual(new Set(['H', 'He', 'Li']));
	});

	it('rejects an unreachable element', () => {
		const broken = [...tinyElements, element(4, 'Be', ['C', 'C'])];
		const result = validateElements(broken);
		expect(result.ok).toBe(false);
		expect(result.errors.join(' ')).toMatch(/Be/);
	});

	it('rejects a recipe with an unknown symbol', () => {
		const broken = [element(1, 'H', null), element(2, 'He', ['H', 'Xx'])];
		expect(validateElements(broken).ok).toBe(false);
	});

	it('rejects a flavor line over 100 characters', () => {
		const broken = [element(1, 'H', null, { flavor: 'x'.repeat(101) })];
		expect(validateElements(broken).ok).toBe(false);
	});
});
```

- [ ] **Step 4: Run the tests and confirm they fail**

Run: `pnpm vitest run src/game/validate.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 5: Implement the validator**

`src/game/validate.ts` exports:

```ts
export interface ValidationResult {
	ok: boolean;
	errors: string[];
}

export function reachableSymbols(
	elements: readonly ElementRecord[],
	starters: readonly string[]
): Set<string>;

export function validateElements(elements: readonly ElementRecord[]): ValidationResult;
```

`reachableSymbols` repeatedly adds an element when both its parents are in the set. `validateElements` checks: non-empty; unique numbers and symbols; valid categories; flavor length 1–100; H exists with `recipe === null`; every other recipe is non-null and references known symbols; all elements reachable from `['H']`. Errors are human-readable strings mentioning the offending symbol.

- [ ] **Step 6: Verify and commit**

Run: `pnpm vitest run src/game/validate.test.ts && pnpm typecheck`
Expected: 4 passing.

```bash
git add -A
git commit -m "feat: add game types, categories, and content validator"
```

## Definition of done

- [ ] Every step above is checked.
- [ ] The task's verification commands pass.
- [ ] Changes are committed with the message given in the plan.
- [ ] `Status` above is changed to `done`.
