# Mendeleev's Mess

[![CI](https://github.com/ionutale/mendeleevs-mess/actions/workflows/ci.yml/badge.svg)](https://github.com/ionutale/mendeleevs-mess/actions/workflows/ci.yml)

A notebook-doodle discovery game: start with one hydrogen and forge all 118 periodic-table elements through hidden recipe pairs. Mobile-first SvelteKit PWA, offline after the first load, local saves.

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

## Verify it

```bash
pnpm test         # unit + component tests
pnpm test:e2e     # Playwright: forge, persistence, table, PWA, axe, keyboard
pnpm check        # svelte-check
pnpm lint         # prettier + eslint
pnpm validate     # 118 elements, reachability, flavor rules
pnpm build        # static build in build/
pnpm check:bundle # 250 KB gzip budget for initial JS
pnpm deploy       # build and deploy to Cloudflare Workers
```

Preview the production build with `pnpm preview`.

## Content authoring

Elements live in `src/lib/data/elements.ts`:

```ts
el(8, 'O', 'Oxygen', 'reactive-nonmetal', 'Extremely popular. Sometimes too popular.', ['C', 'He']);
```

Rules enforced by `pnpm validate`:

- 118 unique elements, atomic numbers 1–118.
- Hydrogen has no recipe; every other element has one ordered-independent pair.
- Every element must be reachable from hydrogen.
- Flavor lines are 1–100 characters.
- `src/lib/data/failures.ts` holds the deadpan invalid-combination lines.

The visual system is CSS/SVG: ruled paper, wobbly cards, category marker stripes, and a small category doodle on each element page.

## Saving

Progress lives in `localStorage` under `mendeleevs-mess:save:v1`. The notebook can export/import a JSON save from Settings. A corrupt save falls back to a fresh hydrogen state with a visible notice.

## PWA

The app is installable and precaches the shell, fonts, icons, and content. The manifest, icon PNGs, and service worker are generated during `pnpm build`. To regenerate icons after changing `static/favicon.svg`:

```bash
pnpm exec pwa-assets-generator --preset minimal-2023 static/favicon.svg
```

A new version shows a refresh prompt instead of reloading mid-forge.

## CI

GitHub Actions runs `validate`, `check`, `lint`, `test`, `build`, `check:bundle`, and the Playwright suite on every push and pull request. The deploy job on `master` runs when the repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` exist; otherwise it is skipped and CI still verifies the app.

## Deploy

The game runs on Cloudflare Workers static assets:

- https://mendeleevs-mess.alexionutale.workers.dev
- https://mendeleevs-mess.aiu-media.com

`pnpm deploy` builds, mirrors `200.html` to `index.html` for the Workers root, and runs `wrangler deploy` with `wrangler.jsonc`. The worker serves `build/` with single-page-application fallback, so unknown routes open the shell. Any static host works too: serve `build/` and rewrite `/` to `200.html`. No server, database, or API keys.
