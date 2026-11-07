# Mendeleev's Mess — Design

Date: 2026-11-07
Status: awaiting human approval
Scope: Game A of three independent games. Games B (neon lab) and C (alchemist's table) are out of scope.

## 1. Intent

A Doodle Devil–style discovery game where the player forges the periodic table from a single hydrogen atom. Two element cards go into a forge; a hidden recipe decides whether a new element appears. The reward is the discovery itself: a new page in a hand-drawn notebook, a new card in the tray, a new tile on the table.

The visual world is a scientist's notebook: ruled paper, marker ink, wobbly hand-drawn cards, ink stamps, and a Mendeleev doodle who takes credit for everything. The tone is all-ages clever: deadpan science jokes, absurd but never crude.

The game is a mobile-first, installable PWA. It works offline after first load and saves progress locally.

## 2. Goals, non-goals, anti-goals

### Goals

- Forge all 118 real elements from hydrogen using fixed, hidden recipe pairs.
- Complete the periodic table as the win condition.
- Pure experimentation: no hint button, no clue system, no recipe list.
- Make failure funny and harmless; no timers, lives, or penalties.
- Feel hand-made: notebook art, ink, stamps, paper.
- Work with one thumb on a 360 px phone, and on desktop.
- Installable, offline, and persistent.
- Keep content data-driven so 118 elements, recipes, and jokes are testable.

### Non-goals

- No compounds, molecules, or chemistry beyond elements.
- No realistic nuclear physics simulation.
- No accounts, backend, cloud saves, leaderboards, or multiplayer.
- No ads, purchases, or monetization.
- No hint system of any kind.
- No per-element bespoke illustration in v1 (see art system).
- No games B or C in this project.

### Anti-goals

- It must not feel like a chemistry textbook or a spreadsheet.
- It must not punish wrong guesses or waste the player's time.
- It must not hide the periodic table's structure; the table is the map.
- It must not become a generic neon/sci-fi UI. That is Game B's identity.

## 3. Decisions already made

- Name: **Mendeleev's Mess**.
- Project folder: `mendeleevs-mess`.
- Audience/tone: all-ages clever.
- Recipe model: fixed hidden parent pairs, Doodle-style, unordered, same-element pairs allowed.
- Discovery model: pure experimentation. No hints.
- Scope: all 118 elements at launch.
- Platform: mobile-first installable PWA.
- Stack: SvelteKit 2 + Svelte 5 + TypeScript + `@sveltejs/adapter-static` + `@vite-pwa/sveltekit`.
- Art direction: notebook doodle (chosen over neon lab and alchemist's table).

## 4. Approaches considered

### Recipe mechanic

| Approach                     | Trade-off                                                                      | Verdict    |
| ---------------------------- | ------------------------------------------------------------------------------ | ---------- |
| Hidden fixed parent pairs    | Real discovery; authorable jokes; needs content and reachability validation    | **Chosen** |
| Add atomic numbers (1+2=3)   | Elegant rule, but becomes arithmetic; every element reachable from H trivially | Rejected   |
| Real stellar fusion pathways | Thematic and educational, but rigid; jokes and heavy elements suffer           | Rejected   |

### Build stack

| Approach                                                        | Trade-off                                                                                                                                | Verdict                                           |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| SvelteKit + TypeScript + adapter-static + `@vite-pwa/sveltekit` | Best fit for card/state/content UI; compile-time reactivity, accessible, small runtime, easy tests; one framework across all three games | **Chosen**                                        |
| Vanilla TypeScript + Vite                                       | Smallest bundle; hand-built rendering, state, drag, transitions; slower and buggier for this UI                                          | Rejected                                          |
| Phaser 3 / canvas                                               | Great for particles; poor for text layout, responsiveness, accessibility                                                                 | Rejected; better suited to a future action sequel |

Because the game is almost entirely UI, state, and content — no game loop — SvelteKit is the sensible structure. It also keeps all three games on one delivery stack while letting each keep its own visual language.

## 5. Core loop

1. The player starts with a single **Hydrogen** card and Hydrogen already stamped into the notebook (`1 / 118`). Hydrogen cannot be forged; it is the seed.
2. The forge has two slots and a large ink-stamp **FORGE** button.
   - Tap an element to place it in the next empty slot.
   - Tap an element twice to place two copies (this enables H + H → He).
   - Tapping a filled slot clears it.
   - Pointer drag to a slot also works on desktop; tap is always sufficient on mobile.
3. Press FORGE. The pair is looked up unordered.
   - **Valid recipe, new element:** the result card is stamped in, its notebook page opens, the tray and table update, and the save is written. A short sound and ink-burst animation play.
   - **Valid recipe, already discovered:** a quiet "Already in the notebook." toast and a soft ink thump. No celebration, no page auto-open. The pair counts as an attempt but is not added to the scrap log.
   - **Invalid pair:** both cards stay in their slots and wobble. A deadpan line from a rotating pool appears ("Nothing. The universe yawns."). Nothing is consumed, so the player can swap one card and retry immediately. The pair is added to the scrap log.
4. Every discovered element has a notebook page: symbol, atomic number, name, category, a one-line joke, a category doodle motif, and (after discovery) the two parents that forged it.
5. The table view shows discovered tiles in the real periodic layout, plus a sticker-grid view by atomic number. Undiscovered tiles show only their atomic number and a faint outline.
6. At 118/118 the game shows a completion certificate with a stats snapshot taken at that moment, then offers **Keep looking** (sandbox) or **Start over**. Completion is persisted; the certificate is revisitable from Settings, and sandbox play never changes the snapshot.

### Recipe rules

- Hydrogen is the starter and has no recipe.
- Every other element has exactly one unordered parent pair.
- A pair may contain the same element twice (H + H → He).
- Recipes are authored data, never computed from atomic numbers.
- The recipe graph must be reachable: starting from `{H}`, repeatedly adding elements whose two parents are already discovered must yield all 118. A build-time validator proves this.
- Recipes are biased toward real nuclear/chemical logic where it exists (H + H → He, He + Be → C), so chemistry knowledge feels rewarded, but absurd fusions fill the gaps. There is no promise of scientific accuracy.
- No pair may have two possible results.

### Failure and friction rules

- Wrong guesses cost nothing. The only counter is a stats value.
- **Scrap log:** a clearable list of the last 20 failed pairs, persisted across reloads and deduplicated (a repeated pair moves to the top instead of filling a slot). This is a memory aid, not a hint; it never suggests a working pair.
- The tray can be sorted (atomic number, name, category) and filtered by category, and has a text search. This is navigation, not assistance.
- No hint button, no "probable partner" highlight, no recipe book.

## 6. Content

### Element data

Each element record:

- atomic number (1–118)
- symbol
- name
- category (one of 10)
- flavor line, ≤ 100 characters
- recipe: `[symbol, symbol] | null` (null only for H)

Categories and marker colors:

- alkali metal
- alkaline earth metal
- transition metal
- post-transition metal
- metalloid
- reactive nonmetal
- halogen
- noble gas
- lanthanide
- actinide

Each category gets one accent color used as a marker stripe on cards and table tiles.

### Writing rules

- All-ages clever: no crude jokes, no politics, no body humor, no punching down.
- Deadpan delivery; never explain the joke.
- One line per element, ≤ 100 characters.
- Jokes may reference real properties (noble gases are aloof, gold is smug, iron is dependable) but need not be educational.
- Failure lines are short, varied, and never scold the player.
- Mendeleev's voice appears only on the win screen and in the first-run intro, so he stays a treat.

### Authoring workflow

1. Draft the 118 recipes and flavor lines in the data file.
2. Run the recipe validator; fix reachability and uniqueness failures.
3. Playtest a sample path (H → He → C → O → Fe → Au) to sanity-check humor and pacing.
4. Spot-check rare/heavy elements for readability and tone.

## 7. Screens and interaction

### App shell

- Top bar: title, progress (`12 / 118`), menu/settings.
- Bottom navigation: **Forge**, **Notebook**, **Table**, **Settings**.
- Phone-first single column. On wide screens, the forge and notebook can sit side by side, but no feature is desktop-only.

### Forge (home)

- Two large forged slots with card shadows and dashed drop zones.
- Center FORGE stamp button; disabled until both slots are filled.
- Below: the tray, horizontally scrollable, with sort/filter/search controls.
- New discovery: card flies to the notebook tab, ink stamp lands, and the notebook page can be opened immediately or dismissed.
- Invalid: shake plus a random line in a speech tag.

### Notebook

- Grid of discovered element pages, newest first by default.
- Sort by number or name; filter by category; search by name/symbol.
- Detail page: large doodle card, symbol, number, name, category, joke, parents used, date discovered.
- Scrap log lives at the bottom of this screen in a collapsible "Failed experiments" section with a clear button.

### Table

- Default mobile view: sticker grid by atomic number (rows of 10), with discovered tiles in category colors and undiscovered tiles as numbered silhouettes.
- Toggle to the classic 18-column periodic layout, horizontally pannable, with lanthanides and actinides in separate rows.
- Completion percentage and a "missing" filter (show only undiscovered).

### Settings

- Sound on/off.
- Reduce motion on/off (also respects OS setting).
- Install app (when available) and iOS "Add to Home Screen" instructions.
- Reset progress (two-step confirmation).
- About/credits and version.
- Optional: export/import save as JSON (recommended, builder's call).

### Win

- Full-screen certificate: "Mendeleev's Mess — Certificate of Complete Chaos", 118/118, total attempts, elapsed time, start date.
- Mendeleev doodle, ink stamp, paper texture.
- Buttons: Keep looking (sandbox), Start over, Share (copy a text summary to clipboard).
- **Keep looking** persists `completedAt` and a `certificateSeen` flag, hides the certificate, and leaves the completed table intact. The certificate stays available from Settings → View certificate. Sandbox attempts after completion do not alter the saved stats snapshot.

### First run

- One overlay, dismissible with a single button: "You have one hydrogen. The rest is a rumor." The forge slots are already visible behind it.
- Shown once; `introSeen` is persisted in the save.
- No multi-step tutorial, no forced walkthrough.

## 8. Visual system

- **Surface:** cream paper `#FBF6E8` with faint ruled lines and a paper-fiber noise overlay.
- **Ink:** near-black `#2B2B2B`; red marker accent `#D94F4F`; blue pen accent `#4A7FB5`.
- **Cards:** wobbly hand-drawn border (asymmetric border-radius plus a subtle SVG displacement), category marker stripe, atomic number top-left, large symbol, name below.
- **Typography:** a self-hosted handwritten display face (e.g. Caveat or Patrick Hand, OFL) for headlines/symbols, and a highly readable self-hosted body face (e.g. Nunito, OFL). No external font CDN; offline must work.
- **Doodles:** 10 category motifs reused with variation, plus a Mendeleev mascot for the win screen and empty states. No 118 bespoke illustrations in v1.
- **Motion:** 150–400 ms; card lift, ink stamp, paper wobble. No parallax, no neon glow.
- **Sound:** short procedural WebAudio cues only — card pick, forge whoosh, stamp thud, failure wobble, completion chord. No audio files and no music in v1, so there is nothing extra to precache. Sound is on by default and controlled by the Settings toggle.
- **Accessibility:** contrast ≥ 4.5:1 for text, visible focus rings, 44 px touch targets, all interactions keyboard-operable, discovery announced via `aria-live`, `prefers-reduced-motion` honored.

## 9. PWA, storage, and offline

- `manifest.webmanifest`: name, short name, 192/512 icons, `display: standalone`, portrait-friendly, cream theme/background.
- Service worker precaches the app shell, fonts, icons, and content; the game is fully playable offline after the first load.
- Update flow: detect a new service worker, show a small "A new mess is ready" refresh prompt; never reload mid-forge.
- Install prompt in Settings; iOS instructions where the prompt is unavailable.
- Save key: `mendeleevs-mess:save:v1` in `localStorage`.
- Save payload: schema version, discovered symbols (Hydrogen included from the start), per-element discovery timestamps, attempts, `startedAt`, settings, last screen, `introSeen`, scrap log (last 20 unique failed pairs), `completedAt`, `certificateSeen`, and the completion stats snapshot. Autosave after each forge, settings change, and screen change.
- Migration hook from v1 forward; if the save is corrupt, start clean with a visible notice rather than crashing.
- Optional export/import JSON for moving progress between devices (no server).

## 10. Architecture

- `src/lib/data/elements.ts` — 118 element records with recipes and flavor.
- `src/lib/data/failures.ts` — failure lines.
- `src/lib/data/categories.ts` — labels and colors.
- `src/lib/game/engine.ts` — pure functions: `findRecipe(a, b)`, `forge(state, a, b)`, `canForge`, `reachableFrom`.
- `src/lib/game/storage.ts` — load/save/migrate.
- `src/lib/stores/game.ts` — Svelte writable store, pure actions, autosave.
- `src/lib/components/` — `ForgeStage.svelte`, `ElementCard.svelte`, `Slot.svelte`, `Tray.svelte`, `NotebookGrid.svelte`, `ElementPage.svelte`, `TableView.svelte`, `WinScreen.svelte`, `Settings.svelte`, `AppBar.svelte`.
- `src/lib/styles/` — tokens, paper texture, wobble utilities.
- `src/routes/` — one client-rendered game route with `ssr = false`.
- No state library, no drag library, no router; a tiny screen-state union is enough.
- Drag uses Pointer Events; tap is the primary path and must complete every action alone.
- A dev-only "unlock all" command (guarded by `import.meta.env.DEV`) exists solely to test the win screen.

## 11. Validation and testing

### Recipe validator (runs in tests and CI)

- Exactly 118 unique elements, atomic numbers 1–118.
- H has no recipe; every other element has exactly one pair.
- Pairs reference real symbols and are unordered-unique.
- Reachability closure from `{H}` yields 118.
- Flavor lines ≤ 100 characters and non-empty.
- Category values valid.

### Unit (Vitest)

- Recipe lookup is order-independent and supports identical parents.
- Initial state has Hydrogen discovered and progress `1 / 118`; the win predicate is false.
- Forging a valid pair adds the element exactly once.
- Re-forging an already-discovered pair increments attempts but adds no discovery and no scrap entry.
- Invalid pairs change no state except attempts and the deduplicated scrap log.
- Save/load round-trip includes the scrap log and completion fields; corrupt save recovery; migration path.

### Component (Testing Library for Svelte)

- Tap-to-fill, tap-twice for duplicate, clear slot, FORGE enabled only with two slots.
- Discovery opens the notebook page and updates progress.
- Invalid pair leaves both cards in their slots, shows a failure line, and adds to the scrap log.
- Re-forging a known pair shows the quiet toast and opens no page.
- Table hides undiscovered symbols and reveals them on discovery.
- Win screen appears at 118 and not before; "Keep looking" hides it and Settings can reopen it.

### End-to-end (Playwright, 390×844)

- First forge: H + H → He in under 30 seconds from a cold start.
- Reload preserves discovered elements.
- Offline after initial load still forges.
- Tray filter/search and table toggle work by tap only.
- Manifest and service worker present; installability check via Lighthouse.

### Performance budget

- Initial JS ≤ 250 KB gzip.
- No layout shift on discovery; 60 fps card animations on a mid-range phone.
- Table view with all 118 tiles remains responsive.

## 12. Success criteria

- A new player discovers helium without reading instructions.
- All 118 elements are reachable; the validator passes in CI.
- The table can be completed and the win screen triggers exactly at 118.
- The app installs, runs offline, and restores progress after a reload.
- No hint UI exists anywhere.
- Every action is possible by tap alone on a 360 px-wide screen.
- The game feels like a notebook, not a dashboard.

## 13. Left to the builder

- Final font pairing and licenses (must be OFL and self-hosted).
- Exact category palette and paper texture treatment.
- The 10 category doodle motifs and Mendeleev mascot art.
- The final 118 recipes and flavor lines (must satisfy the validator and tone rules).
- Mobile presentation details for the classic periodic layout.
- Whether to ship save export/import in v1 (recommended).
- Deployment host (static hosting; build output is plain files).
- Whether failure lines avoid immediate repeats via a shuffle bag (recommended).

## 14. Risks

- **Content volume:** 118 recipes and jokes is the largest task. Mitigation: data-first, validator, batch review, tone checklist.
- **Pure experimentation can stall:** the scrap log, sorting, filtering, and the real periodic structure reduce repeat work without adding hints. This is the accepted trade-off of the chosen discovery model.
- **Mobile table density:** the sticker grid is primary on phones; the classic table is a pannable secondary view.
- **Art scope:** category motifs, not 118 illustrations, keep the hand-made look achievable.
