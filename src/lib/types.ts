export type Category =
	| 'alkali-metal'
	| 'alkaline-earth-metal'
	| 'transition-metal'
	| 'post-transition-metal'
	| 'metalloid'
	| 'reactive-nonmetal'
	| 'halogen'
	| 'noble-gas'
	| 'lanthanide'
	| 'actinide';

export type Screen = 'forge' | 'notebook' | 'table' | 'settings';

export interface ElementRecord {
	number: number;
	symbol: string;
	name: string;
	category: Category;
	flavor: string;
	recipe: [string, string] | null;
}

export interface ScrapEntry {
	pair: [string, string];
	at: number;
}

export interface CompletionStats {
	attempts: number;
	startedAt: number;
	completedAt: number;
	elapsedMs: number;
}

export interface GameSettings {
	sound: boolean;
	reduceMotion: boolean;
}

export interface GameState {
	version: 1;
	discovered: string[];
	discoveredAt: Record<string, number>;
	attempts: number;
	scrapLog: ScrapEntry[];
	startedAt: number;
	introSeen: boolean;
	completedAt: number | null;
	certificateSeen: boolean;
	completionStats: CompletionStats | null;
	settings: GameSettings;
	lastScreen: Screen;
}
