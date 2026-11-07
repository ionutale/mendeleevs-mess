# 05 — Completion certificate

- **Type:** AFK
- **Labels:** `ready-for-agent`, `completion`
- **User stories:** US5
- **Blocked by:** [Issue 03 — See the whole table](03-see-the-table.md), [Issue 04 — Notebook and scrap log](04-notebook.md)
- **Spec:** [Mendeleev's Mess design](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)
- **Plan:** [Implementation plan](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md) — Tasks 6, 16

## What to build

Make finishing the table an event. At exactly 118 discovered, Hydrogen included, show a certificate with a stats snapshot: attempts, elapsed time, and start date.

"Keep looking" hides the certificate and persists; the certificate stays reachable from a persistent entry point, and from Settings once Settings exists. "Start over" requires confirmation. "Share" copies a text summary, with a fallback when the clipboard is unavailable. Sandbox play after completion must not alter the saved snapshot.

## Acceptance criteria

- [ ] The win fires at 118, not before; a reload does not re-show the certificate after keep looking.
- [ ] Snapshot values are frozen; later attempts do not change them.
- [ ] Keep looking, two-step reset, share with fallback, and reopening all work.
- [ ] The certificate is keyboard and screen-reader accessible.
- [ ] Tests and svelte-check pass.

## Blocked by

[Issue 03 — See the whole table](03-see-the-table.md), [Issue 04 — Notebook and scrap log](04-notebook.md)
