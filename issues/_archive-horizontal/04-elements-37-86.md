# Issue 04 — Elements 37–86 and content CLI

- **Status:** open
- **Labels:** `content`, `mendeleevs-mess`
- **Depends on:** [Issue 03](03-elements-1-36.md)
- **Plan:** [Task 4](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

> Local implementation issue. The plan task is the source of truth; this file is the ticket.

## Goal

Elements 37–86 plus the CLI content check.

## Work

**Files:**

- Modify: `src/data/elements.ts`, `src/data/elements.test.ts`
- Create: `scripts/validate-content.ts`

**Interfaces:**

- Consumes: `ELEMENTS`, `validateElements`
- Produces: 86-record dataset; `pnpm validate` prints the summary and exits non-zero on failure

- [ ] **Step 1: Extend the data to 86**

Add Rb (37) through Rn (86). Keep every recipe rooted in already-reachable elements. Prefer logic that rewards chemistry intuition: noble gases fuse reluctantly, halogens pair with alkali metals, heavy elements come from whimsical lab accidents.

- [ ] **Step 2: Update the test count**

Change `toHaveLength(36)` to `toHaveLength(86)` and the unique-set assertions to 86.

- [ ] **Step 3: Add the content CLI**

`scripts/validate-content.ts`:

```ts
import { ELEMENTS } from '../src/data/elements';
import { reachableSymbols, validateElements } from '../src/game/validate';

const result = validateElements(ELEMENTS);
const reachable = reachableSymbols(ELEMENTS, ['H']);
console.log(`${ELEMENTS.length} elements, ${reachable.size} reachable`);
if (result.errors.length) {
	for (const error of result.errors) console.error(`- ${error}`);
	process.exit(1);
}
console.log('Content OK');
```

- [ ] **Step 4: Verify**

Run: `pnpm validate && pnpm vitest run src/data/elements.test.ts`
Expected: `86 elements, 86 reachable`, then passing tests.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add elements 37-86 and content validation script"
```

## Definition of done

- [ ] Every step above is checked.
- [ ] The task's verification commands pass.
- [ ] Changes are committed with the message given in the plan.
- [ ] `Status` above is changed to `done`.
