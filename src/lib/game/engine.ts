import type { ElementRecord, GameState, ScrapEntry } from '../types';

export type ForgeOutcome =
	| { kind: 'new'; element: ElementRecord }
	| { kind: 'known'; element: ElementRecord }
	| { kind: 'invalid' };

export function normalizePair(a: string, b: string): [string, string] {
	return a <= b ? [a, b] : [b, a];
}

export function findRecipe(
	elements: readonly ElementRecord[],
	a: string,
	b: string
): ElementRecord | null {
	const known = new Set(elements.map((element) => element.symbol));
	if (!known.has(a) || !known.has(b)) return null;

	const [left, right] = normalizePair(a, b);
	return (
		elements.find((element) => {
			if (!element.recipe) return false;
			const [parentA, parentB] = normalizePair(element.recipe[0], element.recipe[1]);
			return parentA === left && parentB === right;
		}) ?? null
	);
}

export function addScrapEntry(
	log: readonly ScrapEntry[],
	pair: [string, string],
	at: number
): ScrapEntry[] {
	const normalized = normalizePair(pair[0], pair[1]);
	const withoutDuplicate = log.filter((entry) => {
		const [left, right] = normalizePair(entry.pair[0], entry.pair[1]);
		return left !== normalized[0] || right !== normalized[1];
	});

	return [{ pair: normalized, at }, ...withoutDuplicate].slice(0, 20);
}

export function forge(
	state: GameState,
	a: string,
	b: string,
	elements: readonly ElementRecord[],
	now: number
): { state: GameState; outcome: ForgeOutcome } {
	const attempts = state.attempts + 1;
	const recipe = findRecipe(elements, a, b);

	if (!recipe) {
		const known = new Set(elements.map((element) => element.symbol));
		const scrapLog =
			known.has(a) && known.has(b) ? addScrapEntry(state.scrapLog, [a, b], now) : state.scrapLog;
		return {
			state: { ...state, attempts, scrapLog },
			outcome: { kind: 'invalid' }
		};
	}

	if (state.discovered.includes(recipe.symbol)) {
		return {
			state: { ...state, attempts },
			outcome: { kind: 'known', element: recipe }
		};
	}

	const discovered = [...state.discovered, recipe.symbol];
	const discoveredAt = { ...state.discoveredAt, [recipe.symbol]: now };
	const complete = discovered.length === elements.length;

	if (!complete || state.completedAt !== null) {
		return {
			state: { ...state, attempts, discovered, discoveredAt },
			outcome: { kind: 'new', element: recipe }
		};
	}

	const completedAt = now;
	return {
		state: {
			...state,
			attempts,
			discovered,
			discoveredAt,
			completedAt,
			certificateSeen: false,
			completionStats: {
				attempts,
				startedAt: state.startedAt,
				completedAt,
				elapsedMs: now - state.startedAt
			}
		},
		outcome: { kind: 'new', element: recipe }
	};
}
