import { ELEMENTS } from '../src/lib/data/elements';
import { reachableSymbols, validateElements } from '../src/lib/game/validate';

const result = validateElements(ELEMENTS);
const reachable = reachableSymbols(ELEMENTS, ['H']);

console.log(`${ELEMENTS.length} elements, ${reachable.size} reachable`);

if (result.errors.length > 0) {
	for (const error of result.errors) console.error(`- ${error}`);
	process.exit(1);
}

console.log('Content OK');
