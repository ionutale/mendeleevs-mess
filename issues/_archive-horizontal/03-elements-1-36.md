# Issue 03 — Elements 1–36

- **Status:** open
- **Labels:** `content`, `mendeleevs-mess`
- **Depends on:** [Issue 02](02-types-validator.md)
- **Plan:** [Task 3](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

> Local implementation issue. The plan task is the source of truth; this file is the ticket.

## Goal

Elements 1–36 authored with unique recipes and a passing validator.

## Work

**Files:**

- Create: `src/data/elements.ts`, `src/data/elements.test.ts`

**Interfaces:**

- Consumes: `ElementRecord`, `validateElements`
- Produces: `ELEMENTS: readonly ElementRecord[]`, `ELEMENT_BY_SYMBOL: ReadonlyMap<string, ElementRecord>`, `STARTER_SYMBOL = 'H'`

- [ ] **Step 1: Author the first batch**

Create `src/data/elements.ts` with elements 1–36 (H through Kr), using the official symbols, names, and categories. H has `recipe: null`; every other element has one pair.

Authoring procedure that guarantees reachability:

1. Draft a fallback chain where each element is `${previous} + H` or `${previous} + He`.
2. Replace at least half with more interesting or real-ish fusions, e.g. `He ← H + H`, `Be ← Li + H`, `C ← He + Be`, `O ← C + He`, `Ne ← O + He`, `Fe ← …` (not in this batch).
3. Re-run the validator after every edit; never leave the batch unreachable.

Flavor rules: ≤ 100 characters, all-ages, deadpan, never explains the joke.

Also export:

```ts
export const ELEMENTS: readonly ElementRecord[] = [/* 36 records */];
export const ELEMENT_BY_SYMBOL = new Map(ELEMENTS.map((e) => [e.symbol, e]));
export const STARTER_SYMBOL = 'H';
```

- [ ] **Step 2: Write the failing data test**

`src/data/elements.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { reachableSymbols, validateElements } from '../game/validate';
import { ELEMENTS } from './elements';

describe('element data', () => {
	it('ships 36 valid, reachable elements', () => {
		expect(ELEMENTS).toHaveLength(36);
		expect(validateElements(ELEMENTS)).toEqual({ ok: true, errors: [] });
		expect(reachableSymbols(ELEMENTS, ['H']).size).toBe(36);
	});

	it('has unique symbols and atomic numbers', () => {
		expect(new Set(ELEMENTS.map((e) => e.symbol)).size).toBe(36);
		expect(new Set(ELEMENTS.map((e) => e.number)).size).toBe(36);
	});

	it('keeps every flavor line within 100 characters', () => {
		for (const e of ELEMENTS) expect(e.flavor.length).toBeLessThanOrEqual(100);
	});
});
```

- [ ] **Step 3: Run and confirm failure, then verify content**

Run: `pnpm vitest run src/data/elements.test.ts`
Expected before content is final: FAIL on length or validator errors. After authoring: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add elements 1-36 with hidden recipes"
```

## Definition of done

- [ ] Every step above is checked.
- [ ] The task's verification commands pass.
- [ ] Changes are committed with the message given in the plan.
- [ ] `Status` above is changed to `done`.
