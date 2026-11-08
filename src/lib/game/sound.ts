export type SoundKind = 'pick' | 'forge' | 'stamp' | 'fail';

type ContextFactory = () => AudioContext | null;

const CUES: Record<
	SoundKind,
	{ type: OscillatorType; frequency: number; duration: number; gain: number }
> = {
	pick: { type: 'sine', frequency: 220, duration: 0.05, gain: 0.04 },
	forge: { type: 'triangle', frequency: 330, duration: 0.18, gain: 0.05 },
	stamp: { type: 'square', frequency: 110, duration: 0.09, gain: 0.04 },
	fail: { type: 'sawtooth', frequency: 160, duration: 0.12, gain: 0.03 }
};

let sharedContext: AudioContext | null = null;

function defaultFactory(): AudioContext | null {
	if (typeof window === 'undefined' || !('AudioContext' in window)) return null;
	sharedContext ??= new AudioContext();
	return sharedContext;
}

export function createSoundPlayer(factory: ContextFactory = defaultFactory) {
	return (kind: SoundKind, enabled: boolean): void => {
		if (!enabled) return;

		try {
			const context = factory();
			if (!context) return;
			if (context.state === 'suspended') void context.resume();

			const cue = CUES[kind];
			const oscillator = context.createOscillator();
			const gain = context.createGain();
			const now = context.currentTime;

			oscillator.type = cue.type;
			oscillator.frequency.setValueAtTime(cue.frequency, now);
			gain.gain.setValueAtTime(cue.gain, now);
			gain.gain.exponentialRampToValueAtTime(0.0001, now + cue.duration);

			oscillator.connect(gain);
			gain.connect(context.destination);
			oscillator.start(now);
			oscillator.stop(now + cue.duration);
		} catch {
			// Audio is a courtesy; never break the game for it.
		}
	};
}

export const playSound = createSoundPlayer();
