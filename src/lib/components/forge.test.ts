import { fireEvent, render, screen } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App.svelte';
import { ELEMENTS } from '../data/elements';
import { normalizePair } from '../game/engine';
import { game, initGame } from '../stores/game';

beforeEach(() => {
	window.localStorage.clear();
	initGame(5_000);
});

describe('walking skeleton', () => {
	it('shows hydrogen and the full progress counter', () => {
		render(App);
		expect(screen.getByRole('heading', { name: /mendeleev's mess/i })).toBeInTheDocument();
		expect(screen.getByText('1 / 118')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /hydrogen/i })).toBeInTheDocument();
	});

	it('forges helium by tapping hydrogen twice and pressing forge', async () => {
		render(App);

		const hydrogen = screen.getByRole('button', { name: /hydrogen/i });
		await fireEvent.click(hydrogen);
		await fireEvent.click(hydrogen);
		await fireEvent.click(screen.getByRole('button', { name: /^forge$/i }));

		expect(await screen.findByRole('dialog', { name: /helium/i })).toBeInTheDocument();
		expect(screen.getByText('2 / 118')).toBeInTheDocument();
	});

	it('keeps both cards after an invalid pair and shows a deadpan line', async () => {
		const discovered = ELEMENTS.slice(0, 20).map((element) => element.symbol);
		const valid = new Set(
			ELEMENTS.filter((element) => element.recipe).map((element) =>
				normalizePair(element.recipe![0], element.recipe![1]).join('+')
			)
		);
		const [a, b] = discovered
			.flatMap((left, index) =>
				discovered.slice(index).map((right) => [left, right] as [string, string])
			)
			.find(([left, right]) => !valid.has(normalizePair(left, right).join('+')))!;

		initGame(5_000, {
			discovered,
			discoveredAt: Object.fromEntries(discovered.map((symbol, index) => [symbol, index + 1]))
		});
		render(App);

		const byName = (symbol: string) =>
			new RegExp(ELEMENTS.find((element) => element.symbol === symbol)!.name, 'i');

		await fireEvent.click(screen.getByRole('button', { name: byName(a) }));
		await fireEvent.click(screen.getByRole('button', { name: byName(b) }));
		await fireEvent.click(screen.getByRole('button', { name: /^forge$/i }));

		expect(await screen.findByRole('status')).toHaveTextContent(/.+/);
		expect(screen.getByRole('button', { name: /clear slot 1/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /clear slot 2/i })).toBeInTheDocument();
		expect(get(game).discovered).toEqual(discovered);
	});

	it('does not double-forge on a rapid double press', async () => {
		render(App);

		const hydrogen = screen.getByRole('button', { name: /hydrogen/i });
		await fireEvent.click(hydrogen);
		await fireEvent.click(hydrogen);

		const forge = screen.getByRole('button', { name: /^forge$/i });
		await fireEvent.click(forge);
		await fireEvent.click(forge);

		expect(get(game).attempts).toBe(1);
	});
});
