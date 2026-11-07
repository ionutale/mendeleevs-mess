# 02 — Forge the full table

- **Type:** AFK
- **Labels:** `ready-for-agent`, `content`
- **User stories:** US2
- **Blocked by:** [Issue 01 — Walking skeleton: forge helium](01-forge-helium.md)
- **Spec:** [Mendeleev's Mess design](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)
- **Plan:** [Implementation plan](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md) — Tasks 3–5, 6, 10–11

## What to build

Author the complete periodic table and make it playable. All 118 elements carry an official symbol, name, atomic number, category, a hidden parent pair (Hydrogen has none), and a one-line all-ages joke of at most 100 characters. A validator proves every element is reachable from Hydrogen and fails the build otherwise.

The tray supports all 118 discovered elements: sort by number, name, or category; filter by category; search; tap to fill a slot; desktop drag. Re-forging a known pair gives a quiet known result; invalid pairs stay in their slots and land in the scrap log; unknown symbols are rejected without crashing.

Chemistry knowledge should feel rewarded where real fusion logic exists, but absurd recipes fill the gaps. No hints, no recipe list.

## Acceptance criteria

- [ ] 118 unique elements and recipes validate; reachability from H covers all 118.
- [ ] Any element can be forged by its authored parents; same-symbol pairs work.
- [ ] Re-forging a known pair shows a quiet known result and adds no duplicate.
- [ ] Unknown or tampered symbols are invalid and never crash or pollute the scrap log.
- [ ] The tray remains usable at 118 with sort, filter, search, tap, and desktop drag.
- [ ] Every flavor line is ≤100 characters; no hints exist anywhere.
- [ ] `pnpm validate` passes and all tests and svelte-check pass.

## Blocked by

[Issue 01 — Walking skeleton: forge helium](01-forge-helium.md)
