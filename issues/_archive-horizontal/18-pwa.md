# Issue 18 — PWA, icons, and offline

- **Status:** open
- **Labels:** `pwa`, `mendeleevs-mess`
- **Depends on:** [Issue 17](17-settings.md)
- **Plan:** [Task 18](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

> Local implementation issue. The plan task is the source of truth; this file is the ticket.

## Goal

Installable PWA with generated icons, update prompt, and offline caching.

## Work

**Files:**

- Create: `public/favicon.svg`, `src/components/PwaUpdatePrompt.tsx`, `e2e/pwa.spec.ts`
- Modify: `vite.config.ts`, `src/main.tsx`, `src/vite-env.d.ts`, `src/App.tsx`

**Interfaces:**

- Consumes: the built app
- Produces: installable manifest, generated icons, prompt-based service worker updates, offline play

- [ ] **Step 1: Add dependencies**

```bash
pnpm add -D vite-plugin-pwa @vite-pwa/assets-generator
```

- [ ] **Step 2: Write the failing PWA e2e test**

`e2e/pwa.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('is installable and offline-capable', async ({ page, context }) => {
	await page.goto('/');
	const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href');
	expect(manifestHref).toBeTruthy();
	const manifest = await (
		await page.request.get(new URL(manifestHref!, page.url()).toString())
	).json();
	const sizes = manifest.icons.map((i: { sizes: string }) => i.sizes);
	expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']));

	await page.evaluate(() => navigator.serviceWorker.ready);
	await page.reload();
	await context.setOffline(true);
	await page.reload();
	await expect(page.getByRole('heading', { name: /mendeleev's mess/i })).toBeVisible();
	await context.setOffline(false);
});
```

- [ ] **Step 3: Run and confirm failure**

Run: `pnpm e2e e2e/pwa.spec.ts`
Expected: FAIL — no manifest.

- [ ] **Step 4: Configure the PWA**

`vite.config.ts`:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'prompt',
			includeAssets: ['favicon.svg'],
			manifest: {
				name: "Mendeleev's Mess",
				short_name: 'Mendeleev',
				description: 'Forge the periodic table from a single hydrogen atom.',
				theme_color: '#FBF6E8',
				background_color: '#FBF6E8',
				display: 'standalone',
				orientation: 'portrait',
				start_url: '/',
				scope: '/'
			},
			pwaAssets: {
				preset: 'minimal-2023',
				image: 'public/favicon.svg',
				overrideManifestIcons: true
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}']
			}
		})
	],
	test: { environment: 'jsdom', setupFiles: './src/test/setup.ts', css: true }
});
```

`src/vite-env.d.ts`: add `/// <reference types="vite-plugin-pwa/react" />`.

`PwaUpdatePrompt`:

```tsx
import { useRegisterSW } from 'virtual:pwa-register/react';

export function PwaUpdatePrompt() {
	const {
		needRefresh: [needRefresh, setNeedRefresh],
		updateServiceWorker
	} = useRegisterSW();
	if (!needRefresh) return null;
	return (
		<div role="status">
			A new mess is ready.
			<button onClick={() => updateServiceWorker(true)}>Refresh</button>
			<button onClick={() => setNeedRefresh(false)}>Later</button>
		</div>
	);
}
```

Render it in `App`. Create `public/favicon.svg`: a cream square with a hand-drawn `Mm` and a single electron orbit; 512×512 viewBox.

- [ ] **Step 5: Verify**

Run: `pnpm build && pnpm e2e e2e/pwa.spec.ts`
Expected: build generates icons and `manifest.webmanifest`; the test passes online and offline.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add installable PWA with offline cache and update prompt"
```

## Definition of done

- [ ] Every step above is checked.
- [ ] The task's verification commands pass.
- [ ] Changes are committed with the message given in the plan.
- [ ] `Status` above is changed to `done`.
