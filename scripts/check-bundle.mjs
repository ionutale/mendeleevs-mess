import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const root = 'build/_app';
const files = [];

function walk(dir) {
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) walk(path);
		else if (entry.endsWith('.js')) files.push(path);
	}
}

walk(root);

const total = files.reduce((sum, file) => sum + gzipSync(readFileSync(file)).length, 0);
const kb = total / 1024;
console.log(`Initial JS gzip: ${kb.toFixed(1)} KB across ${files.length} chunks`);

if (kb > 250) {
	console.error('Budget exceeded: initial JS must stay at or below 250 KB gzip.');
	process.exit(1);
}
