import { fireEvent, render, screen } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App.svelte';
import { game, initGame } from '../stores/game';

beforeEach(() => {
	window.localStorage.clear();
	initGame(5_000);
});

describe('walking skeleton', () => {
	it('shows hydrogen and the temporary two-element progress', () => {
		render(App);
		expect(screen.getByRole('heading', { name: /mendeleev's mess/i })).toBeInTheDocument();
		expect(screen.getByText('1 / 2')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /hydrogen/i })).toBeInTheDocument();
	});

	it('forges helium by tapping hydrogen twice and pressing forge', async () => {
		render(App);

		const hydrogen = screen.getByRole('button', { name: /hydrogen/i });
		await fireEvent.click(hydrogen);
		await fireEvent.click(hydrogen);
		await fireEvent.click(screen.getByRole('button', { name: /^forge$/i }));

		expect(await screen.findByRole('dialog', { name: /helium/i })).toBeInTheDocument();
		expect(screen.getByText('2 / 2')).toBeInTheDocument();
	});

	it('keeps both cards after an invalid pair and shows a deadpan line', async () => {
		initGame(5_000, {
			discovered: ['H', 'He'],
			discoveredAt: { H: 1, He: 2 }
		});
		render(App);

		await fireEvent.click(screen.getByRole('button', { name: /hydrogen/i }));
		await fireEvent.click(screen.getByRole('button', { name: /helium/i }));
		await fireEvent.click(screen.getByRole('button', { name: /^forge$/i }));

		expect(await screen.findByRole('status')).toHaveTextContent(/.+/);
		expect(screen.getByRole('button', { name: /clear slot 1/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /clear slot 2/i })).toBeInTheDocument();
		expect(get(game).discovered).toEqual(['H', 'He']);
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
