import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App.svelte';
import TableScreen from './TableScreen.svelte';
import { initGame } from '../stores/game';

beforeEach(() => {
	window.localStorage.clear();
	initGame(5_000, {
		discovered: ['H', 'He'],
		discoveredAt: { H: 1, He: 2 }
	});
});

describe('table view', () => {
	it('shows progress and hides undiscovered symbols', () => {
		render(TableScreen);
		expect(screen.getByText('2 / 118')).toBeInTheDocument();
		expect(screen.getAllByTestId('table-tile')).toHaveLength(118);
		expect(screen.getByText('He')).toBeInTheDocument();
		expect(screen.queryByText('Li')).not.toBeInTheDocument();
	});

	it('toggles the classic periodic layout', async () => {
		render(TableScreen);
		await fireEvent.click(screen.getByRole('button', { name: /classic table/i }));
		expect(screen.getByRole('region', { name: /periodic table/i })).toBeInTheDocument();
		expect(screen.getAllByTestId('table-tile')).toHaveLength(118);
	});

	it('filters to missing elements only', async () => {
		render(TableScreen);
		await fireEvent.click(screen.getByRole('checkbox', { name: /only missing/i }));
		expect(screen.queryByText('He')).not.toBeInTheDocument();
		expect(screen.getAllByTestId('table-tile')).toHaveLength(116);
	});

	it('is reachable from the app navigation', async () => {
		render(App);
		await fireEvent.click(screen.getByRole('button', { name: 'Table' }));
		expect(screen.getByRole('heading', { name: /the table/i })).toBeInTheDocument();
	});
});
