<script lang="ts">
	import { exportSave, game, importSave, resetGame, updateSettings } from '../stores/game';
	import { installPrompt } from '../stores/install';

	let { onShowCertificate }: { onShowCertificate?: () => void } = $props();

	let confirmingReset = $state(false);
	let transferMessage = $state('');

	const version = '0.1.0';

	async function install(): Promise<void> {
		if (!$installPrompt) return;
		await $installPrompt.prompt();
		installPrompt.set(null);
	}

	function download(): void {
		const blob = new Blob([exportSave()], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'mendeleevs-mess-save.json';
		link.click();
		URL.revokeObjectURL(url);
	}

	async function importFile(event: Event): Promise<void> {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const text = await file.text();
		transferMessage = importSave(text) ? 'Save imported.' : 'That file is not a valid save.';
		input.value = '';
	}

	function erase(): void {
		resetGame();
		confirmingReset = false;
		transferMessage = 'Progress erased.';
	}
</script>

<main class="app">
	<header class="top">
		<h1>Settings</h1>
		<p class="subtitle">Sound, motion, and the paperwork of a small laboratory.</p>
	</header>

	<section class="panel">
		<h2>Comfort</h2>

		<label class="toggle">
			<input
				type="checkbox"
				checked={$game.settings.sound}
				onchange={(event) => updateSettings({ sound: event.currentTarget.checked })}
			/>
			<span>
				<strong>Sound</strong>
				<small>Short lab noises. No music.</small>
			</span>
		</label>

		<label class="toggle">
			<input
				type="checkbox"
				checked={$game.settings.reduceMotion}
				onchange={(event) => updateSettings({ reduceMotion: event.currentTarget.checked })}
			/>
			<span>
				<strong>Reduce motion</strong>
				<small>Skip the wobbles and card flights.</small>
			</span>
		</label>
	</section>

	<section class="panel">
		<h2>Install</h2>
		{#if $installPrompt}
			<p class="copy">Keep the laboratory on your home screen.</p>
			<button type="button" onclick={install}>Install app</button>
		{:else}
			<p class="copy">
				On iPhone or iPad, use <strong>Share → Add to Home Screen</strong>. On desktop Chrome, use
				the install icon in the address bar.
			</p>
		{/if}
	</section>

	<section class="panel">
		<h2>Progress</h2>
		<p class="copy">
			{$game.discovered.length} of 118 elements discovered. Attempts: {$game.attempts}.
		</p>

		{#if $game.completedAt && onShowCertificate}
			<button type="button" onclick={onShowCertificate}>View certificate</button>
		{/if}

		<div class="transfer">
			<button type="button" onclick={download}>Export save</button>
			<label class="file">
				<span>Import save</span>
				<input type="file" accept="application/json,.json" onchange={importFile} />
			</label>
		</div>

		{#if transferMessage}
			<p class="message" role="status">{transferMessage}</p>
		{/if}
	</section>

	<section class="panel">
		<h2>Erase</h2>
		{#if confirmingReset}
			<p class="copy">This deletes every discovery and starts again from one hydrogen.</p>
			<div class="transfer">
				<button class="danger" type="button" onclick={erase}>Yes, erase it</button>
				<button type="button" onclick={() => (confirmingReset = false)}>Cancel</button>
			</div>
		{:else}
			<button type="button" onclick={() => (confirmingReset = true)}>Reset progress</button>
		{/if}
	</section>

	<section class="panel about">
		<h2>About</h2>
		<p class="copy">
			Mendeleev's Mess v{version}. Made with too much hydrogen. Element data is real; the recipes
			are not.
		</p>
	</section>
</main>

<style>
	.top {
		padding: 8px 2px 16px;
	}

	h1 {
		font-size: clamp(2rem, 8vw, 3rem);
	}

	.subtitle {
		margin: 4px 0 0;
		font-size: 12px;
		max-width: 280px;
	}

	.panel {
		margin-bottom: 14px;
		padding: 14px 16px;
		background: rgba(255, 253, 245, 0.62);
		border: 1.5px solid var(--ink);
		border-radius: 8px 12px 6px 14px / 12px 6px 14px 8px;
	}

	h2 {
		margin: 0 0 10px;
		font-size: 1.35rem;
	}

	.toggle {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		margin-bottom: 10px;
		cursor: pointer;
	}

	.toggle input {
		width: 24px;
		height: 24px;
		margin-top: 2px;
		accent-color: var(--ink);
	}

	.toggle span {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.toggle small {
		font-size: 11px;
		color: var(--ink-soft);
	}

	.copy {
		margin: 0 0 10px;
		font-size: 13px;
		color: var(--ink-soft);
	}

	button {
		min-height: 44px;
		padding: 6px 12px;
		font-size: 13px;
		background: var(--card);
		border: 1.5px solid var(--ink);
		border-radius: 6px 9px 5px 10px;
	}

	button.danger {
		color: #fff;
		background: var(--red);
		border-color: var(--red);
	}

	.transfer {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 10px;
	}

	.file {
		display: flex;
		flex-direction: column;
		gap: 2px;
		font-size: 11px;
		color: var(--ink-soft);
	}

	.file input {
		min-height: 44px;
		font-size: 16px;
	}

	.message {
		margin: 10px 0 0;
		font-size: 12px;
		color: var(--blue);
	}

	.about .copy {
		margin-bottom: 0;
	}
</style>
