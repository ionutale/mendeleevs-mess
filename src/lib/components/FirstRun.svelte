<script lang="ts">
	import { dismissIntro } from '../stores/game';
</script>

<div class="backdrop">
	<div class="intro" role="dialog" aria-modal="true" aria-label="Welcome to Mendeleev's Mess">
		<p class="kicker">A note from the lab</p>
		<h2>You have one hydrogen.</h2>
		<p class="copy">
			The rest of the periodic table is a rumour. Combine two elements, press Forge, and see what
			the universe admits to.
		</p>
		<p class="copy small">No hints. No timer. Just a suspicious amount of curiosity.</p>
		<button type="button" onclick={dismissIntro}>Get started</button>
	</div>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 40;
		display: grid;
		place-items: center;
		padding: 24px;
		background: rgba(43, 43, 43, 0.38);
		backdrop-filter: blur(2px);
	}

	.intro {
		width: min(360px, 100%);
		padding: 30px 24px 24px;
		background: var(--paper);
		border: 2px solid var(--ink);
		border-radius: 4px 12px 6px 14px / 12px 6px 14px 4px;
		box-shadow: 8px 8px 0 rgba(43, 43, 43, 0.25);
		text-align: left;
	}

	.kicker {
		margin: 0;
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	h2 {
		margin: 6px 0 12px;
		font-size: 2.2rem;
	}

	.copy {
		margin: 0 0 12px;
		font-size: 15px;
	}

	.small {
		font-size: 13px;
		color: var(--ink-soft);
	}

	button {
		width: 100%;
		min-height: 48px;
		margin-top: 8px;
		font-family: 'Caveat Variable', cursive;
		font-size: 22px;
		font-weight: 700;
		color: var(--paper);
		background: var(--ink);
		border: 0;
		border-radius: 8px 12px 6px 14px / 12px 6px 14px 8px;
	}
</style>
