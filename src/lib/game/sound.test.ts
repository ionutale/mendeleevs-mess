import { describe, expect, it, vi } from 'vitest';
import { createSoundPlayer } from '../game/sound';

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

	it('plays every cue when enabled without throwing', () => {
		const context = fakeContext();
		const play = createSoundPlayer(() => context);
		for (const kind of ['pick', 'forge', 'stamp', 'fail'] as const) {
			expect(() => play(kind, true)).not.toThrow();
		}
	});
});
