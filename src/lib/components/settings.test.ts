import { fireEvent, render, screen } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App.svelte';
import SettingsScreen from './SettingsScreen.svelte';
import { game, initGame } from '../stores/game';
import { gameState } from '../test/fixtures';

beforeEach(() => {
	window.localStorage.clear();
	initGame(5_000);
});

describe('first run', () => {
	it('shows once and persists dismissal', async () => {
		render(App);
		expect(screen.getByRole('dialog', { name: /welcome/i })).toBeInTheDocument();

		await fireEvent.click(screen.getByRole('button', { name: /get started/i }));
		expect(screen.queryByRole('dialog', { name: /welcome/i })).not.toBeInTheDocument();
		expect(get(game).introSeen).toBe(true);
	});

	it('does not show when already seen', () => {
		initGame(5_000, { introSeen: true });
		render(App);
		expect(screen.queryByRole('dialog', { name: /welcome/i })).not.toBeInTheDocument();
	});
});

describe('settings', () => {
	it('persists sound and motion toggles', async () => {
		initGame(5_000, { introSeen: true });
		render(SettingsScreen);

		await fireEvent.click(screen.getByRole('checkbox', { name: /sound/i }));
		await fireEvent.click(screen.getByRole('checkbox', { name: /reduce motion/i }));

		expect(get(game).settings).toEqual({ sound: false, reduceMotion: true });
		expect(
			JSON.parse(window.localStorage.getItem('mendeleevs-mess:save:v1')!).state.settings
		).toEqual({
			sound: false,
			reduceMotion: true
		});
	});

	it('requires two steps to reset progress', async () => {
		initGame(5_000, {
			discovered: ['H', 'He'],
			discoveredAt: { H: 1, He: 2 },
			introSeen: true
		});
		render(SettingsScreen);

		await fireEvent.click(screen.getByRole('button', { name: /reset progress/i }));
		await fireEvent.click(screen.getByRole('button', { name: /yes, erase it/i }));

		expect(get(game).discovered).toEqual(['H']);
	});

	it('imports a valid save and rejects garbage', async () => {
		initGame(5_000, { introSeen: true });
		render(SettingsScreen);

		const input = screen.getByLabelText(/import save/i);
		const imported = gameState({
			discovered: ['H', 'He'],
			discoveredAt: { H: 1, He: 2 },
			introSeen: true
		});
		const file = new File([JSON.stringify({ version: 1, state: imported })], 'save.json', {
			type: 'application/json'
		});
		await fireEvent.change(input, { target: { files: [file] } });

		expect(await screen.findByRole('status')).toHaveTextContent(/imported/i);
		expect(get(game).discovered).toEqual(['H', 'He']);
	});

	it('opens the certificate from settings when complete', async () => {
		const onShowCertificate = vi.fn();
		initGame(5_000, {
			introSeen: true,
			discovered: ['H'],
			completedAt: 9_000,
			certificateSeen: true,
			completionStats: { attempts: 1, startedAt: 1, completedAt: 9_000, elapsedMs: 8_000 }
		});
		render(SettingsScreen, { props: { onShowCertificate } });

		await fireEvent.click(screen.getByRole('button', { name: /view certificate/i }));
		expect(onShowCertificate).toHaveBeenCalled();
	});
});
