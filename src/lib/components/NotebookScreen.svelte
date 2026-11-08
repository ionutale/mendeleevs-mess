<script lang="ts">
	import { CATEGORIES } from '../data/categories';
	import { ELEMENTS } from '../data/elements';
	import { clearScrapLog, game } from '../stores/game';
	import type { Category } from '../types';
	import ElementCard from './ElementCard.svelte';
	import ElementPage from './ElementPage.svelte';
	import ScrapLog from './ScrapLog.svelte';

	let sort = $state<'newest' | 'number' | 'name'>('newest');
	let category = $state<'all' | Category>('all');
	let query = $state('');
	let selected = $state<string | null>(null);

	let { onShowCertificate }: { onShowCertificate?: () => void } = $props();

	const selectedElement = $derived(
		selected ? (ELEMENTS.find((element) => element.symbol === selected) ?? null) : null
	);

	const discovered = $derived(
		ELEMENTS.filter((element) => $game.discovered.includes(element.symbol))
	);

	const visible = $derived(
		discovered
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
				if (sort === 'newest') {
					const byDate = ($game.discoveredAt[b.symbol] ?? 0) - ($game.discoveredAt[a.symbol] ?? 0);
					return byDate || a.number - b.number;
				}
				if (sort === 'name') return a.name.localeCompare(b.name);
				return a.number - b.number;
			})
	);
</script>

<main class="app">
	<header class="top">
		<div>
			<h1>The notebook</h1>
			<p class="subtitle">Everything you have met, with the dates to prove it.</p>
		</div>
		<p class="progress" aria-label="Elements discovered">
			{$game.discovered.length} / {ELEMENTS.length}
		</p>
		{#if $game.completedAt && onShowCertificate}
			<button class="certificate-link" type="button" onclick={onShowCertificate}>
				View certificate
			</button>
		{/if}
	</header>

	{#if selectedElement}
		<ElementPage
			element={selectedElement}
			discoveredAt={$game.discoveredAt[selectedElement.symbol] ?? $game.startedAt}
			onBack={() => (selected = null)}
		/>
	{:else}
		<div class="controls">
			<label>
				<span>Sort</span>
				<select bind:value={sort}>
					<option value="newest">Newest</option>
					<option value="number">Number</option>
					<option value="name">Name</option>
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
			<ul class="grid">
				{#each visible as element (element.symbol)}
					<li data-testid="notebook-card">
						<ElementCard {element} onclick={() => (selected = element.symbol)} />
					</li>
				{/each}
			</ul>
		{:else}
			<p class="empty">Nothing matches. Yet.</p>
		{/if}
	{/if}

	<ScrapLog entries={$game.scrapLog} onClear={clearScrapLog} />
</main>

<style>
	.top {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 12px;
		padding: 8px 2px 14px;
	}

	h1 {
		font-size: clamp(2rem, 8vw, 3rem);
	}

	.subtitle {
		margin: 4px 0 0;
		font-size: 12px;
		max-width: 250px;
	}

	.progress {
		margin: 0;
		padding: 4px 9px;
		font-family: 'Caveat Variable', cursive;
		font-size: 18px;
		font-weight: 700;
		background: var(--paper-deep);
		border: 1.5px solid var(--ink);
		border-radius: 6px 9px 5px 10px;
		white-space: nowrap;
	}

	.certificate-link {
		min-height: 34px;
		padding: 4px 9px;
		font-size: 11px;
		font-weight: 700;
		background: var(--card);
		border: 1.5px solid var(--ink);
		border-radius: 6px 9px 5px 10px;
	}

	.controls {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
		margin-bottom: 12px;
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
		min-height: 38px;
		padding: 4px 6px;
		font-size: 12px;
		background: var(--card);
		border: 1.5px solid var(--ink);
		border-radius: 5px;
	}

	.search {
		grid-column: 1 / -1;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(82px, 1fr));
		gap: 10px;
		margin: 0;
		padding: 2px;
		list-style: none;
	}

	.grid :global(.element-card) {
		width: 100%;
	}

	.empty {
		margin: 22px 4px;
		font-size: 14px;
		color: var(--ink-soft);
		text-align: center;
	}
</style>
