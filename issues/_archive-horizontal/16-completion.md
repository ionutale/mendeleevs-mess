# Issue 16 — Completion, certificate, and reset

- **Status:** open
- **Labels:** `ui`, `mendeleevs-mess`
- **Depends on:** [Issue 15](15-first-run.md)
- **Plan:** [Task 16](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

> Local implementation issue. The plan task is the source of truth; this file is the ticket.

## Goal

118-element certificate, keep-looking sandbox, reset, and share.

## Work

**Files:**

- Create: `src/components/WinScreen.tsx`, `src/components/WinScreen.test.tsx`
- Modify: `src/App.tsx`, `src/components/SettingsScreen.tsx` (add certificate link)

**Interfaces:**

- Consumes: `useGame`, `GameState`
- Produces: certificate overlay, share text, keep-looking behavior, start-over, Settings reopen

- [ ] **Step 1: Write the failing tests**

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App';
import { GameProvider } from '../game/useGame';
import { gameState } from '../test/fixtures';
import { ELEMENTS } from '../data/elements';
import { SAVE_KEY } from '../game/storage';

const all = ELEMENTS.map((e) => e.symbol);

beforeEach(() => localStorage.clear());

function seedCompleted(seen = false) {
	const state = gameState({
		discovered: all,
		discoveredAt: Object.fromEntries(all.map((s, i) => [s, i])),
		attempts: 240,
		completedAt: 10_000,
		certificateSeen: seen,
		completionStats: { attempts: 240, startedAt: 1_000, completedAt: 10_000, elapsedMs: 9_000 }
	});
	localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 1, state }));
}

describe('completion', () => {
	it('shows the certificate once and hides it after Keep looking', async () => {
		seedCompleted();
		render(
			<GameProvider>
				<App />
			</GameProvider>
		);
		expect(screen.getByRole('dialog', { name: /certificate/i })).toBeInTheDocument();
		await userEvent.click(screen.getByRole('button', { name: /keep looking/i }));
		expect(screen.queryByRole('dialog', { name: /certificate/i })).not.toBeInTheDocument();
		await waitFor(() => {
			const saved = JSON.parse(localStorage.getItem(SAVE_KEY)!);
			expect(saved.state.certificateSeen).toBe(true);
		});
	});

	it('reopens from settings and keeps the stats snapshot', async () => {
		seedCompleted(true);
		render(
			<GameProvider>
				<App />
			</GameProvider>
		);
		await userEvent.click(screen.getByRole('button', { name: /settings/i }));
		await userEvent.click(screen.getByRole('button', { name: /view certificate/i }));
		expect(screen.getAllByText(/240/).length).toBeGreaterThan(0);
	});
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm vitest run src/components/WinScreen.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

- `WinScreen`: `role="dialog" aria-modal="true" aria-label="Certificate"`; "Certificate of Complete Chaos", `118 / 118`, attempts, elapsed time, start date, Mendeleev doodle placeholder, ink stamp.
- Buttons: **Keep looking** → `markCertificateSeen()`, close; **Start over** → two-step confirm → `resetGame()`; **Share** → clipboard text; fall back to `prompt()` if unavailable.
- `App`: shows the certificate when `state.completedAt && !state.certificateSeen`; works with the `showCertificate` local flag for Settings reopen.
- Settings: "View certificate" only when completed.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run src/components/WinScreen.test.tsx`
Expected: pass.

```bash
git add -A
git commit -m "feat: add completion certificate and reset flow"
```

## Definition of done

- [ ] Every step above is checked.
- [ ] The task's verification commands pass.
- [ ] Changes are committed with the message given in the plan.
- [ ] `Status` above is changed to `done`.
