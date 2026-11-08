import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Page from './+page.svelte';

describe('title', () => {
	it('renders the game name', () => {
		render(Page);
		expect(screen.getByRole('heading', { name: /mendeleev's mess/i })).toBeInTheDocument();
	});
});
