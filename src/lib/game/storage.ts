import { ELEMENT_BY_SYMBOL } from '../data/elements';
import type { GameState, Screen } from '../types';

export const SAVE_KEY = 'mendeleevs-mess:save:v1';

function defaultStorage(): Storage {
	if (typeof window !== 'undefined') return window.localStorage;
	return globalThis.localStorage;
}

const SCREENS: readonly Screen[] = ['forge', 'notebook', 'table', 'settings'];

export function createInitialState(now: number): GameState {
	return {
		version: 1,
		discovered: ['H'],
		discoveredAt: { H: now },
		attempts: 0,
		scrapLog: [],
		startedAt: now,
		introSeen: false,
		completedAt: null,
		certificateSeen: false,
		completionStats: null,
		settings: { sound: true, reduceMotion: false },
		lastScreen: 'forge'
	};
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseState(raw: string): GameState | null {
	let parsed: unknown;

	try {
		parsed = JSON.parse(raw);
	} catch {
		return null;
	}

	if (!isRecord(parsed) || parsed.version !== 1 || !isRecord(parsed.state)) return null;

	const state = parsed.state;
	if (state.version !== 1) return null;
	if (!Array.isArray(state.discovered) || !state.discovered.includes('H')) return null;

	const discovered = state.discovered;
	if (!discovered.every((symbol) => typeof symbol === 'string' && ELEMENT_BY_SYMBOL.has(symbol))) {
		return null;
	}
	if (new Set(discovered).size !== discovered.length) return null;

	if (!isRecord(state.discoveredAt) || typeof state.discoveredAt.H !== 'number') return null;
	for (const symbol of discovered) {
		if (typeof state.discoveredAt[symbol] !== 'number') return null;
	}

	if (typeof state.attempts !== 'number' || !Array.isArray(state.scrapLog)) return null;
	for (const entry of state.scrapLog) {
		if (!isRecord(entry) || !Array.isArray(entry.pair) || entry.pair.length !== 2) return null;
		if (
			!entry.pair.every((symbol) => typeof symbol === 'string' && ELEMENT_BY_SYMBOL.has(symbol))
		) {
			return null;
		}
		if (typeof entry.at !== 'number') return null;
	}

	if (typeof state.startedAt !== 'number' || typeof state.introSeen !== 'boolean') return null;
	if (state.completedAt !== null && typeof state.completedAt !== 'number') return null;
	if (typeof state.certificateSeen !== 'boolean') return null;
	if (state.completedAt !== null && discovered.length !== ELEMENT_BY_SYMBOL.size) {
		return null;
	}
	if (state.completionStats !== null) {
		if (!isRecord(state.completionStats)) return null;
		if (
			typeof state.completionStats.attempts !== 'number' ||
			typeof state.completionStats.startedAt !== 'number' ||
			typeof state.completionStats.completedAt !== 'number' ||
			typeof state.completionStats.elapsedMs !== 'number'
		) {
			return null;
		}
	}
	if (state.completedAt !== null && state.completionStats === null) return null;
	if (state.certificateSeen && state.completedAt === null) return null;
	if (!isRecord(state.settings)) return null;
	if (
		typeof state.settings.sound !== 'boolean' ||
		typeof state.settings.reduceMotion !== 'boolean'
	) {
		return null;
	}
	if (typeof state.lastScreen !== 'string' || !SCREENS.includes(state.lastScreen as Screen)) {
		return null;
	}

	return state as unknown as GameState;
}

export function loadState(
	now: number,
	storage: Storage = defaultStorage()
): { state: GameState; recovered: boolean } {
	let raw: string | null;

	try {
		raw = storage.getItem(SAVE_KEY);
	} catch {
		return { state: createInitialState(now), recovered: true };
	}

	if (!raw) return { state: createInitialState(now), recovered: false };

	const parsed = parseState(raw);
	if (!parsed) return { state: createInitialState(now), recovered: true };

	return { state: parsed, recovered: false };
}

export function saveGame(state: GameState, storage: Storage = defaultStorage()): boolean {
	try {
		storage.setItem(SAVE_KEY, JSON.stringify({ version: 1, state }));
		return true;
	} catch {
		return false;
	}
}

export function clearState(storage: Storage = defaultStorage()): void {
	try {
		storage.removeItem(SAVE_KEY);
	} catch {
		// Nothing to clear.
	}
}
