# 01 — Walking skeleton: forge helium

- **Type:** AFK
- **Labels:** `ready-for-agent`, `skeleton`
- **User stories:** US1, US9
- **Blocked by:** None — can start immediately
- **Spec:** [Mendeleev's Mess design](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)
- **Plan:** [Implementation plan](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md) — Tasks 1, 6–11 (subsets)

## What to build

Ship a walking skeleton that proves the whole stack. A phone-sized app boots with one Hydrogen card and two forge slots. Tapping an element fills the next empty slot; tapping the same element twice allows two copies. FORGE is disabled until both slots are full. Pressing FORGE looks up a hidden recipe; H + H produces Helium, shows its name and a one-line joke, and adds it to the tray. An invalid pair leaves both cards in their slots, wobbles, and shows a deadpan line. Progress survives reload.

The dataset in this slice is deliberately just H and He; the next slice replaces it with all 118.

## Acceptance criteria

- [ ] A cold start on a 390×844 viewport can forge helium by tap alone in under 30 seconds.
- [ ] H + H is a valid pair; the result appears with its name and flavor.
- [ ] An invalid pair leaves both slots filled and loses no state.
- [ ] Reload restores helium and the attempt count.
- [ ] Recipe lookup is order-independent; storage recovers from a corrupt save.
- [ ] The slice’s tests and svelte-check pass and the work is committed.

## Blocked by

None — can start immediately
