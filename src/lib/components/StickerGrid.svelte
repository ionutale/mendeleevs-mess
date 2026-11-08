<script lang="ts">
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

<ol class="grid" aria-label="Sticker grid">
	{#each visible as element (element.symbol)}
		<li>
			<TableTile {element} discovered={discovered.has(element.symbol)} />
		</li>
	{/each}
</ol>

{#if visible.length === 0}
	<p class="empty">Nothing missing. Show-off.</p>
{/if}

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(10, minmax(0, 1fr));
		gap: 4px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.empty {
		margin: 20px 4px;
		font-size: 14px;
		color: var(--ink-soft);
		text-align: center;
	}
</style>
