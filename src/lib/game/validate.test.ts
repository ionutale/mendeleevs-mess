import { describe, expect, it } from 'vitest';
import { element, tinyElements } from '../test/fixtures';
import { reachableSymbols, validateElements } from './validate';

describe('validateElements', () => {
	it('accepts a complete, reachable set', () => {
		expect(validateElements(tinyElements)).toEqual({ ok: true, errors: [] });
		expect(reachableSymbols(tinyElements, ['H'])).toEqual(new Set(['H', 'He', 'Li']));
	});

	it('rejects an unreachable element', () => {
		const broken = [...tinyElements, element(4, 'Be', ['C', 'C'])];
		const result = validateElements(broken);
		expect(result.ok).toBe(false);
		expect(result.errors.join(' ')).toMatch(/Be/);
	});

	it('rejects a recipe with an unknown symbol', () => {
		const broken = [element(1, 'H', null), element(2, 'He', ['H', 'Xx'])];
		expect(validateElements(broken).ok).toBe(false);
	});

	it('rejects a flavor line over 100 characters', () => {
		const broken = [element(1, 'H', null, { flavor: 'x'.repeat(101) })];
		expect(validateElements(broken).ok).toBe(false);
	});
});
