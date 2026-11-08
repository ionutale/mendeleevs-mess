<script lang="ts">
	import { CATEGORIES } from '../data/categories';
	import type { Category, ElementRecord } from '../types';
	import ElementCard from './ElementCard.svelte';

	let {
		elements,
		onPick
	}: {
		elements: readonly ElementRecord[];
		onPick: (symbol: string) => void;
	} = $props();

	let sort = $state<'number' | 'name' | 'category'>('number');
	let category = $state<'all' | Category>('all');
	let query = $state('');

	const visible = $derived(
		elements
			.filter((element) => category === 'all' || element.category === category)
			.filter((element) => {
				const search = query.trim().toLowerCase();
				if (!search) return true;
				return (
					element.name.toLowerCase().includes(search) ||
					element.symbol.toLowerCase().includes(search)
				);
			})
			.toSorted((a, b) => {
				if (sort === 'name') return a.name.localeCompare(b.name);
				if (sort === 'category') {
					const byCategory = CATEGORIES[a.category].label.localeCompare(
						CATEGORIES[b.category].label
					);
					return byCategory || a.number - b.number;
				}
				return a.number - b.number;
			})
	);
</script>

<section class="tray" aria-label="Discovered elements">
	<div class="heading">
		<p class="label marker">Your tray</p>
		<p class="count">{visible.length} of {elements.length}</p>
	</div>

	<div class="controls">
		<label>
			<span>Sort</span>
			<select bind:value={sort}>
				<option value="number">Number</option>
				<option value="name">Name</option>
				<option value="category">Category</option>
			</select>
		</label>

		<label>
			<span>Category</span>
			<select bind:value={category}>
				<option value="all">All</option>
				{#each Object.entries(CATEGORIES) as [value, meta] (value)}
					<option {value}>{meta.label}</option>
				{/each}
			</select>
		</label>

		<label class="search">
			<span>Search</span>
			<input type="search" placeholder="Name or symbol" bind:value={query} />
		</label>
	</div>

	{#if visible.length > 0}
		<div class="rail">
			{#each visible as element (element.symbol)}
				<ElementCard {element} onclick={() => onPick(element.symbol)} />
			{/each}
		</div>
	{:else}
		<p class="empty">Nothing matches. Yet.</p>
	{/if}
</section>

<style>
	.tray {
		width: 100%;
		padding: 12px 14px 14px;
		background: rgba(255, 253, 245, 0.55);
		border-top: 1.5px dashed #9aa7b8;
		border-radius: 18px 18px 0 0;
	}

	.heading {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
	}

	.label {
		margin: 0 0 8px;
		font-size: 13px;
		color: var(--ink-soft);
	}

	.count {
		margin: 0;
		font-size: 11px;
		color: var(--ink-soft);
	}

	.controls {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
		margin-bottom: 10px;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 2px;
		font-size: 10px;
		color: var(--ink-soft);
	}

	select,
	input {
		min-height: 36px;
		padding: 4px 6px;
		font-size: 12px;
		background: var(--card);
		border: 1.5px solid var(--ink);
		border-radius: 5px;
	}

	.search {
		grid-column: 1 / -1;
		min-width: 0;
	}

	.rail {
		display: flex;
		gap: 10px;
		overflow-x: auto;
		padding: 4px 4px 10px;
		scrollbar-width: thin;
	}

	.empty {
		margin: 10px 4px 4px;
		font-size: 13px;
		color: var(--ink-soft);
	}
</style>
