<script lang="ts">
	import { TABLE_LAYOUT } from '../data/tableLayout';
	import type { ElementRecord } from '../types';
	import TableTile from './TableTile.svelte';

	let {
		elements,
		discovered,
		missingOnly
	}: {
		elements: readonly ElementRecord[];
		discovered: ReadonlySet<string>;
		missingOnly: boolean;
	} = $props();

	const visible = $derived(
		missingOnly ? elements.filter((element) => !discovered.has(element.symbol)) : elements
	);
</script>

<div class="scroll">
	<div class="table" role="region" aria-label="Periodic table">
		{#each visible as element (element.symbol)}
			{@const position = TABLE_LAYOUT[element.symbol]}
			{#if position}
				<div class="cell" style:grid-column={position.col} style:grid-row={position.row}>
					<TableTile {element} discovered={discovered.has(element.symbol)} />
				</div>
			{/if}
		{/each}

		<span class="f-label" style:grid-column="3" style:grid-row="6">57–71</span>
		<span class="f-label" style:grid-column="3" style:grid-row="7">89–103</span>
	</div>
</div>

<style>
	.scroll {
		width: 100%;
		overflow-x: auto;
		padding-bottom: 8px;
	}

	.table {
		display: grid;
		grid-template-columns: repeat(18, minmax(0, 1fr));
		grid-template-rows: repeat(9, auto);
		gap: 3px;
		min-width: 680px;
	}

	.f-label {
		align-self: center;
		font-size: 7px;
		color: var(--ink-soft);
		text-align: center;
	}
</style>
