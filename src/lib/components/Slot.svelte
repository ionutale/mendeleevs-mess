<script lang="ts">
	import { CATEGORIES } from '../data/categories';
	import { ELEMENT_BY_SYMBOL } from '../data/elements';

	let {
		symbol,
		index,
		onClear
	}: {
		symbol: string | null;
		index: 1 | 2;
		onClear: () => void;
	} = $props();

	const element = $derived(symbol ? ELEMENT_BY_SYMBOL.get(symbol) : undefined);
	const category = $derived(element ? CATEGORIES[element.category] : undefined);
</script>

<div class="slot" class:filled={!!element} data-testid={`slot-${index}`}>
	{#if element && category}
		<span class="stripe" style:background={category.color}></span>
		<span class="number">{element.number}</span>
		<span class="symbol">{element.symbol}</span>
		<span class="name">{element.name}</span>
		<button class="clear" type="button" onclick={onClear} aria-label={`Clear slot ${index}`}>
			×
		</button>
	{:else}
		<span class="empty">Drop an element</span>
	{/if}
</div>

<style>
	.slot {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-end;
		width: 92px;
		min-height: 110px;
		padding: 14px 11px 9px;
		background: rgba(255, 253, 245, 0.55);
		border: 2.5px dashed #9aa7b8;
		border-radius: 10px 14px 8px 16px / 14px 8px 16px 10px;
	}

	.slot.filled {
		background: var(--card);
		border-style: solid;
		border-color: var(--ink);
		box-shadow: 3px 3px 0 var(--shadow);
	}

	.stripe {
		position: absolute;
		inset: 0 0 auto;
		height: 5px;
		border-radius: 8px 12px 0 0;
	}

	.number {
		position: absolute;
		top: 11px;
		left: 11px;
		font-size: 10px;
		color: var(--ink-soft);
	}

	.symbol {
		font-family: 'Caveat Variable', cursive;
		font-size: 34px;
		font-weight: 700;
		line-height: 1;
	}

	.name {
		max-width: 100%;
		font-size: 10px;
		color: var(--ink-soft);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.empty {
		align-self: center;
		margin-bottom: 28px;
		font-size: 11px;
		color: #8a8f97;
	}

	.clear {
		position: absolute;
		top: 4px;
		right: 4px;
		width: 24px;
		height: 24px;
		padding: 0;
		font-size: 16px;
		line-height: 1;
		color: var(--ink-soft);
		background: transparent;
		border: 0;
		border-radius: 50%;
	}

	.clear:hover {
		color: var(--red);
	}
</style>
