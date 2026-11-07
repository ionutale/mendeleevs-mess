import type { Category } from '../types';

export const CATEGORIES: Record<Category, { label: string; color: string }> = {
	'alkali-metal': { label: 'Alkali metal', color: '#E8A15C' },
	'alkaline-earth-metal': { label: 'Alkaline earth', color: '#E8C45C' },
	'transition-metal': { label: 'Transition metal', color: '#8FB6D9' },
	'post-transition-metal': { label: 'Post-transition metal', color: '#9FAAB8' },
	metalloid: { label: 'Metalloid', color: '#7FBF9E' },
	'reactive-nonmetal': { label: 'Reactive nonmetal', color: '#6FB6E8' },
	halogen: { label: 'Halogen', color: '#5FB89A' },
	'noble-gas': { label: 'Noble gas', color: '#B48CE0' },
	lanthanide: { label: 'Lanthanide', color: '#D98FB5' },
	actinide: { label: 'Actinide', color: '#C97F9E' }
};
