<script lang="ts">
	import { game, setScreen } from '../stores/game';
	import ForgeScreen from './ForgeScreen.svelte';
	import TableScreen from './TableScreen.svelte';

	const current = $derived($game.lastScreen === 'table' ? 'table' : 'forge');
</script>

{#if current === 'table'}
	<TableScreen />
{:else}
	<ForgeScreen />
{/if}

<nav class="bottom-nav" aria-label="Main">
	<button
		type="button"
		class:active={current === 'forge'}
		aria-current={current === 'forge' ? 'page' : undefined}
		onclick={() => setScreen('forge')}
	>
		<span class="icon" aria-hidden="true">⚗</span>
		Bench
	</button>
	<button
		type="button"
		class:active={current === 'table'}
		aria-current={current === 'table' ? 'page' : undefined}
		onclick={() => setScreen('table')}
	>
		<span class="icon" aria-hidden="true">▦</span>
		Table
	</button>
</nav>

<style>
	.bottom-nav {
		position: fixed;
		z-index: 5;
		right: 0;
		bottom: 0;
		left: 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		max-width: 560px;
		margin: 0 auto;
		padding: 6px 10px calc(6px + env(safe-area-inset-bottom));
		background: color-mix(in srgb, var(--paper) 94%, transparent);
		border-top: 1.5px solid var(--ink);
		backdrop-filter: blur(6px);
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		min-height: 48px;
		font-family: 'Caveat Variable', cursive;
		font-size: 19px;
		font-weight: 700;
		color: var(--ink-soft);
		background: transparent;
		border: 0;
		border-radius: 8px;
	}

	button.active {
		color: var(--ink);
		background: var(--paper-deep);
	}

	.icon {
		font-size: 16px;
	}
</style>
