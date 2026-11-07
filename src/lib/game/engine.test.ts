import { describe, expect, it } from 'vitest';
import { gameState, tinyElements } from '../test/fixtures';
import { addScrapEntry, findRecipe, forge } from './engine';

const NOW = 5_000;

describe('findRecipe', () => {
	it('is order-independent and supports identical parents', () => {
		expect(findRecipe(tinyElements, 'H', 'H')?.symbol).toBe('He');
		expect(findRecipe(tinyElements, 'H', 'He')?.symbol).toBe('Li');
		expect(findRecipe(tinyElements, 'He', 'H')?.symbol).toBe('Li');
	});
});

describe('forge', () => {
	it('discovers a new element and records its timestamp', () => {
		const { state, outcome } = forge(gameState(), 'H', 'H', tinyElements, NOW);
		expect(outcome).toMatchObject({ kind: 'new', element: { symbol: 'He' } });
		expect(state.discovered).toEqual(['H', 'He']);
		expect(state.discoveredAt.He).toBe(NOW);
		expect(state.attempts).toBe(1);
		expect(state.scrapLog).toEqual([]);
	});

	it('treats a known pair as known without duplicating or scraping', () => {
		const start = gameState({
			discovered: ['H', 'He'],
			discoveredAt: { H: 1, He: 2 },
			attempts: 4
		});
		const { state, outcome } = forge(start, 'H', 'H', tinyElements, NOW);
		expect(outcome.kind).toBe('known');
		expect(state.discovered).toEqual(['H', 'He']);
		expect(state.attempts).toBe(5);
		expect(state.scrapLog).toEqual([]);
	});

	it('records invalid pairs, deduplicates, and ignores unknown symbols', () => {
		const start = gameState({
			discovered: ['H', 'He', 'Li'],
			discoveredAt: { H: 1, He: 2, Li: 3 }
		});
		const once = forge(start, 'He', 'He', tinyElements, NOW).state;
		expect(once.scrapLog).toEqual([{ pair: ['He', 'He'], at: NOW }]);

		const twice = forge(once, 'He', 'He', tinyElements, NOW + 1).state;
		expect(twice.scrapLog).toHaveLength(1);
		expect(twice.scrapLog[0].at).toBe(NOW + 1);
		expect(twice.discovered).toEqual(['H', 'He', 'Li']);

		const unknown = forge(gameState(), 'H', 'Xx', tinyElements, NOW).state;
		expect(unknown.scrapLog).toEqual([]);
	});

	it('completes once at the element-count boundary with a stats snapshot', () => {
		const start = gameState({
			discovered: ['H', 'He'],
			discoveredAt: { H: 1, He: 2 },
			attempts: 9
		});
		const { state } = forge(start, 'H', 'He', tinyElements, NOW);
		expect(state.discovered).toHaveLength(3);
		expect(state.completedAt).toBe(NOW);
		expect(state.completionStats).toEqual({
			attempts: 10,
			startedAt: 1_000,
			completedAt: NOW,
			elapsedMs: 4_000
		});

		const again = forge(state, 'H', 'H', tinyElements, NOW + 10).state;
		expect(again.completionStats).toEqual(state.completionStats);
		expect(again.completedAt).toBe(NOW);
	});
});

describe('addScrapEntry', () => {
	it('caps the log at 20 newest entries', () => {
		let log = [] as ReturnType<typeof addScrapEntry>;
		for (let index = 0; index < 25; index++) {
			log = addScrapEntry(log, ['H', `X${index}`], index);
		}
		expect(log).toHaveLength(20);
		expect(log[0]).toEqual({ pair: ['H', 'X24'], at: 24 });
	});
});
