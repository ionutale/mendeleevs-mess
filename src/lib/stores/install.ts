import { writable } from 'svelte/store';

export interface InstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: string }>;
}

export const installPrompt = writable<InstallPromptEvent | null>(null);

export function captureInstallPrompt(): () => void {
	if (typeof window === 'undefined') return () => {};

	const handler = (event: Event) => {
		event.preventDefault();
		installPrompt.set(event as InstallPromptEvent);
	};

	window.addEventListener('beforeinstallprompt', handler);
	return () => window.removeEventListener('beforeinstallprompt', handler);
}
