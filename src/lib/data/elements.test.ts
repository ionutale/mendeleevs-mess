import { describe, expect, it } from 'vitest';
import { reachableSymbols, validateElements } from '../game/validate';
import { ELEMENTS, ELEMENT_BY_SYMBOL } from './elements';
import { FAILURE_LINES } from './failures';

describe('slice content', () => {
	it('ships Hydrogen and Helium as a reachable pair', () => {
		expect(ELEMENTS).toHaveLength(2);
		expect(validateElements(ELEMENTS)).toEqual({ ok: true, errors: [] });
		expect(reachableSymbols(ELEMENTS, ['H'])).toEqual(new Set(['H', 'He']));
		expect(ELEMENT_BY_SYMBOL.get('He')?.recipe).toEqual(['H', 'H']);
	});

	it('has failure copy that never hints', () => {
		expect(FAILURE_LINES.length).toBeGreaterThanOrEqual(4);
		for (const line of FAILURE_LINES) {
			expect(line.toLowerCase()).not.toMatch(/hint|try combining/);
		}
	});
});
