import type { ElementRecord } from '../types';

export const ELEMENTS: readonly ElementRecord[] = [
	{
		number: 1,
		symbol: 'H',
		name: 'Hydrogen',
		category: 'reactive-nonmetal',
		flavor: 'The one thing the universe gave you for free.',
		recipe: null
	},
	{
		number: 2,
		symbol: 'He',
		name: 'Helium',
		category: 'noble-gas',
		flavor: 'Aloof, weightless, and extremely pleased with itself.',
		recipe: ['H', 'H']
	}
];

export const ELEMENT_BY_SYMBOL = new Map(ELEMENTS.map((element) => [element.symbol, element]));
export const STARTER_SYMBOL = 'H';
