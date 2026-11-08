<script lang="ts">
	import { CATEGORIES } from '../data/categories';
	import type { ElementRecord } from '../types';

	let {
		element,
		discovered,
		showName = false
	}: {
		element: ElementRecord;
		discovered: boolean;
		showName?: boolean;
	} = $props();

	const category = $derived(CATEGORIES[element.category]);
</script>

<div
	class="tile"
	class:discovered
	data-testid="table-tile"
	aria-label={discovered
		? `${element.name}, element ${element.number}, discovered`
		: `Element ${element.number}, undiscovered`}
	style:--category={category.color}
>
	<span class="number">{element.number}</span>
	{#if discovered}
		<span class="symbol">{element.symbol}</span>
		{#if showName}<span class="name">{element.name}</span>{/if}
	{:else}
		<span class="unknown">·</span>
	{/if}
</div>

<style>
	.tile {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1px;
		min-width: 0;
		aspect-ratio: 1 / 1.15;
		padding: 3px 2px;
		background: rgba(255, 253, 245, 0.42);
		border: 1.5px dashed #b8bfc9;
		border-radius: 4px;
		color: #9aa7b8;
		text-align: center;
	}

	.tile.discovered {
		background: var(--card);
		border: 1.5px solid var(--ink);
		color: var(--ink);
		box-shadow: 1px 1px 0 var(--shadow);
	}

	.tile.discovered::before {
		content: '';
		position: absolute;
		inset: 0 0 auto;
		height: 3px;
		background: var(--category);
		border-radius: 3px 3px 0 0;
	}

	.number {
		position: absolute;
		top: 3px;
		left: 3px;
		font-size: 7px;
		line-height: 1;
		color: var(--ink-soft);
	}

	.symbol {
		font-family: 'Caveat Variable', cursive;
		font-size: 17px;
		font-weight: 700;
		line-height: 1;
	}

	.name {
		max-width: 100%;
		font-size: 6px;
		line-height: 1.05;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--ink-soft);
	}

	.unknown {
		font-size: 12px;
		opacity: 0.6;
	}
</style>
