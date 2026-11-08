<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';

	const { needRefresh, updateServiceWorker } = useRegisterSW();
</script>

{#if $needRefresh}
	<div class="pwa" role="status">
		<span>A new mess is ready.</span>
		<button type="button" onclick={() => updateServiceWorker(true)}>Refresh</button>
		<button type="button" onclick={() => needRefresh.set(false)}>Later</button>
	</div>
{/if}

<style>
	.pwa {
		position: fixed;
		z-index: 50;
		right: 12px;
		bottom: calc(74px + env(safe-area-inset-bottom));
		left: 12px;
		display: flex;
		align-items: center;
		gap: 8px;
		max-width: 536px;
		margin: 0 auto;
		padding: 10px 12px;
		font-size: 12px;
		background: var(--paper);
		border: 1.5px solid var(--ink);
		border-radius: 8px;
		box-shadow: 3px 3px 0 var(--shadow);
	}

	span {
		flex: 1;
	}

	button {
		min-height: 32px;
		padding: 3px 8px;
		font-size: 12px;
		background: var(--card);
		border: 1.5px solid var(--ink);
		border-radius: 5px;
	}
</style>
