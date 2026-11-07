# Mendeleev's Mess — Issue Queue

Nine vertical-slice issues, published locally in dependency order. Each is a tracer bullet that cuts through data, logic, UI, persistence, and tests, and is demoable on its own.

- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)
- **Plan:** [Implementation plan](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Tracker:** local markdown (no tracker configured). Superseded horizontal tickets are archived in [`_archive-horizontal/`](_archive-horizontal/).

| #   | Issue                                                | Type | Blocked by                                      | Stories  |
| --- | ---------------------------------------------------- | ---- | ----------------------------------------------- | -------- |
| 01  | [Walking skeleton: forge helium](01-forge-helium.md) | AFK  | —                                               | US1, US9 |
| 02  | [Forge the full table](02-full-table.md)             | AFK  | [01](01-forge-helium.md)                        | US2      |
| 03  | [See the whole table](03-see-the-table.md)           | AFK  | [02](02-full-table.md)                          | US3      |
| 04  | [Notebook and scrap log](04-notebook.md)             | AFK  | [02](02-full-table.md)                          | US4      |
| 05  | [Completion certificate](05-completion.md)           | AFK  | [03](03-see-the-table.md), [04](04-notebook.md) | US5      |
| 06  | [Comfort and control](06-comfort-control.md)         | AFK  | [05](05-completion.md)                          | US6, US7 |
| 07  | [Installable and offline](07-offline-pwa.md)         | AFK  | [06](06-comfort-control.md)                     | US6      |
| 08  | [Access for everyone](08-accessibility.md)           | AFK  | [07](07-offline-pwa.md)                         | US8      |
| 09  | [Ship hardening](09-hardening.md)                    | AFK  | [08](08-accessibility.md)                       | US1–US9  |

## User stories

- **US1** — Combine two elements and discover a new one.
- **US2** — Forge every element in the periodic table from hydrogen, using hidden recipes.
- **US3** — See progress against the whole table.
- **US4** — Revisit discoveries and failed experiments.
- **US5** — Finish the table, get a certificate, keep playing, or restart.
- **US6** — Play one-handed on a phone, install the game, and continue offline.
- **US7** — Control sound and motion, and move a save between devices.
- **US8** — Play with a keyboard or screen reader.
- **US9** — Return later without losing progress.

## Working notes

- Publish order is dependency order: 01 → 02 → 03/04 → 05 → 06 → 07 → 08 → 09.
- Slices 03 and 04 are independent once 02 lands; they can be worked in either order.
- All nine are AFK: the design and content rules are settled, and no slice blocks on a human decision.
- The issue body is behavioral. The plan task linked in each header carries exact files, interfaces, tests, and commands.
- Content rules are binding: 118 elements, Hydrogen starter, no hints, flavor ≤100 characters, all-ages tone.
- Do not implement ahead of a failing test in the linked plan task.
