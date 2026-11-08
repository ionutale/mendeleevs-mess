<script lang="ts">
	import { CATEGORIES } from '../data/categories';
	import type { ElementRecord } from '../types';

	let {
		element,
		selected = false,
		onclick
	}: {
		element: ElementRecord;
		selected?: boolean;
		onclick?: (event: MouseEvent) => void;
	} = $props();

	const category = $derived(CATEGORIES[element.category]);
</script>

<button
	class="element-card"
	class:selected
	type="button"
	draggable="true"
	aria-pressed={selected}
	{onclick}
	ondragstart={(event) => event.dataTransfer?.setData('text/plain', element.symbol)}
>
	<span class="stripe" style:background={category.color}></span>
	<span class="number">{element.number}</span>
	<span class="symbol">{element.symbol}</span>
	<span class="name">{element.name}</span>
	<span class="visually-hidden">, {category.label}</span>
</button>

<style>
	.element-card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-end;
		width: 78px;
		min-height: 92px;
		padding: 12px 9px 8px;
		background: var(--card);
		border: 2.5px solid var(--ink);
		border-radius: 9px 13px 7px 15px / 13px 7px 15px 9px;
		box-shadow: 3px 3px 0 var(--shadow);
		text-align: left;
		transition:
			transform 150ms ease,
			box-shadow 150ms ease;
	}

	.element-card:hover,
	.element-card:focus-visible {
		transform: translateY(-2px) rotate(-0.5deg);
	}

	.element-card.selected {
		outline: 3px solid var(--red);
		outline-offset: 3px;
	}

	.stripe {
		position: absolute;
		inset: 0 0 auto;
		height: 5px;
		border-radius: 8px 12px 0 0;
	}

	.number {
		position: absolute;
		top: 10px;
		left: 9px;
		font-size: 10px;
		color: var(--ink-soft);
	}

	.symbol {
		font-family: 'Caveat Variable', cursive;
		font-size: 30px;
		font-weight: 700;
		line-height: 1;
	}

	.name {
		font-size: 10px;
		color: var(--ink-soft);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}
</style>
