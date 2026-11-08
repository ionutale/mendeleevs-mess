import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { initGame } from './game';
import { reducedMotion } from './motion';

beforeEach(() => {
	window.localStorage.clear();
});

describe('motion', () => {
	it('follows the reduce-motion setting', () => {
		initGame(5_000, { settings: { sound: true, reduceMotion: true } });
		expect(get(reducedMotion)).toBe(true);

		initGame(5_000, { settings: { sound: true, reduceMotion: false } });
		expect(get(reducedMotion)).toBe(false);
	});
});
