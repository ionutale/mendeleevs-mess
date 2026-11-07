# Issue 05 — Elements 87–118, failure lines, final content

- **Status:** open
- **Labels:** `content`, `mendeleevs-mess`
- **Depends on:** [Issue 04](04-elements-37-86.md)
- **Plan:** [Task 5](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

> Local implementation issue. The plan task is the source of truth; this file is the ticket.

## Goal

Elements 87–118, the failure-line pool, and the full 118-element win set.

## Work

**Files:**

- Modify: `src/data/elements.ts`, `src/data/elements.test.ts`
- Create: `src/data/failures.ts`, `src/game/validate.test.ts` additions

**Interfaces:**

- Consumes: `ELEMENTS`
- Produces: 118-record dataset, `FAILURE_LINES: readonly string[]`

- [ ] **Step 1: Extend to 118 and add failures**

Add Fr (87) through Og (118). Heavy synthetic elements can come from absurd combinations; keep names/symbols/categories official.

`src/data/failures.ts` — at least 24 unique deadpan lines, 4–80 characters, no hints, no scolding. Examples: `"Nothing. The universe yawns."`, `"A polite no from physics."`, `"The beaker files a complaint."`.

- [ ] **Step 2: Update the final data tests**

```ts
it('ships all 118 elements and all are reachable', () => {
	expect(ELEMENTS).toHaveLength(118);
	expect(new Set(ELEMENTS.map((e) => e.number))).toEqual(
		new Set(Array.from({ length: 118 }, (_, i) => i + 1))
	);
	expect(validateElements(ELEMENTS)).toEqual({ ok: true, errors: [] });
	expect(reachableSymbols(ELEMENTS, ['H']).size).toBe(118);
});

it('has a varied failure pool', () => {
	expect(FAILURE_LINES.length).toBeGreaterThanOrEqual(24);
	expect(new Set(FAILURE_LINES).size).toBe(FAILURE_LINES.length);
	for (const line of FAILURE_LINES) {
		expect(line.length).toBeGreaterThanOrEqual(4);
		expect(line.length).toBeLessThanOrEqual(80);
		expect(line.toLowerCase()).not.toMatch(/hint|try combining|you should/);
	}
});
```

- [ ] **Step 3: Verify**

Run: `pnpm validate && pnpm test`
Expected: `118 elements, 118 reachable`; all tests pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: complete the 118-element table and failure copy"
```

## Definition of done

- [ ] Every step above is checked.
- [ ] The task's verification commands pass.
- [ ] Changes are committed with the message given in the plan.
- [ ] `Status` above is changed to `done`.
