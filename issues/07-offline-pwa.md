# 07 — Installable and offline

- **Type:** AFK
- **Labels:** `ready-for-agent`, `pwa`
- **User stories:** US6
- **Blocked by:** [Issue 06 — Comfort and control](06-comfort-control.md)
- **Spec:** [Mendeleev's Mess design](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)
- **Plan:** [Implementation plan](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md) — Task 18

## What to build

Ship an installable, offline PWA. The manifest supplies the name, cream theme, standalone display, and 192/512 icons. A service worker precaches the shell, fonts, content, and icons; after the first load the game works offline.

A new version shows a refresh prompt instead of reloading mid-forge. The app remains playable from the home screen with no network.

## Acceptance criteria

- [ ] The manifest is linked and exposes 192×192 and 512×512 icons; installability passes.
- [ ] After one online load, an offline reload boots the game and a forge completes.
- [ ] The update prompt appears for a waiting worker and refreshes on demand.
- [ ] Fonts and icons load from cache with no CDN.
- [ ] The PWA e2e test passes.

## Blocked by

[Issue 06 — Comfort and control](06-comfort-control.md)
