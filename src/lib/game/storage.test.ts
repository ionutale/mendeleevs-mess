import { describe, expect, it } from 'vitest';
import { createInitialState, loadState, parseState, saveGame, SAVE_KEY } from './storage';

function memoryStorage(): Storage {
	const map = new Map<string, string>();
	return {
		get length() {
			return map.size;
		},
		clear: () => map.clear(),
		getItem: (key) => map.get(key) ?? null,
		key: (index) => [...map.keys()][index] ?? null,
		removeItem: (key) => void map.delete(key),
		setItem: (key, value) => void map.set(key, value)
	};
}

describe('storage', () => {
	it('starts with hydrogen discovered and nothing else', () => {
		const state = createInitialState(1_000);
		expect(state.discovered).toEqual(['H']);
		expect(state.discoveredAt.H).toBe(1_000);
		expect(state.attempts).toBe(0);
		expect(state.completedAt).toBeNull();
		expect(state.settings.sound).toBe(true);
	});

	it('round-trips a save', () => {
		const storage = memoryStorage();
		const state = {
			...createInitialState(1_000),
			discovered: ['H', 'He'],
			discoveredAt: { H: 1_000, He: 2_000 },
			attempts: 3
		};
		expect(saveGame(state, storage)).toBe(true);
		expect(loadState(2_000, storage)).toEqual({ state, recovered: false });
	});

	it('recovers from corrupt JSON', () => {
		const storage = memoryStorage();
		storage.setItem(SAVE_KEY, '{not json');
		const result = loadState(2_000, storage);
		expect(result.recovered).toBe(true);
		expect(result.state.discovered).toEqual(['H']);
	});

	it('recovers from a wrong version or missing hydrogen', () => {
		const storage = memoryStorage();
		storage.setItem(SAVE_KEY, JSON.stringify({ version: 99, state: createInitialState(1) }));
		expect(loadState(2_000, storage).recovered).toBe(true);

		const bad = { ...createInitialState(1), discovered: ['He'] };
		storage.setItem(SAVE_KEY, JSON.stringify({ version: 1, state: bad }));
		expect(loadState(2_000, storage).recovered).toBe(true);
	});

	it('reports a failed write instead of throwing', () => {
		const storage = memoryStorage();
		storage.setItem = () => {
			throw new Error('quota');
		};
		expect(saveGame(createInitialState(1), storage)).toBe(false);
	});

	it('rejects malformed nested save data', () => {
		const storage = memoryStorage();
		const base = createInitialState(1);

		storage.setItem(SAVE_KEY, JSON.stringify({ version: 1, state: { ...base, scrapLog: [{}] } }));
		expect(loadState(2_000, storage).recovered).toBe(true);

		storage.setItem(
			SAVE_KEY,
			JSON.stringify({ version: 1, state: { ...base, discovered: ['H', 'H'] } })
		);
		expect(loadState(2_000, storage).recovered).toBe(true);

		storage.setItem(
			SAVE_KEY,
			JSON.stringify({
				version: 1,
				state: { ...base, discovered: ['H', 'Xx'], discoveredAt: { H: 1, Xx: 2 } }
			})
		);
		expect(loadState(2_000, storage).recovered).toBe(true);

		storage.setItem(
			SAVE_KEY,
			JSON.stringify({
				version: 1,
				state: {
					...base,
					completedAt: 2,
					completionStats: { attempts: 1, startedAt: 1, completedAt: 2, elapsedMs: 1 }
				}
			})
		);
		expect(loadState(2_000, storage).recovered).toBe(true);
	});

	it('rejects malformed state', () => {
		expect(parseState('{bad')).toBeNull();
		expect(parseState(JSON.stringify({ version: 1, state: { discovered: ['H'] } }))).toBeNull();
	});
});
