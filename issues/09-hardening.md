# 09 — Ship hardening

- **Type:** AFK
- **Labels:** `ready-for-agent`, `qa`
- **User stories:** US1–US9
- **Blocked by:** [Issue 08 — Access for everyone](08-accessibility.md)
- **Spec:** [Mendeleev's Mess design](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)
- **Plan:** [Implementation plan](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md) — Task 20

## What to build

Close the loop. Add the full regression e2e suite: cold start, reload persistence, desktop drag, completion without repeating the certificate, offline play, and a keyboard-only forge.

Enforce the initial JS budget at or below 250 KB gzip. Add the ten category doodle motifs and the Mendeleev mascot, plus paper texture, ink stamp, and wide-screen polish. Write the README: run, test, validate, build, e2e, content authoring, the reachability rule, and static deployment.

## Acceptance criteria

- [ ] The full e2e suite passes, including offline, desktop drag, completion, and keyboard.
- [ ] The bundle budget check passes at or below 250 KB gzip.
- [ ] Category motifs and the mascot are used; there are no 118 bespoke illustrations.
- [ ] The README covers run, test, validate, build, deploy, and content authoring.
- [ ] `pnpm validate && pnpm check && pnpm test && pnpm build && pnpm check:bundle && pnpm e2e` all pass.

## Blocked by

[Issue 08 — Access for everyone](08-accessibility.md)
