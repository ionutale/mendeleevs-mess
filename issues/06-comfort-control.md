# 06 — Comfort and control

- **Type:** AFK
- **Labels:** `ready-for-agent`, `settings`
- **User stories:** US6, US7
- **Blocked by:** [Issue 05 — Completion certificate](05-completion.md)
- **Spec:** [Mendeleev's Mess design](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)
- **Plan:** [Implementation plan](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md) — Tasks 14, 15, 17

## What to build

Make the game comfortable and controllable. First run shows a one-time intro. Settings offers sound, reduce motion, install guidance, save export and import, reset, and the certificate when the table is complete.

Discovery, failure, and pick cues are procedural WebAudio, with no asset files. Reduced motion honors both the toggle and the OS preference. Save transfer validates imported JSON and rejects garbage without touching current progress.

## Acceptance criteria

- [ ] The intro shows once and persists dismissal.
- [ ] Sound and motion toggles persist; reduced motion suppresses card and stamp animations.
- [ ] Export produces a valid save; import accepts valid JSON and rejects corrupt data.
- [ ] Reset is two-step and returns to Hydrogen.
- [ ] Install guidance appears appropriately when install is available or unavailable.
- [ ] Tests and svelte-check pass.

## Blocked by

[Issue 05 — Completion certificate](05-completion.md)
