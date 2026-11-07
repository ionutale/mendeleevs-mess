# 08 — Access for everyone

- **Type:** AFK
- **Labels:** `ready-for-agent`, `a11y`
- **User stories:** US8
- **Blocked by:** [Issue 07 — Installable and offline](07-offline-pwa.md)
- **Spec:** [Mendeleev's Mess design](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)
- **Plan:** [Implementation plan](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md) — Tasks 9–11, 19

## What to build

Make every path playable without a mouse or sight. Cards are focusable, Enter selects, Escape clears. Overlays trap focus and return it on close. Discoveries, known pairs, and failures are announced politely and once. Labels include name, number, and category. Contrast is at least 4.5:1 and touch targets are at least 44 px.

A keyboard-only player can forge helium, browse discoveries, and open the certificate. Axe reports zero violations on Forge, Notebook, Table, and Settings.

## Acceptance criteria

- [ ] A keyboard-only user can forge helium and reach the certificate.
- [ ] Focus is trapped in dialogs and restored to the invoking control.
- [ ] Live regions announce discovery, known, and failure outcomes exactly once.
- [ ] Axe reports zero violations on all four screens.
- [ ] No interaction is hover-only; 360 px tap targets are at least 44 px.
- [ ] Tests, svelte-check, and e2e pass.

## Blocked by

[Issue 07 — Installable and offline](07-offline-pwa.md)
