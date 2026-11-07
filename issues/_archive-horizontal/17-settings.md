# Issue 17 — Full settings screen

- **Status:** open
- **Labels:** `ui`, `mendeleevs-mess`
- **Depends on:** [Issue 16](16-completion.md)
- **Plan:** [Task 17](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

> Local implementation issue. The plan task is the source of truth; this file is the ticket.

## Goal

Settings: sound/motion, install, save transfer, reset, and certificate access.

## Work

**Files:**

- Create: `src/components/SettingsScreen.tsx`, `src/components/SettingsScreen.test.tsx`
- Modify: `src/App.tsx` (use the real settings screen)

**Interfaces:**

- Consumes: `useGame`
- Produces: sound/motion toggles, install guidance, save export/import, reset confirmation, certificate link, version

- [ ] **Step 1: Write the failing tests**

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { GameProvider } from '../game/useGame';
import { SettingsScreen } from './SettingsScreen';
import { gameState } from '../test/fixtures';
import { SAVE_KEY } from '../game/storage';

beforeEach(() => localStorage.clear());
function seed(overrides = {}) {
	localStorage.setItem(
		SAVE_KEY,
		JSON.stringify({ version: 1, state: gameState({ introSeen: true, ...overrides }) })
	);
}

describe('SettingsScreen', () => {
	it('persists the sound and motion toggles', async () => {
		seed();
		render(
			<GameProvider>
				<SettingsScreen />
			</GameProvider>
		);
		await userEvent.click(screen.getByRole('checkbox', { name: /sound/i }));
		await userEvent.click(screen.getByRole('checkbox', { name: /reduce motion/i }));
		await waitFor(() => {
			const saved = JSON.parse(localStorage.getItem(SAVE_KEY)!);
			expect(saved.state.settings).toEqual({ sound: false, reduceMotion: true });
		});
	});

	it('requires two steps to reset', async () => {
		seed({ discovered: ['H', 'He'], discoveredAt: { H: 1, He: 2 } });
		render(
			<GameProvider>
				<SettingsScreen />
			</GameProvider>
		);
		await userEvent.click(screen.getByRole('button', { name: /reset progress/i }));
		expect(screen.getByRole('button', { name: /yes, erase it/i })).toBeInTheDocument();
		await userEvent.click(screen.getByRole('button', { name: /yes, erase it/i }));
		await waitFor(() => {
			const saved = JSON.parse(localStorage.getItem(SAVE_KEY)!);
			expect(saved.state.discovered).toEqual(['H']);
		});
	});

	it('imports a valid save and rejects garbage', async () => {
		seed();
		render(
			<GameProvider>
				<SettingsScreen />
			</GameProvider>
		);
		const input = screen.getByLabelText(/import save/i);
		const file = new File(
			[
				JSON.stringify({
					version: 1,
					state: gameState({ discovered: ['H', 'He'], discoveredAt: { H: 1, He: 2 } })
				})
			],
			'save.json',
			{ type: 'application/json' }
		);
		await userEvent.upload(input, file);
		expect(await screen.findByRole('status')).toHaveTextContent(/imported/i);
	});
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm vitest run src/components/SettingsScreen.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

- Toggles bound to `state.settings`.
- Install section: listen for `beforeinstallprompt`; show "Install app" when available; otherwise show iOS "Share → Add to Home Screen" instructions.
- Export: "Export save" triggers a JSON download via Blob + object URL, filename `mendeleevs-mess-save.json`.
- Import: file input labelled "Import save"; parse + `importSave`; success/failure status line.
- Reset: two-step inline confirmation; cancels on blur/second click elsewhere.
- About: version from `package.json` (or a constant), credits, link to the design doc? Keep it player-facing: "Made with too much hydrogen."

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run src/components/SettingsScreen.test.tsx`
Expected: pass.

```bash
git add -A
git commit -m "feat: add settings, install guidance, and save transfer"
```

## Definition of done

- [ ] Every step above is checked.
- [ ] The task's verification commands pass.
- [ ] Changes are committed with the message given in the plan.
- [ ] `Status` above is changed to `done`.
