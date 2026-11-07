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
