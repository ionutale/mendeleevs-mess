<script lang="ts">
	import { ELEMENTS } from '../data/elements';
	import { FAILURE_LINES } from '../data/failures';
	import { playSound } from '../game/sound';
	import { forgePair, game } from '../stores/game';
	import type { ElementRecord } from '../types';
	import DiscoveryOverlay from './DiscoveryOverlay.svelte';
	import Slot from './Slot.svelte';
	import Tray from './Tray.svelte';

	let slots = $state<[string | null, string | null]>([null, null]);
	let busy = $state(false);
	let discovered = $state<ElementRecord | null>(null);
	let message = $state('');
	let timer: ReturnType<typeof setTimeout> | undefined;

	const tray = $derived(ELEMENTS.filter((element) => $game.discovered.includes(element.symbol)));
	const ready = $derived(Boolean(slots[0] && slots[1]) && !busy);

	function pick(symbol: string): void {
		if (busy) return;
		if (!slots[0]) {
			slots[0] = symbol;
			playSound('pick', $game.settings.sound);
		} else if (!slots[1]) {
			slots[1] = symbol;
			playSound('pick', $game.settings.sound);
		}
		message = '';
	}

	function clearSlot(index: 1 | 2): void {
		slots[index - 1] = null;
		message = '';
	}

	function dropInto(index: 1 | 2, symbol: string): void {
		if (busy) return;
		slots[index - 1] = symbol;
		message = '';
	}

	function forge(): void {
		if (!ready) return;

		busy = true;
		playSound('forge', $game.settings.sound);
		const outcome = forgePair(slots[0]!, slots[1]!);

		if (outcome.kind === 'new') {
			discovered = outcome.element;
			message = '';
			playSound('stamp', $game.settings.sound);
		} else if (outcome.kind === 'known') {
			message = 'Already in the notebook.';
		} else {
			message = FAILURE_LINES[Math.floor(Math.random() * FAILURE_LINES.length)];
			playSound('fail', $game.settings.sound);
		}

		clearTimeout(timer);
		timer = setTimeout(() => {
			busy = false;
		}, 400);
	}

	function closeDiscovery(): void {
		discovered = null;
		slots = [null, null];
	}
</script>

<main class="app">
	<header class="top">
		<h1>Mendeleev's Mess</h1>
		<p class="progress" aria-label="Elements discovered">
			{$game.discovered.length} / {ELEMENTS.length}
		</p>
	</header>

	<section class="bench" aria-label="Forge">
		<p class="side-note marker">combine two. regret nothing.</p>

		<div class="slots">
			<Slot
				symbol={slots[0]}
				index={1}
				onClear={() => clearSlot(1)}
				onDrop={(symbol) => dropInto(1, symbol)}
			/>
			<span class="plus marker" aria-hidden="true">+</span>
			<Slot
				symbol={slots[1]}
				index={2}
				onClear={() => clearSlot(2)}
				onDrop={(symbol) => dropInto(2, symbol)}
			/>
		</div>

		<button class="forge" type="button" disabled={!ready} onclick={forge}>
			{busy ? 'Forging…' : 'Forge'}
		</button>

		{#if message}
			<p class="message" role="status">{message}</p>
		{/if}
	</section>

	<Tray elements={tray} onPick={pick} />
</main>

{#if discovered}
	<DiscoveryOverlay element={discovered} onClose={closeDiscovery} />
{/if}

<style>
	.top {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 12px;
		padding: 8px 2px 18px;
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
	}

	.bench {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 420px;
		padding: 18px 12px 26px;
	}

	.side-note {
		margin: 0 0 18px;
		font-size: 15px;
		color: var(--ink-soft);
		transform: rotate(-1deg);
	}

	.slots {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.plus {
		font-size: 30px;
		color: var(--ink-soft);
	}

	.forge {
		min-height: 52px;
		margin-top: 22px;
		padding: 10px 42px;
		font-family: 'Caveat Variable', cursive;
		font-size: 26px;
		font-weight: 700;
		letter-spacing: 0.03em;
		color: var(--paper);
		background: var(--ink);
		border: 0;
		border-radius: 10px 15px 8px 17px / 15px 8px 17px 10px;
		box-shadow: 4px 4px 0 rgba(43, 43, 43, 0.22);
		transition:
			transform 140ms ease,
			background 140ms ease;
	}

	.forge:hover:not(:disabled) {
		transform: translateY(-2px) rotate(-0.5deg);
	}

	.forge:disabled {
		cursor: not-allowed;
		opacity: 0.4;
		box-shadow: none;
	}

	.message {
		max-width: 300px;
		margin: 18px 0 0;
		padding: 6px 12px;
		font-size: 14px;
		color: var(--ink-soft);
		text-align: center;
		background: var(--paper-deep);
		border-radius: 8px;
		transform: rotate(-0.4deg);
	}

	@media (prefers-reduced-motion: reduce) {
		.forge {
			transition: none;
		}
	}
</style>
