import { CATEGORIES } from '../data/categories';
import type { ElementRecord } from '../types';

export interface ValidationResult {
	ok: boolean;
	errors: string[];
}

export function reachableSymbols(
	elements: readonly ElementRecord[],
	starters: readonly string[]
): Set<string> {
	const known = new Set(elements.map((element) => element.symbol));
	const reachable = new Set(starters.filter((symbol) => known.has(symbol)));

	let changed = true;
	while (changed) {
		changed = false;
		for (const element of elements) {
			if (reachable.has(element.symbol) || !element.recipe) continue;
			if (element.recipe.every((parent) => reachable.has(parent))) {
				reachable.add(element.symbol);
				changed = true;
			}
		}
	}

	return reachable;
}

export function validateElements(elements: readonly ElementRecord[]): ValidationResult {
	const errors: string[] = [];

	if (elements.length === 0) errors.push('Element list is empty.');

	const numbers = new Set<number>();
	const symbols = new Set<string>();

	for (const element of elements) {
		if (numbers.has(element.number)) errors.push(`Duplicate atomic number ${element.number}.`);
		numbers.add(element.number);

		if (symbols.has(element.symbol)) errors.push(`Duplicate symbol ${element.symbol}.`);
		symbols.add(element.symbol);

		if (!(element.category in CATEGORIES)) {
			errors.push(`${element.symbol} has an invalid category.`);
		}

		if (element.flavor.length < 1 || element.flavor.length > 100) {
			errors.push(`${element.symbol} must have a flavor line of 1-100 characters.`);
		}
	}

	const hydrogen = elements.find((element) => element.symbol === 'H');
	if (!hydrogen) {
		errors.push('Hydrogen (H) is missing.');
	} else if (hydrogen.recipe !== null) {
		errors.push('Hydrogen must not have a recipe.');
	}

	for (const element of elements) {
		if (element.symbol === 'H') continue;

		if (!element.recipe) {
			errors.push(`${element.symbol} has no recipe.`);
			continue;
		}

		for (const parent of element.recipe) {
			if (!symbols.has(parent)) {
				errors.push(`${element.symbol} has a recipe with unknown symbol ${parent}.`);
			}
		}
	}

	if (hydrogen) {
		const reachable = reachableSymbols(elements, ['H']);
		for (const element of elements) {
			if (!reachable.has(element.symbol)) {
				errors.push(`${element.symbol} is unreachable from Hydrogen.`);
			}
		}
	}

	return { ok: errors.length === 0, errors };
}
