# Mendeleev's Mess — Issue Queue

Twenty local issues, one per implementation task. Work them top to bottom; each issue links to its plan task and carries the exact files, interfaces, tests, and verification commands.

- **Source plan:** [docs/superpowers/plans/2026-11-07-mendeleevs-mess.md](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Design:** [docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

| #   | Issue                                                                     | Label         | Depends on                        |
| --- | ------------------------------------------------------------------------- | ------------- | --------------------------------- |
| 01  | [Scaffold, test harness, and shell](01-scaffold.md)                       | `setup`       | —                                 |
| 02  | [Types, categories, validator, fixtures](02-types-validator.md)           | `data`        | [Issue 01](01-scaffold.md)        |
| 03  | [Elements 1–36](03-elements-1-36.md)                                      | `content`     | [Issue 02](02-types-validator.md) |
| 04  | [Elements 37–86 and content CLI](04-elements-37-86.md)                    | `content`     | [Issue 03](03-elements-1-36.md)   |
| 05  | [Elements 87–118, failure lines, final content](05-elements-87-118.md)    | `content`     | [Issue 04](04-elements-37-86.md)  |
| 06  | [Recipe engine](06-recipe-engine.md)                                      | `engine`      | [Issue 05](05-elements-87-118.md) |
| 07  | [Save, load, and corruption recovery](07-save-load.md)                    | `persistence` | [Issue 06](06-recipe-engine.md)   |
| 08  | [Game provider and autosave](08-game-provider.md)                         | `state`       | [Issue 07](07-save-load.md)       |
| 09  | [App shell, navigation, and recovery notice](09-app-shell.md)             | `ui`          | [Issue 08](08-game-provider.md)   |
| 10  | [Element card, slot, and tray](10-cards-tray.md)                          | `ui`          | [Issue 09](09-app-shell.md)       |
| 11  | [Forge screen and discovery flow](11-forge-screen.md)                     | `ui`          | [Issue 10](10-cards-tray.md)      |
| 12  | [Notebook, element page, and scrap log](12-notebook.md)                   | `ui`          | [Issue 11](11-forge-screen.md)    |
| 13  | [Table view and layout data](13-table.md)                                 | `ui`          | [Issue 12](12-notebook.md)        |
| 14  | [Sound and reduced motion](14-sound-motion.md)                            | `ui`          | [Issue 13](13-table.md)           |
| 15  | [First run and empty states](15-first-run.md)                             | `ui`          | [Issue 14](14-sound-motion.md)    |
| 16  | [Completion, certificate, and reset](16-completion.md)                    | `ui`          | [Issue 15](15-first-run.md)       |
| 17  | [Full settings screen](17-settings.md)                                    | `ui`          | [Issue 16](16-completion.md)      |
| 18  | [PWA, icons, and offline](18-pwa.md)                                      | `pwa`         | [Issue 17](17-settings.md)        |
| 19  | [Accessibility and keyboard flow](19-accessibility.md)                    | `a11y`        | [Issue 18](18-pwa.md)             |
| 20  | [E2E regression, performance budget, and README](20-regression-polish.md) | `qa`          | [Issue 19](19-accessibility.md)   |

## Notes

- Issues are sequential: each assumes the previous one is complete and committed.
- Tests are red-green in every issue; do not implement ahead of the failing test.
- The 118-element content issues (03–05) must keep `pnpm validate` green before they are closed.
- Review-focus conditions (corrupt save, re-forge, unknown symbols, completion boundary, double-submit) are pinned by tests in issues 06, 07, 11, and 16.
