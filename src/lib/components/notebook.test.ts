import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App.svelte';
import NotebookScreen from './NotebookScreen.svelte';
import { ELEMENTS } from '../data/elements';
import { initGame } from '../stores/game';

const discovered = ['H', 'He', 'C', 'O'];
const discoveredAt = { H: 1_000, He: 2_000, C: 3_000, O: 4_000 };

beforeEach(() => {
	window.localStorage.clear();
	initGame(5_000, { discovered, discoveredAt });
});

describe('notebook', () => {
	it('lists discovered elements newest first', () => {
		render(NotebookScreen);
		const cards = screen.getAllByTestId('notebook-card');
		expect(cards).toHaveLength(4);
		expect(cards[0]).toHaveTextContent('Oxygen');
		expect(cards[3]).toHaveTextContent('Hydrogen');
	});

	it('searches and filters discovered elements only', async () => {
		render(NotebookScreen);
		await fireEvent.input(screen.getByRole('searchbox'), { target: { value: 'helium' } });
		expect(screen.getAllByTestId('notebook-card')).toHaveLength(1);
		expect(screen.getByText('Helium')).toBeInTheDocument();

		await fireEvent.input(screen.getByRole('searchbox'), { target: { value: '' } });
		await fireEvent.change(screen.getByLabelText(/category/i), {
			target: { value: 'noble-gas' }
		});
		expect(screen.getAllByTestId('notebook-card')).toHaveLength(1);
	});

	it('opens an element page with flavor, date, and parents', async () => {
		render(NotebookScreen);
		await fireEvent.click(screen.getByRole('button', { name: /oxygen/i }));

		const oxygen = ELEMENTS.find((element) => element.symbol === 'O')!;
		expect(screen.getByRole('heading', { name: /oxygen/i })).toBeInTheDocument();
		expect(screen.getByText(oxygen.flavor)).toBeInTheDocument();
		expect(screen.getByText(new Date(discoveredAt.O).toLocaleDateString())).toBeInTheDocument();
		expect(screen.getByText('C + He')).toBeInTheDocument();
	});

	it('lists and clears failed experiments', async () => {
		initGame(5_000, {
			discovered,
			discoveredAt,
			scrapLog: [{ pair: ['H', 'Fe'], at: 3 }]
		});
		render(NotebookScreen);

		expect(screen.getByText('H + Fe')).toBeInTheDocument();
		await fireEvent.click(screen.getByRole('button', { name: /clear failed experiments/i }));
		expect(screen.getByText(/no failed experiments/i)).toBeInTheDocument();
	});

	it('is reachable from the app navigation', async () => {
		render(App);
		await fireEvent.click(screen.getByRole('button', { name: 'Notebook' }));
		expect(screen.getByRole('heading', { name: /the notebook/i })).toBeInTheDocument();
	});
});
