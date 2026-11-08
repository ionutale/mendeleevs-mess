import { ELEMENTS } from '../src/lib/data/elements';
import { reachableSymbols, validateElements } from '../src/lib/game/validate';

const result = validateElements(ELEMENTS);
const reachable = reachableSymbols(ELEMENTS, ['H']);

console.log(`${ELEMENTS.length} elements, ${reachable.size} reachable`);

if (ELEMENTS.length !== 118) {
	console.error(`Expected 118 elements, found ${ELEMENTS.length}.`);
	process.exit(1);
}

if (result.errors.length > 0) {
	for (const error of result.errors) console.error(`- ${error}`);
	process.exit(1);
}

console.log('Content OK');
