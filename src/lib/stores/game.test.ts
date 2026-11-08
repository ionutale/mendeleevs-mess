import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { gameState } from '../test/fixtures';
import {
	forgePair,
	game,
	importSave,
	initGame,
	recovered,
	resetGame,
	SAVE_KEY,
	setScreen,
	updateSettings
} from './game';

beforeEach(() => {
	window.localStorage.clear();
	initGame(5_000);
});

describe('game store', () => {
	it('discovers helium and persists it', () => {
		const outcome = forgePair('H', 'H');
		expect(outcome.kind).toBe('new');
		expect(get(game).discovered).toContain('He');
		expect(JSON.parse(window.localStorage.getItem(SAVE_KEY)!).state.discovered).toContain('He');
	});

	it('reports a recovered corrupt save', () => {
		window.localStorage.setItem(SAVE_KEY, '{oops');
		initGame(5_000);
		expect(get(recovered)).toBe(true);
		expect(get(game).discovered).toEqual(['H']);
	});

	it('imports a valid save and rejects garbage', () => {
		expect(importSave('{bad')).toBe(false);

		const imported = gameState({
			discovered: ['H', 'He'],
			discoveredAt: { H: 1, He: 2 }
		});
		expect(importSave(JSON.stringify({ version: 1, state: imported }))).toBe(true);
		expect(get(game).discovered).toEqual(['H', 'He']);
	});

	it('persists screen and settings changes', () => {
		setScreen('table');
		updateSettings({ sound: false });
		const saved = JSON.parse(window.localStorage.getItem(SAVE_KEY)!).state;
		expect(saved.lastScreen).toBe('table');
		expect(saved.settings.sound).toBe(false);
	});

	it('resets to hydrogen', () => {
		forgePair('H', 'H');
		resetGame();
		expect(get(game).discovered).toEqual(['H']);
		expect(get(game).attempts).toBe(0);
	});
});
