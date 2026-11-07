# Issue 14 — Sound and reduced motion

- **Status:** open
- **Labels:** `ui`, `mendeleevs-mess`
- **Depends on:** [Issue 13](13-table.md)
- **Plan:** [Task 14](../docs/superpowers/plans/2026-11-07-mendeleevs-mess.md)
- **Spec:** [Design doc](../docs/superpowers/specs/2026-11-07-mendeleevs-mess-design.md)

> Local implementation issue. The plan task is the source of truth; this file is the ticket.

## Goal

Procedural WebAudio cues and reduced-motion support.

## Work

**Files:**

- Create: `src/game/sound.ts`, `src/game/sound.test.ts`, `src/game/useReducedMotion.ts`, `src/game/useReducedMotion.test.ts`
- Modify: `src/styles/app.css` (motion classes), `src/components/ForgeScreen.tsx` (calls)

**Interfaces:**

- Consumes: `GameSettings`
- Produces:
  - `type SoundKind = 'pick' | 'forge' | 'stamp' | 'fail' | 'win'`
  - `createSoundPlayer(contextFactory?: () => AudioContext | null): (kind: SoundKind, enabled: boolean) => void`
  - `useReducedMotion(): boolean` (settings OR OS preference)

- [ ] **Step 1: Write the failing tests**

`src/game/sound.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { createSoundPlayer } from './sound';

function fakeContext() {
	const oscillator = {
		connect: vi.fn(),
		start: vi.fn(),
		stop: vi.fn(),
		frequency: { setValueAtTime: vi.fn() },
		type: 'sine'
	};
	const gain = {
		connect: vi.fn(),
		gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }
	};
	return {
		createOscillator: () => oscillator,
		createGain: () => gain,
		currentTime: 0,
		destination: {},
		state: 'running',
		resume: vi.fn()
	} as unknown as AudioContext;
}

describe('sound', () => {
	it('does nothing when disabled', () => {
		const factory = vi.fn();
		const play = createSoundPlayer(factory);
		play('stamp', false);
		expect(factory).not.toHaveBeenCalled();
	});

	it('plays a cue when enabled', () => {
		const ctx = fakeContext();
		const play = createSoundPlayer(() => ctx);
		expect(() => play('stamp', true)).not.toThrow();
	});
});
```

`src/game/useReducedMotion.test.ts`: mock `window.matchMedia` and a settings override; assert `true` when either says reduce.

- [ ] **Step 2: Run and confirm failure**

Run: `pnpm vitest run src/game/sound.test.ts src/game/useReducedMotion.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

- `createSoundPlayer`: lazy singleton `AudioContext`; each cue is a short oscillator + gain envelope (pick 220 Hz, forge 330→440, stamp 110, fail 160→120, win arpeggio 440/554/659). Guard `typeof window` and `AudioContext`. Never throw.
- `useReducedMotion`: `state.settings.reduceMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches`; subscribe to changes.
- ForgeScreen: `play('pick')` on slot fill, `play('forge')` on valid press, `play('stamp')` on discovery, `play('fail')` on invalid.
- CSS: when reduced, set `animation-duration: 0.01ms`, `transition-duration: 0.01ms`, and disable the card flight/stamp transforms.

- [ ] **Step 4: Verify and commit**

Run: `pnpm vitest run src/game/sound.test.ts src/game/useReducedMotion.test.ts`
Expected: pass.

```bash
git add -A
git commit -m "feat: add procedural sound cues and reduced-motion support"
```

## Definition of done

- [ ] Every step above is checked.
- [ ] The task's verification commands pass.
- [ ] Changes are committed with the message given in the plan.
- [ ] `Status` above is changed to `done`.
