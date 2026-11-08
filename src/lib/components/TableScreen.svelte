<script lang="ts">
	import { ELEMENTS } from '../data/elements';
	import { game } from '../stores/game';
	import PeriodicTable from './PeriodicTable.svelte';
	import StickerGrid from './StickerGrid.svelte';

	let view = $state<'sticker' | 'classic'>('sticker');
	let missingOnly = $state(false);

	let { onShowCertificate }: { onShowCertificate?: () => void } = $props();

	const discovered = $derived(new Set($game.discovered));
</script>

<main class="app">
	<header class="top">
		<div>
			<h1>The table</h1>
			<p class="subtitle">Every element you have met, and every one still hiding.</p>
		</div>
		<p class="progress" aria-label="Elements discovered">
			{$game.discovered.length} / {ELEMENTS.length}
		</p>
	</header>

	<div class="controls">
		<div class="views" role="group" aria-label="Table view">
			<button type="button" aria-pressed={view === 'sticker'} onclick={() => (view = 'sticker')}>
				Sticker grid
			</button>
			<button type="button" aria-pressed={view === 'classic'} onclick={() => (view = 'classic')}>
				Classic table
			</button>
		</div>

		<label class="missing">
			<input type="checkbox" bind:checked={missingOnly} />
			Only missing
		</label>

		{#if $game.completedAt && onShowCertificate}
			<button class="certificate-link" type="button" onclick={onShowCertificate}>
				View certificate
			</button>
		{/if}
	</div>

	{#if view === 'sticker'}
		<StickerGrid elements={ELEMENTS} {discovered} {missingOnly} />
	{:else}
		<PeriodicTable elements={ELEMENTS} {discovered} {missingOnly} />
	{/if}
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
		max-width: 260px;
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

	.controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		flex-wrap: wrap;
		margin-bottom: 12px;
	}

	.views {
		display: flex;
		gap: 6px;
	}

	.views button {
		min-height: 44px;
		padding: 8px 10px;
		font-size: 12px;
		font-weight: 700;
		background: var(--card);
		border: 1.5px solid var(--ink);
		border-radius: 6px 9px 5px 10px;
	}

	.views button[aria-pressed='true'] {
		background: var(--ink);
		color: var(--paper);
	}

	.missing {
		display: flex;
		align-items: center;
		gap: 6px;
		min-height: 44px;
		font-size: 14px;
	}

	.missing input {
		width: 24px;
		height: 24px;
		accent-color: var(--ink);
	}

	.certificate-link {
		min-height: 44px;
		padding: 8px 10px;
		font-size: 12px;
		font-weight: 700;
		background: var(--card);
		border: 1.5px solid var(--ink);
		border-radius: 6px 9px 5px 10px;
	}
</style>
