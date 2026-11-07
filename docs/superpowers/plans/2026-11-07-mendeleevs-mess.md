# Mendeleev's Mess Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an installable, offline, mobile-first SvelteKit PWA where the player forges all 118 periodic-table elements from hydrogen through hidden recipe pairs.

**Architecture:** A pure TypeScript engine (`findRecipe`, `forge`) feeds a Svelte writable store that persists to localStorage. Stateless Svelte components render the forge, notebook, table, and settings. All 118 elements and recipes are data, validated by tests. SvelteKit SPA + `@vite-pwa/sveltekit` deliver the app; no backend.

**Tech Stack:** SvelteKit 2 + Svelte 5 + TypeScript, `@sveltejs/adapter-static`, `@vite-pwa/sveltekit`, Fontsource, Vitest + Testing Library for Svelte, Playwright, pnpm.

**Spec:** `docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md`

## Global Constraints

- Work in `/Users/ionutale/developer-playground/mendeleevs-mess`. Use `pnpm`; Node ≥ 20.
- SvelteKit SPA: `ssr = false`, `adapter-static` with `fallback: '200.html'`.
- Exactly 118 elements. Hydrogen is the starter and is discovered at `1 / 118`; the win fires at exactly 118.
- Recipes are fixed, hidden, unordered parent pairs. No hint system anywhere.
- Flavor lines ≤ 100 characters; all-ages, deadpan, no crude humor.
- Mobile-first at 360 px. Every action must be possible by tap alone; touch targets ≥ 44 px.
- No backend, accounts, or analytics. Save key: `mendeleevs-mess:save:v1`.
- Offline after first load. Fonts are self-hosted through Fontsource (OFL); no CDN.
- Initial JS ≤ 250 KB gzip.
- Commit after every task. Run the listed verification before committing.

## Review Focus

1. **Corrupt or tampered save** — load recovers to a clean state and surfaces a notice, never crashes. _Task 7._
2. **Re-forging a known pair** — quiet known result, one attempt, no duplicate discovery, no scrap entry. _Task 6._
3. **Same-symbol pairs and unknown symbols** — H + H works; stale/tampered symbols are invalid without crash or scrap pollution. _Task 6._
4. **Completion boundary with H pre-discovered** — 118 total, snapshot once, certificate once; sandbox cannot mutate it. _Tasks 6 and 16._
5. **Rapid double-submit of FORGE** — one outcome, one attempt, one discovery. _Task 11._

## File Map

| Path                                                     | Responsibility                             |
| -------------------------------------------------------- | ------------------------------------------ |
| `src/lib/types.ts`                                       | Shared types                               |
| `src/lib/data/categories.ts`                             | Category labels and marker colors          |
| `src/lib/data/elements.ts`                               | 118 elements, recipes, flavor              |
| `src/lib/data/failures.ts`                               | Failure-line pool                          |
| `src/lib/data/tableLayout.ts`                            | Classic periodic table coordinates         |
| `src/lib/game/validate.ts`                               | Content validation and reachability        |
| `src/lib/game/engine.ts`                                 | Recipe lookup, forge outcomes, scrap log   |
| `src/lib/game/storage.ts`                                | Save/load/parse/reset, corruption recovery |
| `src/lib/stores/game.ts`                                 | Svelte writable store, actions, autosave   |
| `src/lib/game/sound.ts`                                  | Procedural WebAudio cues                   |
| `src/lib/components/*.svelte`                            | Screens and UI                             |
| `src/lib/styles/*`                                       | Tokens, paper texture, cards, screens      |
| `src/routes/+layout.ts`                                  | `ssr = false`                              |
| `src/routes/+page.svelte`                                | Client-rendered game entry                 |
| `src/test/setup.ts`                                      | Jest-dom setup                             |
| `scripts/validate-content.ts` `scripts/check-bundle.mjs` | CLI checks                                 |
| `e2e/*.spec.ts`                                          | Playwright flows                           |

---

### Task 1: Scaffold, SvelteKit SPA, fonts, and smoke test

**Files:**

- Create: `package.json`, `svelte.config.js`, `vite.config.ts`, `src/routes/+layout.ts`, `src/routes/+layout.svelte`, `src/routes/+page.svelte`, `src/routes/page.test.ts`, `src/test/setup.ts`, `src/lib/styles/base.css`, `playwright.config.ts`
- Keep: existing `docs/` folder

**Interfaces:**

- Consumes: nothing
- Produces: a running SvelteKit SPA; `pnpm test`, `pnpm check`, `pnpm e2e`

- [ ] **Step 1: Scaffold**

```bash
cd /Users/ionutale/developer-playground/mendeleevs-mess
git init
pnpm dlx sv create . --template minimal --types ts \
  --add vitest="usages:unit,component" playwright="demo:no" \
  sveltekit-adapter="adapter:static" prettier eslint \
  --install pnpm --no-dir-check
pnpm add @fontsource-variable/caveat @fontsource-variable/nunito
pnpm add -D vite-node @testing-library/svelte @testing-library/jest-dom jsdom
pnpm exec playwright install chromium
```

- [ ] **Step 2: Configure**

`svelte.config.js`: `adapter({ fallback: '200.html' })` from `@sveltejs/adapter-static`, `vitePreprocess()`.

`src/routes/+layout.ts`:

```ts
export const ssr = false;
export const prerender = false;
```

`vite.config.ts`:

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts'],
		include: ['src/**/*.test.ts']
	}
});
```

`src/test/setup.ts`: `import '@testing-library/jest-dom/vitest'`.

`playwright.config.ts`: 390×844 touch context; `webServer: { command: 'pnpm build && pnpm preview --host 127.0.0.1 --port 4173', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI }`.

- [ ] **Step 3: Failing smoke test**

`src/routes/page.test.ts`:

```ts
import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Page from './+page.svelte';

describe('title', () => {
	it('renders the game name', () => {
		render(Page);
		expect(screen.getByRole('heading', { name: /mendeleev's mess/i })).toBeInTheDocument();
	});
});
```

- [ ] **Step 4: Run and confirm failure**

Run: `pnpm vitest run src/routes/page.test.ts`
Expected: FAIL.

- [ ] **Step 5: Implement the shell**

`src/routes/+page.svelte`: `<h1>Mendeleev's Mess</h1>`.

`+layout.svelte`: import both Fontsource packages and `base.css`; paper background `#FBF6E8`, ink `#2B2B2B`, Cormorant-style fallback not needed — use `'Nunito Variable'` body and `'Caveat Variable'` headings.

- [ ] **Step 6: Verify and commit**

Run: `pnpm vitest run src/routes/page.test.ts && pnpm check`
Expected: pass.

```bash
git add -A
git commit -m "chore: scaffold SvelteKit SPA with test harness"
```

---

### Task 2: Types, categories, validator, fixtures

**Files:**

- Create: `src/lib/types.ts`, `src/lib/data/categories.ts`, `src/lib/game/validate.ts`, `src/lib/game/validate.test.ts`, `src/lib/test/fixtures.ts`

**Interfaces:**

- Consumes: nothing
- Produces: `ElementRecord`, `Category`, `Screen`, `ScrapEntry`, `CompletionStats`, `GameSettings`, `GameState`; `CATEGORIES`; `validateElements`; `reachableSymbols`; fixtures

- [ ] **Step 1: Types**

`src/lib/types.ts`:

```ts
export type Category =
	| 'alkali-metal'
	| 'alkaline-earth-metal'
	| 'transition-metal'
	| 'post-transition-metal'
	| 'metalloid'
	| 'reactive-nonmetal'
	| 'halogen'
	| 'noble-gas'
	| 'lanthanide'
	| 'actinide';

export type Screen = 'forge' | 'notebook' | 'table' | 'settings';

export interface ElementRecord {
	number: number;
	symbol: string;
	name: string;
	category: Category;
	flavor: string;
	recipe: [string, string] | null;
}

export interface ScrapEntry {
	pair: [string, string];
	at: number;
}
export interface CompletionStats {
	attempts: number;
	startedAt: number;
	completedAt: number;
	elapsedMs: number;
}
export interface GameSettings {
	sound: boolean;
	reduceMotion: boolean;
}

export interface GameState {
	version: 1;
	discovered: string[];
	discoveredAt: Record<string, number>;
	attempts: number;
	scrapLog: ScrapEntry[];
	startedAt: number;
	introSeen: boolean;
	completedAt: number | null;
	certificateSeen: boolean;
	completionStats: CompletionStats | null;
	settings: GameSettings;
	lastScreen: Screen;
}
```

- [ ] **Step 2: Categories**

`src/lib/data/categories.ts` with labels and marker colors:

```ts
export const CATEGORIES: Record<Category, { label: string; color: string }> = {
	'alkali-metal': { label: 'Alkali metal', color: '#E8A15C' },
	'alkaline-earth-metal': { label: 'Alkaline earth', color: '#E8C45C' },
	'transition-metal': { label: 'Transition metal', color: '#8FB6D9' },
	'post-transition-metal': { label: 'Post-transition metal', color: '#9FAAB8' },
	metalloid: { label: 'Metalloid', color: '#7FBF9E' },
	'reactive-nonmetal': { label: 'Reactive nonmetal', color: '#6FB6E8' },
	halogen: { label: 'Halogen', color: '#5FB89A' },
	'noble-gas': { label: 'Noble gas', color: '#B48CE0' },
	lanthanide: { label: 'Lanthanide', color: '#D98FB5' },
	actinide: { label: 'Actinide', color: '#C97F9E' }
};
```

- [ ] **Step 3: Failing validator tests**

`src/lib/test/fixtures.ts`:

```ts
import type { ElementRecord, GameState } from '../types';

export function element(
	number: number,
	symbol: string,
	recipe: [string, string] | null = null,
	overrides: Partial<ElementRecord> = {}
): ElementRecord {
	return {
		number,
		symbol,
		name: symbol,
		category: 'reactive-nonmetal',
		flavor: `${symbol} is a rumor with a number.`,
		recipe,
		...overrides
	};
}

export const tinyElements: ElementRecord[] = [
	element(1, 'H', null, { name: 'Hydrogen' }),
	element(2, 'He', ['H', 'H'], { name: 'Helium', category: 'noble-gas' }),
	element(3, 'Li', ['He', 'H'], { name: 'Lithium', category: 'alkali-metal' })
];

export function gameState(overrides: Partial<GameState> = {}): GameState {
	return {
		version: 1,
		discovered: ['H'],
		discoveredAt: { H: 1_000 },
		attempts: 0,
		scrapLog: [],
		startedAt: 1_000,
		introSeen: true,
		completedAt: null,
		certificateSeen: false,
		completionStats: null,
		settings: { sound: true, reduceMotion: false },
		lastScreen: 'forge',
		...overrides
	};
}
```

`src/lib/game/validate.test.ts`: accepts `tinyElements`; rejects unreachable, unknown recipe symbols, and flavor >100.

- [ ] **Step 4: Implement validator**

`reachableSymbols(elements, starters)` closes over recipes. `validateElements` checks unique numbers/symbols, valid categories, flavor 1–100, H recipe null, all other recipes present and known, and full reachability from H.

- [ ] **Step 5: Verify and commit**

Run: `pnpm vitest run src/lib/game/validate.test.ts && pnpm check`
Expected: pass.

```bash
git add -A
git commit -m "feat: add types, categories, and content validator"
```

---

### Task 3: Elements 1–36

**Files:**

- Create: `src/lib/data/elements.ts`, `src/lib/data/elements.test.ts`

**Interfaces:**

- Consumes: `ElementRecord`, `validateElements`
- Produces: `ELEMENTS`, `ELEMENT_BY_SYMBOL`, `STARTER_SYMBOL`

- [ ] **Step 1: Author 1–36**

Official symbols/names/categories; H `recipe: null`; one hidden pair for every other element. Use a guaranteed fallback chain (`previous + H`) while drafting, then replace at least half with real-ish fusions (`H+H→He`, `He+Be→C`, `C+He→O`, `O+He→Ne`). Re-run the validator after every edit. Flavor ≤100 chars.

- [ ] **Step 2: Failing tests**

```ts
it('ships 36 valid, reachable elements', () => {
	expect(ELEMENTS).toHaveLength(36);
	expect(validateElements(ELEMENTS)).toEqual({ ok: true, errors: [] });
	expect(reachableSymbols(ELEMENTS, ['H']).size).toBe(36);
});
```

- [ ] **Step 3: Run, author, pass**

Run: `pnpm vitest run src/lib/data/elements.test.ts` → PASS.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add elements 1-36 with hidden recipes"
```

---

### Task 4: Elements 37–86 and content CLI

**Files:**

- Modify: `src/lib/data/elements.ts`, `src/lib/data/elements.test.ts`
- Create: `scripts/validate-content.ts`

**Interfaces:**

- Produces: 86-record dataset; `pnpm validate`

- [ ] **Step 1: Extend to 86**

Add Rb–Rn. Keep every recipe rooted in reachable elements. Prefer chemistry-adjacent logic.

- [ ] **Step 2: Update count to 86**

- [ ] **Step 3: Add CLI**

`scripts/validate-content.ts` imports `ELEMENTS`, `validateElements`, `reachableSymbols`; prints `86 elements, 86 reachable`; exits non-zero on errors. Add `"validate": "vite-node scripts/validate-content.ts"`.

- [ ] **Step 4: Verify and commit**

Run: `pnpm validate && pnpm vitest run src/lib/data/elements.test.ts`
Expected: pass.

```bash
git add -A
git commit -m "feat: add elements 37-86 and content validation script"
```

---

### Task 5: Elements 87–118, failure lines, final content

**Files:**

- Modify: `src/lib/data/elements.ts`, `src/lib/data/elements.test.ts`
- Create: `src/lib/data/failures.ts`

**Interfaces:**

- Produces: 118 elements; `FAILURE_LINES`

- [ ] **Step 1: Extend to 118 and add failures**

Add Fr–Og. Add ≥24 unique deadpan failure lines, 4–80 characters, no hints, no scolding.

- [ ] **Step 2: Final tests**

```ts
it('ships all 118 and all are reachable', () => {
	expect(ELEMENTS).toHaveLength(118);
	expect(new Set(ELEMENTS.map((e) => e.number))).toEqual(
		new Set(Array.from({ length: 118 }, (_, i) => i + 1))
	);
	expect(validateElements(ELEMENTS)).toEqual({ ok: true, errors: [] });
	expect(reachableSymbols(ELEMENTS, ['H']).size).toBe(118);
});
it('has a varied failure pool', () => {
	expect(FAILURE_LINES.length).toBeGreaterThanOrEqual(24);
	expect(new Set(FAILURE_LINES).size).toBe(FAILURE_LINES.length);
});
```

- [ ] **Step 3: Verify and commit**

Run: `pnpm validate && pnpm test`
Expected: `118 elements, 118 reachable`.

```bash
git add -A
git commit -m "feat: complete the 118-element table and failure copy"
```

---

### Task 6: Recipe engine

**Files:**

- Create: `src/lib/game/engine.ts`, `src/lib/game/engine.test.ts`
- Modify: `src/test/fixtures.ts` (add `gameState` already there)

**Interfaces:**

- Produces: `normalizePair`, `findRecipe`, `addScrapEntry`, `forge`, `ForgeOutcome`

- [ ] **Step 1: Failing tests**

```ts
it('is order-independent and supports identical parents', () => {
	expect(findRecipe(tinyElements, 'H', 'H')?.symbol).toBe('He');
	expect(findRecipe(tinyElements, 'He', 'H')?.symbol).toBe('Li');
});
it('discovers a new element and records its timestamp', () => {
	const { state, outcome } = forge(gameState(), 'H', 'H', tinyElements, 5_000);
	expect(outcome).toMatchObject({ kind: 'new', element: { symbol: 'He' } });
	expect(state.discovered).toEqual(['H', 'He']);
	expect(state.discoveredAt.He).toBe(5_000);
});
it('treats a known pair as known without duplicating or scraping', () => {
	const start = gameState({ discovered: ['H', 'He'], discoveredAt: { H: 1, He: 2 }, attempts: 4 });
	const { state, outcome } = forge(start, 'H', 'H', tinyElements, 5_000);
	expect(outcome.kind).toBe('known');
	expect(state.attempts).toBe(5);
	expect(state.scrapLog).toEqual([]);
});
it('records invalid pairs, deduplicates, and ignores unknown symbols', () => {
	const start = gameState({ discovered: ['H', 'He', 'Li'], discoveredAt: { H: 1, He: 2, Li: 3 } });
	expect(forge(start, 'He', 'He', tinyElements, 5_000).state.scrapLog).toEqual([
		{ pair: ['He', 'He'], at: 5_000 }
	]);
	expect(forge(gameState(), 'H', 'Xx', tinyElements, 5_000).state.scrapLog).toEqual([]);
});
it('completes once at the element-count boundary with stats', () => {
	const start = gameState({ discovered: ['H', 'He'], discoveredAt: { H: 1, He: 2 }, attempts: 9 });
	const { state } = forge(start, 'H', 'He', tinyElements, 5_000);
	expect(state.completedAt).toBe(5_000);
	expect(state.completionStats).toEqual({
		attempts: 10,
		startedAt: 1_000,
		completedAt: 5_000,
		elapsedMs: 4_000
	});
});
```

- [ ] **Step 2: Implement**

`normalizePair` sorts. `findRecipe` checks known symbols and unordered match. `forge` always increments attempts; new appends symbol + timestamp and completes at `elements.length`; known changes only attempts; invalid adds a deduped scrap entry only when both symbols exist; cap 20 newest first.

- [ ] **Step 3: Verify and commit**

Run: `pnpm vitest run src/lib/game/engine.test.ts`
Expected: pass.

```bash
git add -A
git commit -m "feat: add recipe lookup and forge engine"
```

---

### Task 7: Save, load, corruption recovery

**Files:**

- Create: `src/lib/game/storage.ts`, `src/lib/game/storage.test.ts`

**Interfaces:**

- Produces: `SAVE_KEY`, `createInitialState`, `parseState`, `loadState`, `saveState`, `clearState`

- [ ] **Step 1: Failing tests**

Use a Map-backed `Storage`; test initial Hydrogen, round-trip, corrupt JSON recovery, wrong version/missing H recovery, failed write returning false.

- [ ] **Step 2: Implement**

`createInitialState(now)` = H discovered, `1 / 118` state. `parseState` requires version 1, full shape, H present; backfills H timestamp and settings. `loadState` returns `{ state, recovered }`. `saveState` catches quota errors. `clearState` never throws.

- [ ] **Step 3: Verify and commit**

Run: `pnpm vitest run src/lib/game/storage.test.ts`
Expected: pass.

```bash
git add -A
git commit -m "feat: add versioned save with corruption recovery"
```

---

### Task 8: Svelte game store and autosave

**Files:**

- Create: `src/lib/stores/game.ts`, `src/lib/stores/game.test.ts`

**Interfaces:**

- Produces:
  - `game: Writable<GameState>`, `recovered: Writable<boolean>`, `SAVE_KEY` (re-export)
  - `initGame(seed?: number, overrides?: Partial<GameState>): void`
  - actions `forgePair(a, b): ForgeOutcome`, `setScreen`, `dismissIntro`, `updateSettings`, `markCertificateSeen`, `resetGame`, `exportSave`, `importSave`

- [ ] **Step 1: Failing tests**

```ts
import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { forgePair, game, initGame, recovered, importSave, SAVE_KEY } from './game';

beforeEach(() => localStorage.clear());

it('discovers helium and persists it', () => {
	initGame(5_000);
	expect(forgePair('H', 'H').kind).toBe('new');
	expect(get(game).discovered).toContain('He');
	expect(JSON.parse(localStorage.getItem(SAVE_KEY)!).discovered).toContain('He');
});

it('reports a recovered corrupt save', () => {
	localStorage.setItem(SAVE_KEY, '{oops');
	initGame(5_000);
	expect(get(recovered)).toBe(true);
});

it('rejects a corrupt import and accepts a valid one', () => {
	initGame(5_000);
	expect(importSave('{bad')).toBe(false);
	expect(importSave(JSON.stringify({ version: 1, state: get(game) }))).toBe(true);
});
```

- [ ] **Step 2: Implement**

`initGame` loads storage once (or merges overrides), sets `game`/`recovered`, and subscribes autosave. Actions compute with pure engine and `game.set`. `exportSave` returns JSON. `resetGame` clears the key and sets a fresh state. No component context.

- [ ] **Step 3: Verify and commit**

Run: `pnpm vitest run src/lib/stores/game.test.ts`
Expected: pass.

```bash
git add -A
git commit -m "feat: add Svelte game store with autosave and import/export"
```

---

### Task 9: App shell, navigation, recovery notice

**Files:**

- Create: `src/lib/components/App.svelte`, `AppBar.svelte`, `BottomNav.svelte`, `src/lib/components/app.test.ts`
- Modify: `src/routes/+page.svelte` to render `App`

**Interfaces:**

- `App.svelte` renders the active screen, recovered banner, and first-run overlay
- `AppBar` props `{ progress, total }`; `BottomNav` props `{ current, onChange }`

- [ ] **Step 1: Failing tests**

```ts
import { render, screen } from '@testing-library/svelte';
import { fireEvent } from '@testing-library/svelte';
import App from './App.svelte';
import { initGame } from '$lib/stores/game';

beforeEach(() => {
	localStorage.clear();
	initGame(5_000);
});

it('shows progress and switches screens', async () => {
	render(App);
	expect(screen.getByText('1 / 118')).toBeInTheDocument();
	await fireEvent.click(screen.getByRole('button', { name: 'Table' }));
	expect(screen.getByRole('heading', { name: 'The table' })).toBeInTheDocument();
});
```

- [ ] **Step 2: Implement**

Placeholder screens return `<h2>The forge</h2>` etc. until later tasks. `BottomNav` lives in `<nav aria-label="Main">`; active button `aria-current="page"`.

- [ ] **Step 3: Verify and commit**

Run: `pnpm test && pnpm check`
Expected: pass.

```bash
git add -A
git commit -m "feat: add app shell, navigation, and recovery notice"
```

---

### Task 10: Element card, slot, tray

**Files:**

- Create: `src/lib/components/ElementCard.svelte`, `Slot.svelte`, `Tray.svelte`, `src/lib/components/cards.test.ts`, `src/lib/styles/cards.css`

**Interfaces:**

- `ElementCard` props `{ element, selected?, onclick? }`
- `Slot` props `{ symbol, index, onClear }`
- `Tray` props `{ elements, onPick, disabled? }` with sort/filter/search

- [ ] **Step 1: Failing tests**

```ts
it('labels a card with symbol, name, and number', () => {
	render(ElementCard, { props: { element: tinyElements[1] } });
	expect(screen.getByText('He')).toBeInTheDocument();
	expect(screen.getByText('Helium')).toBeInTheDocument();
});
it('clears a filled slot', async () => {
	const onClear = vi.fn();
	render(Slot, { props: { symbol: 'H', index: 1, onClear } });
	await fireEvent.click(screen.getByRole('button', { name: /clear slot 1/i }));
	expect(onClear).toHaveBeenCalled();
});
it('filters and searches the tray', async () => {
	render(Tray, { props: { elements: tinyElements, onPick: vi.fn() } });
	await fireEvent.input(screen.getByRole('searchbox'), { target: { value: 'hel' } });
	expect(screen.getAllByRole('button', { name: /helium/i })).toHaveLength(1);
});
```

- [ ] **Step 2: Implement**

Category stripe, number, symbol, name, `aria-label` with name/number/category. Slot has `data-testid="slot-{index}"` and a clear button. Tray: native `<select>` sort/filter, search input, buttons, 44 px.

- [ ] **Step 3: Verify and commit**

Run: `pnpm vitest run src/lib/components/cards.test.ts`
Expected: pass.

```bash
git add -A
git commit -m "feat: add element card, forge slot, and searchable tray"
```

---

### Task 11: Forge screen and discovery flow

**Files:**

- Create: `ForgeScreen.svelte`, `DiscoveryOverlay.svelte`, `ElementPage.svelte`, `src/lib/components/forge.test.ts`
- Modify: `App.svelte`

**Interfaces:**

- Forge slots state, tap-to-fill/tap-twice, FORGE, discovery overlay, known/invalid toasts
- `ElementPage` props `{ element, parents?, discoveredAt? }`

- [ ] **Step 1: Failing tests**

```ts
import { get } from 'svelte/store';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it } from 'vitest';
import ForgeScreen from './ForgeScreen.svelte';
import { game, initGame } from '$lib/stores/game';
import { ELEMENTS } from '$lib/data/elements';
import { normalizePair } from '$lib/game/engine';

beforeEach(() => {
	localStorage.clear();
	initGame(5_000);
});

it('forges helium by tapping H twice and pressing FORGE', async () => {
	render(ForgeScreen);
	const h = screen.getAllByRole('button', { name: /hydrogen/i });
	await fireEvent.click(h[0]);
	await fireEvent.click(h[0]);
	await fireEvent.click(screen.getByRole('button', { name: /^forge$/i }));
	expect(await screen.findByRole('dialog', { name: /helium/i })).toBeInTheDocument();
});
it('keeps both cards after an invalid pair and records scrap', async () => {
	const discovered = ELEMENTS.slice(0, 20).map((e) => e.symbol);
	const valid = new Set(
		ELEMENTS.filter((e) => e.recipe).map((e) => normalizePair(e.recipe![0], e.recipe![1]).join('+'))
	);
	const [a, b] = discovered
		.flatMap((x, i) => discovered.slice(i).map((y) => [x, y] as [string, string]))
		.find(([x, y]) => !valid.has(normalizePair(x, y).join('+')))!;
	initGame(5_000, {
		discovered,
		discoveredAt: Object.fromEntries(discovered.map((s, i) => [s, i + 1]))
	});
	render(ForgeScreen);
	const byName = (s: string) => new RegExp(ELEMENTS.find((e) => e.symbol === s)!.name, 'i');
	await fireEvent.click(screen.getByRole('button', { name: byName(a) }));
	await fireEvent.click(screen.getByRole('button', { name: byName(b) }));
	await fireEvent.click(screen.getByRole('button', { name: /^forge$/i }));
	expect(await screen.findByRole('status')).toHaveTextContent(/.+/);
	expect(screen.getByRole('button', { name: /clear slot 1/i })).toBeInTheDocument();
});
it('does not double-forge on a rapid double click', async () => {
	render(ForgeScreen);
	const h = screen.getAllByRole('button', { name: /hydrogen/i });
	await fireEvent.click(h[0]);
	await fireEvent.click(h[0]);
	const forge = screen.getByRole('button', { name: /^forge$/i });
	await fireEvent.click(forge);
	await fireEvent.click(forge);
	expect(get(game).attempts).toBe(1);
});
```

- [ ] **Step 2: Implement**

Slots `[string|null,string|null]`; tapping same card twice fills both. `forging` flag disables the button synchronously. `new` opens a focus-trapped dialog with `ElementPage`; `known` shows "Already in the notebook."; `invalid` shows a failure line and leaves both slots filled. Play `sound` cues in Task 14 only.

- [ ] **Step 3: Verify and commit**

Run: `pnpm vitest run src/lib/components/forge.test.ts`
Expected: pass.

```bash
git add -A
git commit -m "feat: add forge loop with discovery, failure, and double-submit guard"
```

---

### Task 12: Notebook, element page, scrap log

**Files:**

- Create: `NotebookScreen.svelte`, `ScrapLog.svelte`, `src/lib/components/notebook.test.ts`
- Modify: `ElementPage.svelte`

- [ ] **Step 1: Failing tests**

- Opens an element page with flavor and date.
- Scrap log lists `H + Fe`, clears, persists.
- Search filters discovered pages only.

- [ ] **Step 2: Implement**

Newest-first grid; sort (Newest/Number/Name), category filter, search; detail view; collapsible scrap log; empty copy.

- [ ] **Step 3: Verify and commit**

Run: `pnpm vitest run src/lib/components/notebook.test.ts`
Expected: pass.

```bash
git add -A
git commit -m "feat: add notebook, element pages, and scrap log"
```

---

### Task 13: Table view and layout data

**Files:**

- Create: `src/lib/data/tableLayout.ts`, `TableScreen.svelte`, `PeriodicTable.svelte`, `StickerGrid.svelte`, `src/lib/components/table.test.ts`, `src/lib/data/tableLayout.test.ts`

- [ ] **Step 1: Layout test**

118 unique entries, cols 1–18, rows 1–9; lanthanides/actinides in rows 8/9.

- [ ] **Step 2: Screen tests**

- Undiscovered symbols absent; discovered visible.
- Toggle sticker/classic; missing filter hides discovered.
- Progress `2 / 118`.

- [ ] **Step 3: Implement**

Sticker grid default on phones; classic grid pannable with `aria-label="Periodic table"`; undiscovered number-only tiles; missing filter.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run src/lib/components/table.test.ts src/lib/data/tableLayout.test.ts`
Expected: pass.

```bash
git add -A
git commit -m "feat: add sticker and classic periodic table views"
```

---

### Task 14: Sound and reduced motion

**Files:**

- Create: `src/lib/game/sound.ts`, `sound.test.ts`, `src/lib/stores/motion.ts`, `motion.test.ts`
- Modify: `ForgeScreen.svelte`, `app.css`

- [ ] **Step 1: Failing tests**

- Disabled sound constructs no AudioContext; enabled never throws.
- `reducedMotion` store true when settings or OS prefers reduce.
- ForgeScreen calls pick/forge/stamp/fail in the right branches (spy on the player).

- [ ] **Step 2: Implement**

`createSoundPlayer(factory)` with lazy context and short oscillator cues. `motion.ts` writable derived from settings + `matchMedia`. CSS disables transforms/animations under reduced motion.

- [ ] **Step 3: Verify and commit**

```bash
git add -A
git commit -m "feat: add procedural sound cues and reduced-motion support"
```

---

### Task 15: First run and empty states

**Files:**

- Create: `FirstRun.svelte`, `src/lib/components/first-run.test.ts`
- Modify: `App.svelte`, notebook/table empty copy

- [ ] **Step 1: Failing tests**

Intro shows once, dismisses, persists across remount. Empty search copy; empty scrap copy; empty missing filter.

- [ ] **Step 2: Implement**

`role="dialog"`, copy "You have one hydrogen. The rest is a rumor.", button "Get started" → `dismissIntro()`. Empty copy.

- [ ] **Step 3: Verify and commit**

```bash
git add -A
git commit -m "feat: add first-run intro and empty states"
```

---

### Task 16: Completion, certificate, reset

**Files:**

- Create: `WinScreen.svelte`, `src/lib/components/win.test.ts`
- Modify: `App.svelte`, `Settings.svelte`

- [ ] **Step 1: Failing tests**

Seed 118 discovered; certificate appears once; Keep looking persists; reopen from Settings; stats snapshot frozen.

- [ ] **Step 2: Implement**

Dialog with certificate, stats, Mendeleev doodle, ink stamp. Keep looking sets `certificateSeen`; Start over is two-step; Share copies a summary with fallback.

- [ ] **Step 3: Verify and commit**

```bash
git add -A
git commit -m "feat: add completion certificate and reset flow"
```

---

### Task 17: Settings

**Files:**

- Create: `Settings.svelte`, `src/lib/components/settings.test.ts`
- Modify: `App.svelte`

- [ ] **Step 1: Failing tests**

Toggles persist; reset two-step; import valid save, reject garbage; certificate link when complete.

- [ ] **Step 2: Implement**

Sound/motion toggles, install guidance, export/import, reset, certificate, version. iOS instructions when no prompt.

- [ ] **Step 3: Verify and commit**

```bash
git add -A
git commit -m "feat: add settings, install guidance, and save transfer"
```

---

### Task 18: PWA, icons, offline

**Files:**

- Create: `static/favicon.svg`, `src/lib/components/PwaUpdate.svelte`, `e2e/pwa.spec.ts`
- Modify: `vite.config.ts`, `+layout.svelte`, `app.d.ts`

- [ ] **Step 1: Install**

```bash
pnpm add -D @vite-pwa/sveltekit @vite-pwa/assets-generator vite-plugin-pwa
```

- [ ] **Step 2: Failing e2e**

Manifest link + 192/512 icons; service worker ready; reload; offline; title visible.

- [ ] **Step 3: Configure**

`SvelteKitPWA({ registerType: 'prompt', pwaAssets: { preset: 'minimal-2023', image: 'static/favicon.svg', overrideManifestIcons: true }, manifest: { name: "Mendeleev's Mess", short_name: 'Mendeleev', theme_color: '#FBF6E8', background_color: '#FBF6E8', display: 'standalone', orientation: 'portrait', start_url: '/', scope: '/' }, workbox: { globPatterns: ['client/**/*.{js,css,html,svg,png,ico,woff2}'] }, kit: { includeVersionFile: true } })`.

`PwaUpdate.svelte` uses `useRegisterSW` from `virtual:pwa-register/svelte`.

- [ ] **Step 4: Verify and commit**

Run: `pnpm build && pnpm e2e e2e/pwa.spec.ts`.

```bash
git add -A
git commit -m "feat: add installable PWA with offline cache and update prompt"
```

---

### Task 19: Accessibility and keyboard flow

**Files:** Modify components/styles; Create `e2e/a11y.spec.ts`; add `@axe-core/playwright`.

- [ ] **Step 1: Failing tests**

Axe on Forge, Notebook, Table, Settings; keyboard-only forge.

- [ ] **Step 2: Fix**

Native buttons, focus rings, focus traps, live region, 44 px, contrast, not color-only.

- [ ] **Step 3: Verify and commit**

```bash
git add -A
git commit -m "fix: complete keyboard, focus, and contrast accessibility"
```

---

### Task 20: Regression, budget, README

**Files:**

- Create: `e2e/game.spec.ts`, `scripts/check-bundle.mjs`, `README.md`
- Modify: `package.json`, wide-screen styles, doodle motifs

- [ ] **Step 1: Doodle art**

Create `CategoryDoodle.svelte` with 10 inline SVG motifs and a Mendeleev mascot; use on pages/empty states. Paper texture, stamps, wide layout.

- [ ] **Step 2: Regression e2e**

Cold start H+H→He under 30s; reload persistence; desktop drag; completion without repeating certificate; offline; keyboard-only.

- [ ] **Step 3: Bundle budget**

Sum gzipped JS under `build/_app/`; fail above 250 KB. Add `"check:bundle"`.

- [ ] **Step 4: README**

Run/test/check/validate/build/preview/e2e, content authoring, reachability, static deploy.

- [ ] **Step 5: Final verification**

```bash
pnpm validate && pnpm check && pnpm test && pnpm build && pnpm check:bundle && pnpm e2e
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "test: add regression suite, bundle budget, and README"
```

---

## Self-Review Notes

- **Spec coverage:** 118 content (3–5), recipes/engine (6), save/store (7–8), shell (9), forge/notebook/table (10–13), sound/motion (14), onboarding (15), completion (16), settings (17), PWA (18), a11y (19), regression/art (20).
- **Review Focus mapping:** corrupt save → 7; known pair → 6; unknown/same-symbol → 6; completion → 6/16; double-submit → 11.
- **Type consistency:** `GameState` defined once; store actions and component props use the same names; all engine functions are pure and return new state.
