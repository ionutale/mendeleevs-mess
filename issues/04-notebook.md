# 04 — Notebook and scrap log

- **Type:** AFK
- **Labels:** `ready-for-agent`, `notebook`
- **User stories:** US4
- **Blocked by:** [Issue 02 — Forge the full table](02-full-table.md)
- **Spec:** [Mendeleev's Mess design](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)
- **Plan:** [Implementation plan](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md) — Tasks 6, 12

## What to build

Turn discoveries into a notebook. The notebook lists discovered elements newest-first, with search, sort, and category filter. Each element page shows symbol, number, name, category, joke, discovery date, and the two parents that forged it.

A collapsible scrap log holds the last 20 unique failed pairs, newest first, and can be cleared. It records what failed but never suggests a working pair.

## Acceptance criteria

- [ ] Newest-first is the default; sort, search, and filter work on discovered elements only.
- [ ] Element pages show the discovery date and parents; the joke matches the content data.
- [ ] Failed pairs persist across reload, deduplicate, cap at 20, and clear.
- [ ] Empty states exist for search and for the scrap log.
- [ ] No hint language appears anywhere.
- [ ] Tests and svelte-check pass.

## Blocked by

[Issue 02 — Forge the full table](02-full-table.md)
