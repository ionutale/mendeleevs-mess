# Issue 01 — Scaffold, test harness, and shell

- **Status:** open
- **Labels:** `setup`, `mendeleevs-mess`
- **Depends on:** —
- **Plan:** [Task 1](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

> Local implementation issue. The plan task is the source of truth; this file is the ticket.

## Goal

Vite + React + TypeScript app runs with Vitest, Playwright, fonts, and a smoke test.

## Work

**Files:**

- Create: `package.json`, `vite.config.ts`, `playwright.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/App.test.tsx`, `src/test/setup.ts`, `src/styles/base.css`, `.gitignore`
- Keep: existing `docs/` folder

**Interfaces:**

- Consumes: nothing
- Produces: a running Vite app and `pnpm test`, `pnpm typecheck`, `pnpm e2e` commands

- [ ] **Step 1: Initialize the repo and scaffold**

```bash
cd /Users/ionutale/developer-playground/mendeleevs-mess
git init
pnpm create vite . --template react-ts   # choose "Ignore files and continue"
pnpm install
pnpm add @fontsource-variable/caveat @fontsource-variable/nunito
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @playwright/test
pnpm exec playwright install chromium
```

- [ ] **Step 2: Add scripts and test config**

`package.json` scripts:

```json
{
	"dev": "vite",
	"build": "tsc -b && vite build",
	"preview": "vite preview",
	"test": "vitest run",
	"test:watch": "vitest",
	"typecheck": "tsc -b",
	"e2e": "playwright test",
	"validate": "vite-node scripts/validate-content.ts"
}
```

`vite.config.ts`:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		setupFiles: './src/test/setup.ts',
		css: true
	}
});
```

`src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

`playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	use: {
		baseURL: 'http://127.0.0.1:4173',
		viewport: { width: 390, height: 844 },
		isMobile: true,
		hasTouch: true
	},
	webServer: {
		command: 'pnpm build && pnpm preview --host 127.0.0.1 --port 4173',
		url: 'http://127.0.0.1:4173',
		reuseExistingServer: !process.env.CI
	}
});
```

- [ ] **Step 3: Write the failing smoke test**

`src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
	it('renders the game title', () => {
		render(<App />);
		expect(screen.getByRole('heading', { name: /mendeleev's mess/i })).toBeInTheDocument();
	});
});
```

- [ ] **Step 4: Run it and confirm it fails**

Run: `pnpm test`
Expected: FAIL — the template `App` has no such heading.

- [ ] **Step 5: Implement the minimal shell**

`src/App.tsx`:

```tsx
export default function App() {
	return (
		<main className="app">
			<h1>Mendeleev's Mess</h1>
		</main>
	);
}
```

`src/styles/base.css`: paper background `#FBF6E8`, ink `#2B2B2B`, `font-family: 'Nunito Variable', system-ui, sans-serif`; headings use `'Caveat Variable', cursive`. Import both Fontsource packages in `src/main.tsx`:

```ts
import '@fontsource-variable/caveat';
import '@fontsource-variable/nunito';
```

- [ ] **Step 6: Verify and commit**

Run: `pnpm test && pnpm typecheck`
Expected: both pass.

```bash
git add -A
git commit -m "chore: scaffold Vite React app with test harness"
```

## Definition of done

- [ ] Every step above is checked.
- [ ] The task's verification commands pass.
- [ ] Changes are committed with the message given in the plan.
- [ ] `Status` above is changed to `done`.
