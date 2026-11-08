<script lang="ts">
	import type { ElementRecord } from '../types';
	import ElementCard from './ElementCard.svelte';

	let {
		elements,
		onPick
	}: {
		elements: readonly ElementRecord[];
		onPick: (symbol: string) => void;
	} = $props();
</script>

<section class="tray" aria-label="Discovered elements">
	<p class="label marker">Your tray</p>
	<div class="rail">
		{#each elements as element (element.symbol)}
			<ElementCard {element} onclick={() => onPick(element.symbol)} />
		{/each}
	</div>
</section>

<style>
	.tray {
		width: 100%;
		padding: 12px 14px 14px;
		background: rgba(255, 253, 245, 0.55);
		border-top: 1.5px dashed #9aa7b8;
		border-radius: 18px 18px 0 0;
	}

	.label {
		margin: 0 0 8px;
		font-size: 13px;
		color: var(--ink-soft);
	}

	.rail {
		display: flex;
		gap: 10px;
		overflow-x: auto;
		padding: 4px 4px 10px;
		scrollbar-width: thin;
	}
</style>
