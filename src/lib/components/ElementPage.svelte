<script lang="ts">
	import { CATEGORIES } from '../data/categories';
	import CategoryDoodle from './CategoryDoodle.svelte';
	import type { ElementRecord } from '../types';

	let {
		element,
		discoveredAt,
		onBack
	}: {
		element: ElementRecord;
		discoveredAt: number;
		onBack: () => void;
	} = $props();

	const category = $derived(CATEGORIES[element.category]);
	const parents = $derived(element.recipe);
</script>

<article class="page" aria-label={`${element.name} notebook page`}>
	<button class="back" type="button" onclick={onBack}>← Back to notebook</button>

	<div class="card">
		<span class="stripe" style:background={category.color}></span>
		<span class="number">{element.number}</span>
		<span class="symbol">{element.symbol}</span>
		<h2>{element.name}</h2>
		<p class="category">{category.label}</p>
	</div>

	<CategoryDoodle category={element.category} />

	<p class="flavor">{element.flavor}</p>

	<dl class="facts">
		<div>
			<dt>Discovered</dt>
			<dd>{new Date(discoveredAt).toLocaleDateString()}</dd>
		</div>
		{#if parents}
			<div>
				<dt>First forged from</dt>
				<dd>{parents.join(' + ')}</dd>
			</div>
		{:else}
			<div>
				<dt>Origin</dt>
				<dd>It was already here.</dd>
			</div>
		{/if}
	</dl>
</article>

<style>
	.page :global(.doodle) {
		display: block;
		margin: 12px auto 0;
	}
	.page {
		padding-bottom: 12px;
	}

	.back {
		min-height: 44px;
		margin-bottom: 12px;
		padding: 4px 8px;
		font-size: 13px;
		color: var(--ink-soft);
		background: transparent;
		border: 0;
	}

	.back:hover {
		color: var(--ink);
	}

	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 28px 20px 16px;
		background: var(--card);
		border: 2.5px solid var(--ink);
		border-radius: 10px 16px 8px 18px / 16px 8px 18px 10px;
		box-shadow: 4px 4px 0 var(--shadow);
	}

	.stripe {
		position: absolute;
		inset: 0 0 auto;
		height: 7px;
		border-radius: 9px 15px 0 0;
	}

	.number {
		position: absolute;
		top: 14px;
		left: 16px;
		font-size: 12px;
		color: var(--ink-soft);
	}

	.symbol {
		font-family: 'Caveat Variable', cursive;
		font-size: 84px;
		font-weight: 700;
		line-height: 0.85;
	}

	h2 {
		margin: 4px 0 0;
		font-size: 2rem;
	}

	.category {
		margin: 2px 0 0;
		font-size: 12px;
		color: var(--ink-soft);
	}

	.flavor {
		margin: 20px 12px;
		font-size: 17px;
		font-style: italic;
		color: var(--ink-soft);
		text-align: center;
	}

	.facts {
		display: grid;
		gap: 10px;
		margin: 0;
		padding: 14px 16px;
		background: var(--paper-deep);
		border-radius: 8px;
	}

	.facts div {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
	}

	dt {
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--ink-soft);
	}

	dd {
		margin: 0;
		font-size: 14px;
		font-weight: 700;
	}
</style>
