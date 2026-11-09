<script lang="ts">
	import { onMount } from 'svelte';
	import { game, recovered, saveError, setScreen } from '../stores/game';
	import { captureInstallPrompt } from '../stores/install';
	import { reducedMotion } from '../stores/motion';
	import FirstRun from './FirstRun.svelte';
	import ForgeScreen from './ForgeScreen.svelte';
	import NotebookScreen from './NotebookScreen.svelte';
	import PwaUpdate from './PwaUpdate.svelte';
	import SettingsScreen from './SettingsScreen.svelte';
	import TableScreen from './TableScreen.svelte';
	import WinScreen from './WinScreen.svelte';

	const current = $derived(
		$game.lastScreen === 'table'
			? 'table'
			: $game.lastScreen === 'notebook'
				? 'notebook'
				: $game.lastScreen === 'settings'
					? 'settings'
					: 'forge'
	);

	let showCertificate = $state(false);

	onMount(captureInstallPrompt);

	$effect(() => {
		if ($game.completedAt && !$game.certificateSeen) showCertificate = true;
	});
</script>

<div class="app-root" class:reduce-motion={$reducedMotion}>
	{#if $recovered}
		<div class="recovery" role="status">
			<span>A save could not be read. Starting from one hydrogen.</span>
			<button type="button" onclick={() => recovered.set(false)}>Dismiss</button>
		</div>
	{/if}

	{#if $saveError}
		<div class="recovery save-error" role="status">
			<span>Progress could not be saved. Storage may be full or blocked.</span>
			<button type="button" onclick={() => saveError.set(false)}>Dismiss</button>
		</div>
	{/if}

	{#if current === 'table'}
		<TableScreen onShowCertificate={() => (showCertificate = true)} />
	{:else if current === 'notebook'}
		<NotebookScreen onShowCertificate={() => (showCertificate = true)} />
	{:else if current === 'settings'}
		<SettingsScreen onShowCertificate={() => (showCertificate = true)} />
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
			class:active={current === 'notebook'}
			aria-current={current === 'notebook' ? 'page' : undefined}
			onclick={() => setScreen('notebook')}
		>
			<span class="icon" aria-hidden="true">✎</span>
			Notebook
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
		<button
			type="button"
			class:active={current === 'settings'}
			aria-current={current === 'settings' ? 'page' : undefined}
			onclick={() => setScreen('settings')}
		>
			<span class="icon" aria-hidden="true">⚙</span>
			Settings
		</button>
	</nav>

	<PwaUpdate />

	{#if !$game.introSeen}
		<FirstRun />
	{/if}

	{#if showCertificate}
		<WinScreen onClose={() => (showCertificate = false)} />
	{/if}
</div>

<style>
	.app-root {
		min-height: 100dvh;
	}

	.recovery {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 10px 14px 0;
		padding: 8px 10px;
		font-size: 12px;
		color: var(--paper);
		background: var(--red);
		border-radius: 6px;
	}

	.recovery span {
		flex: 1;
	}

	.recovery button {
		min-height: 44px;
		padding: 4px 8px;
		font-size: 11px;
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.6);
		border-radius: 4px;
	}

	.bottom-nav {
		position: fixed;
		z-index: 5;
		right: 0;
		bottom: 0;
		left: 0;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		max-width: 560px;
		margin: 0 auto;
		padding: 6px 6px calc(6px + env(safe-area-inset-bottom));
		background: color-mix(in srgb, var(--paper) 94%, transparent);
		border-top: 1.5px solid var(--ink);
		backdrop-filter: blur(6px);
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		min-height: 48px;
		font-family: 'Caveat Variable', cursive;
		font-size: 15px;
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
		font-size: 14px;
	}
</style>
