<script lang="ts">
	import { CATEGORIES } from '../data/categories';
	import type { ElementRecord } from '../types';

	let { element, onClose }: { element: ElementRecord; onClose: () => void } = $props();

	const category = $derived(CATEGORIES[element.category]);
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape') onClose();
	}}
/>

<div class="backdrop">
	<div class="page" role="dialog" aria-modal="true" aria-label={element.name}>
		<p class="stamp marker">New element</p>
		<div class="card">
			<span class="stripe" style:background={category.color}></span>
			<span class="number">{element.number}</span>
			<span class="symbol">{element.symbol}</span>
			<span class="name">{element.name}</span>
			<span class="category">{category.label}</span>
		</div>
		<p class="flavor">“{element.flavor}”</p>
		<button class="nice" type="button" onclick={onClose}>Nice</button>
	</div>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 10;
		display: grid;
		place-items: center;
		padding: 24px;
		background: rgba(43, 43, 43, 0.35);
		backdrop-filter: blur(2px);
	}

	.page {
		position: relative;
		width: min(340px, 100%);
		padding: 28px 24px 22px;
		background: var(--paper);
		border: 2px solid var(--ink);
		border-radius: 4px 12px 6px 14px / 12px 5px 14px 6px;
		box-shadow: 8px 8px 0 rgba(43, 43, 43, 0.25);
		text-align: center;
	}

	.stamp {
		position: absolute;
		top: -14px;
		left: 20px;
		margin: 0;
		padding: 2px 10px;
		font-size: 15px;
		color: #fff;
		background: var(--red);
		border-radius: 2px;
		transform: rotate(-4deg);
	}

	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 4px auto 14px;
		padding: 20px 16px 12px;
		background: var(--card);
		border: 2.5px solid var(--ink);
		border-radius: 10px 16px 8px 18px / 16px 8px 18px 10px;
	}

	.stripe {
		position: absolute;
		inset: 0 0 auto;
		height: 7px;
		border-radius: 9px 15px 0 0;
	}

	.number {
		position: absolute;
		top: 12px;
		left: 14px;
		font-size: 11px;
		color: var(--ink-soft);
	}

	.symbol {
		font-family: 'Caveat Variable', cursive;
		font-size: 74px;
		font-weight: 700;
		line-height: 0.9;
	}

	.name {
		font-size: 20px;
		font-weight: 700;
	}

	.category {
		margin-top: 2px;
		font-size: 11px;
		color: var(--ink-soft);
	}

	.flavor {
		margin: 0 8px 20px;
		font-size: 15px;
		font-style: italic;
		color: var(--ink-soft);
	}

	.nice {
		min-height: 44px;
		padding: 8px 28px;
		font-family: 'Caveat Variable', cursive;
		font-size: 20px;
		font-weight: 700;
		background: var(--ink);
		color: var(--paper);
		border: 0;
		border-radius: 8px 12px 7px 13px / 12px 7px 13px 8px;
	}
</style>
