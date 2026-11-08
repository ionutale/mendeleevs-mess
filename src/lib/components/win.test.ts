import { fireEvent, render, screen } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App.svelte';
import { ELEMENTS } from '../data/elements';
import { game, initGame } from '../stores/game';

const allSymbols = ELEMENTS.map((element) => element.symbol);
const stats = {
	attempts: 240,
	startedAt: 1_000,
	completedAt: 9_000,
	elapsedMs: 8_000
};

function seedCompleted(seen = false) {
	initGame(5_000, {
		discovered: allSymbols,
		discoveredAt: Object.fromEntries(allSymbols.map((symbol, index) => [symbol, index + 1])),
		attempts: 240,
		completedAt: 9_000,
		certificateSeen: seen,
		completionStats: stats
	});
}

beforeEach(() => {
	window.localStorage.clear();
});

describe('completion', () => {
	it('shows the certificate at 118 and freezes the stats', async () => {
		seedCompleted();
		render(App);

		const dialog = await screen.findByRole('dialog', { name: /certificate/i });
		expect(dialog).toHaveTextContent(/118 \/ 118/);
		expect(dialog).toHaveTextContent('240');
		expect(dialog).toHaveTextContent(/complete chaos/i);
	});

	it('hides on keep looking and remembers the choice', async () => {
		seedCompleted();
		render(App);

		await screen.findByRole('dialog', { name: /certificate/i });
		await fireEvent.click(screen.getByRole('button', { name: /keep looking/i }));

		expect(screen.queryByRole('dialog', { name: /certificate/i })).not.toBeInTheDocument();
		expect(get(game).certificateSeen).toBe(true);
	});

	it('does not re-show a seen certificate on reload, but can be reopened', async () => {
		seedCompleted(true);
		render(App);

		expect(screen.queryByRole('dialog', { name: /certificate/i })).not.toBeInTheDocument();
		await fireEvent.click(screen.getByRole('button', { name: 'Table' }));
		await fireEvent.click(screen.getByRole('button', { name: /view certificate/i }));
		expect(await screen.findByRole('dialog', { name: /certificate/i })).toBeInTheDocument();
	});

	it('starts over only after a second confirmation', async () => {
		seedCompleted();
		render(App);

		await screen.findByRole('dialog', { name: /certificate/i });
		await fireEvent.click(screen.getByRole('button', { name: /start over/i }));
		expect(screen.getByRole('button', { name: /yes, start over/i })).toBeInTheDocument();
		await fireEvent.click(screen.getByRole('button', { name: /yes, start over/i }));

		expect(get(game).discovered).toEqual(['H']);
		expect(get(game).completedAt).toBeNull();
		expect(screen.queryByRole('dialog', { name: /certificate/i })).not.toBeInTheDocument();
	});

	it('shares a text summary', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, 'clipboard', {
			value: { writeText },
			configurable: true
		});

		seedCompleted();
		render(App);
		await screen.findByRole('dialog', { name: /certificate/i });
		await fireEvent.click(screen.getByRole('button', { name: /share/i }));

		expect(writeText).toHaveBeenCalledWith(expect.stringContaining('118 / 118'));
	});

	it('fires when the 118th element is forged', async () => {
		const discovered = allSymbols.filter((symbol) => symbol !== 'Og');
		initGame(5_000, {
			discovered,
			discoveredAt: Object.fromEntries(discovered.map((symbol, index) => [symbol, index + 1])),
			attempts: 117
		});
		render(App);

		await fireEvent.click(screen.getByRole('button', { name: /helium/i }));
		await fireEvent.click(screen.getByRole('button', { name: /livermorium/i }));
		await fireEvent.click(screen.getByRole('button', { name: /^forge$/i }));

		expect(await screen.findByRole('dialog', { name: /certificate/i })).toBeInTheDocument();
		expect(get(game).discovered).toContain('Og');
		expect(get(game).completedAt).not.toBeNull();
	});
});
