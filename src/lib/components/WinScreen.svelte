<script lang="ts">
	import { trapFocus } from '../actions/trapFocus';
	import MendeleevDoodle from './MendeleevDoodle.svelte';
	import { game, markCertificateSeen, resetGame } from '../stores/game';

	let { onClose }: { onClose: () => void } = $props();

	let confirming = $state(false);
	let shareMessage = $state('');

	const stats = $derived(
		$game.completionStats ?? {
			attempts: $game.attempts,
			startedAt: $game.startedAt,
			completedAt: $game.completedAt ?? Date.now(),
			elapsedMs: ($game.completedAt ?? Date.now()) - $game.startedAt
		}
	);

	const elapsed = $derived.by(() => {
		const total = Math.max(0, Math.round(stats.elapsedMs / 1000));
		const minutes = Math.floor(total / 60);
		const seconds = total % 60;
		return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
	});

	function keepLooking(): void {
		markCertificateSeen();
		onClose();
	}

	function startOver(): void {
		resetGame();
		onClose();
	}

	async function share(): Promise<void> {
		const text = `Mendeleev's Mess — 118 / 118 elements forged in ${stats.attempts} attempts (${elapsed}).`;
		const writeText = navigator.clipboard?.writeText?.bind(navigator.clipboard);
		if (!writeText) {
			window.prompt('Copy this:', text);
			shareMessage = 'Ready to copy.';
			return;
		}

		try {
			await writeText(text);
			shareMessage = 'Copied to the clipboard.';
		} catch {
			window.prompt('Copy this:', text);
			shareMessage = 'Ready to copy.';
		}
	}
</script>

<div class="backdrop">
	<div class="certificate" use:trapFocus role="dialog" aria-modal="true" aria-label="Certificate">
		<div class="mascot"><MendeleevDoodle /></div>
		<p class="kicker">Mendeleev’s Mess</p>
		<h2>Certificate of Complete Chaos</h2>
		<p class="score">118 / 118</p>
		<p class="line">The periodic table has been thoroughly rummaged through.</p>

		<dl>
			<div>
				<dt>Attempts</dt>
				<dd>{stats.attempts}</dd>
			</div>
			<div>
				<dt>Elapsed</dt>
				<dd>{elapsed}</dd>
			</div>
			<div>
				<dt>Started</dt>
				<dd>{new Date(stats.startedAt).toLocaleDateString()}</dd>
			</div>
		</dl>

		<p class="signature marker">— Mendeleev, allegedly</p>

		{#if shareMessage}
			<p class="share-message" role="status">{shareMessage}</p>
		{/if}

		<div class="actions">
			<button class="primary" type="button" onclick={keepLooking}>Keep looking</button>
			{#if confirming}
				<button class="danger" type="button" onclick={startOver}>Yes, start over</button>
				<button type="button" onclick={() => (confirming = false)}>Cancel</button>
			{:else}
				<button type="button" onclick={() => (confirming = true)}>Start over</button>
			{/if}
			<button type="button" onclick={share}>Share</button>
		</div>
	</div>
</div>

<style>
	.mascot {
		display: flex;
		justify-content: center;
		margin-bottom: -8px;
	}
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 30;
		display: grid;
		place-items: center;
		padding: 22px;
		background: rgba(43, 43, 43, 0.45);
		backdrop-filter: blur(2px);
	}

	.certificate {
		position: relative;
		width: min(360px, 100%);
		padding: 26px 22px 18px;
		background: var(--paper);
		border: 3px double var(--ink);
		border-radius: 4px 12px 6px 14px / 12px 6px 14px 4px;
		box-shadow: 10px 10px 0 rgba(43, 43, 43, 0.3);
		text-align: center;
	}

	.kicker {
		margin: 0;
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	h2 {
		margin: 8px 0 4px;
		font-size: 1.9rem;
	}

	.score {
		margin: 10px 0 0;
		font-family: 'Caveat Variable', cursive;
		font-size: 3rem;
		font-weight: 700;
		line-height: 1;
		color: var(--red);
	}

	.line {
		margin: 8px 0 18px;
		font-size: 13px;
		font-style: italic;
		color: var(--ink-soft);
	}

	dl {
		display: grid;
		gap: 6px;
		margin: 0 10px 16px;
		padding: 12px;
		background: var(--paper-deep);
		border-radius: 6px;
	}

	dl div {
		display: flex;
		justify-content: space-between;
		gap: 10px;
	}

	dt {
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--ink-soft);
	}

	dd {
		margin: 0;
		font-weight: 700;
	}

	.signature {
		margin: 0 0 18px;
		font-size: 17px;
		color: var(--ink-soft);
		transform: rotate(-1.5deg);
	}

	.share-message {
		margin: 0 0 10px;
		font-size: 12px;
		color: var(--ink-soft);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}

	button {
		min-height: 44px;
		padding: 6px 12px;
		font-size: 13px;
		background: var(--card);
		border: 1.5px solid var(--ink);
		border-radius: 6px 9px 5px 10px;
	}

	button.primary {
		color: var(--paper);
		background: var(--ink);
	}

	button.danger {
		color: #fff;
		background: var(--red);
		border-color: var(--red);
	}
</style>
