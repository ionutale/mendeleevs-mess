import { derived } from 'svelte/store';
import { game } from './game';

function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const reducedMotion = derived(game, ($game) => {
	return $game.settings.reduceMotion || prefersReducedMotion();
});
