import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import { ELEMENTS } from '../data/elements';
import Slot from './Slot.svelte';
import Tray from './Tray.svelte';

describe('tray at scale', () => {
	it('shows all 118 discovered elements by default', () => {
		render(Tray, { props: { elements: ELEMENTS, onPick: vi.fn() } });
		expect(screen.getByText('118 of 118')).toBeInTheDocument();
	});

	it('searches by name or symbol', async () => {
		render(Tray, { props: { elements: ELEMENTS, onPick: vi.fn() } });
		await fireEvent.input(screen.getByRole('searchbox'), { target: { value: 'oganesson' } });
		expect(screen.getByText('1 of 118')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /oganesson/i })).toBeInTheDocument();

		await fireEvent.input(screen.getByRole('searchbox'), { target: { value: 'zzz' } });
		expect(screen.getByText(/nothing matches/i)).toBeInTheDocument();
	});

	it('filters by category', async () => {
		render(Tray, { props: { elements: ELEMENTS, onPick: vi.fn() } });
		await fireEvent.change(screen.getByLabelText(/category/i), {
			target: { value: 'noble-gas' }
		});
		expect(screen.getByText('7 of 118')).toBeInTheDocument();
	});

	it('sorts by name', async () => {
		render(Tray, { props: { elements: ELEMENTS, onPick: vi.fn() } });
		await fireEvent.change(screen.getByLabelText(/sort/i), { target: { value: 'name' } });
		const first = screen.getAllByRole('button')[0];
		expect(first).toHaveAccessibleName(/actinium/i);
	});

	it('starts a drag with the element symbol', async () => {
		render(Tray, { props: { elements: [ELEMENTS[0]], onPick: vi.fn() } });
		const data = new Map<string, string>();
		const dataTransfer = {
			setData: (type: string, value: string) => data.set(type, value),
			getData: (type: string) => data.get(type) ?? ''
		} as unknown as DataTransfer;

		await fireEvent.dragStart(screen.getByRole('button', { name: /hydrogen/i }), { dataTransfer });
		expect(data.get('text/plain')).toBe('H');
	});

	it('drops an element into a slot', async () => {
		const onDrop = vi.fn();
		render(Slot, { props: { symbol: null, index: 1, onClear: vi.fn(), onDrop } });

		const dataTransfer = {
			getData: () => 'He'
		} as unknown as DataTransfer;

		await fireEvent.drop(screen.getByRole('group', { name: /forge slot 1/i }), { dataTransfer });
		expect(onDrop).toHaveBeenCalledWith('He');
	});
});
