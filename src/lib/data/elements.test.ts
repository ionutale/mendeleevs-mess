import { describe, expect, it } from 'vitest';
import { reachableSymbols, validateElements } from '../game/validate';
import { ELEMENTS, ELEMENT_BY_SYMBOL } from './elements';
import { FAILURE_LINES } from './failures';

describe('full content', () => {
	it('ships all 118 elements and all are reachable', () => {
		expect(ELEMENTS).toHaveLength(118);
		expect(new Set(ELEMENTS.map((element) => element.number))).toEqual(
			new Set(Array.from({ length: 118 }, (_, index) => index + 1))
		);
		expect(validateElements(ELEMENTS)).toEqual({ ok: true, errors: [] });
		expect(reachableSymbols(ELEMENTS, ['H']).size).toBe(118);
		expect(ELEMENT_BY_SYMBOL.get('Og')?.name).toBe('Oganesson');
	});

	it('keeps every flavor line within 100 characters', () => {
		for (const element of ELEMENTS) {
			expect(element.flavor.length).toBeGreaterThan(0);
			expect(element.flavor.length).toBeLessThanOrEqual(100);
		}
	});

	it('has failure copy that never hints', () => {
		expect(FAILURE_LINES.length).toBeGreaterThanOrEqual(24);
		for (const line of FAILURE_LINES) {
			expect(line.toLowerCase()).not.toMatch(/hint|try combining/);
		}
	});
});
