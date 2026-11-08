import { get, writable } from 'svelte/store';
import { ELEMENTS } from '../data/elements';
import { forge, type ForgeOutcome } from '../game/engine';
import {
	clearState,
	createInitialState,
	loadState,
	parseState,
	saveGame,
	SAVE_KEY
} from '../game/storage';
import type { GameSettings, GameState, Screen } from '../types';

export { SAVE_KEY };

export const game = writable<GameState>(createInitialState(0));
export const recovered = writable(false);

let ready = false;

game.subscribe((state) => {
	if (ready) saveGame(state);
});

export function initGame(now = Date.now(), overrides: Partial<GameState> = {}): void {
	const loaded = loadState(now);
	const state = { ...loaded.state, ...overrides, settings: { ...loaded.state.settings, ...overrides.settings } };
	ready = true;
	game.set(state);
	recovered.set(loaded.recovered);
	saveGame(state);
}

export function forgePair(a: string, b: string): ForgeOutcome {
	const { state, outcome } = forge(get(game), a, b, ELEMENTS, Date.now());
	game.set(state);
	return outcome;
}

export function setScreen(screen: Screen): void {
	game.update((state) => ({ ...state, lastScreen: screen }));
}

export function dismissIntro(): void {
	game.update((state) => ({ ...state, introSeen: true }));
}

export function updateSettings(patch: Partial<GameSettings>): void {
	game.update((state) => ({ ...state, settings: { ...state.settings, ...patch } }));
}

export function markCertificateSeen(): void {
	game.update((state) => ({ ...state, certificateSeen: true }));
}

export function resetGame(): void {
	clearState();
	const state = createInitialState(Date.now());
	game.set(state);
	saveGame(state);
}

export function exportSave(): string {
	return JSON.stringify({ version: 1, state: get(game) });
}

export function importSave(raw: string): boolean {
	const parsed = parseState(raw);
	if (!parsed) return false;
	game.set(parsed);
	recovered.set(false);
	saveGame(parsed);
	return true;
}
