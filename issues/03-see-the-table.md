# 03 — See the whole table

- **Type:** AFK
- **Labels:** `ready-for-agent`, `table`
- **User stories:** US3
- **Blocked by:** [Issue 02 — Forge the full table](02-full-table.md)
- **Spec:** [Mendeleev's Mess design](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)
- **Plan:** [Implementation plan](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md) — Task 13

## What to build

Give the player a map. A sticker grid by atomic number is the default on phones; a toggle shows the classic 18-column periodic layout, pannable on small screens with lanthanides and actinides in their own rows.

Undiscovered tiles show only the atomic number and a faint outline; discovered tiles reveal symbol, category color, and name. Progress is always visible. An "only missing" filter helps the endgame.

## Acceptance criteria

- [ ] 118 tiles appear in both views; every element has a layout position.
- [ ] Undiscovered symbols and names are absent from the DOM; discovery reveals them.
- [ ] Progress updates immediately after a forge.
- [ ] The sticker view works at 360 px without body horizontal scroll; the classic view pans.
- [ ] The missing filter hides discovered elements.
- [ ] Tests and svelte-check pass.

## Blocked by

[Issue 02 — Forge the full table](02-full-table.md)
