<script lang="ts">
	import type { ScrapEntry } from '../types';

	let { entries, onClear }: { entries: readonly ScrapEntry[]; onClear: () => void } = $props();
</script>

<details class="scrap" open>
	<summary>
		<span class="marker">Failed experiments</span>
		<span class="count">{entries.length}</span>
	</summary>

	{#if entries.length > 0}
		<ul>
			{#each entries as entry (entry.at + entry.pair.join(''))}
				<li>{entry.pair[0]} + {entry.pair[1]}</li>
			{/each}
		</ul>
		<button type="button" onclick={onClear}>Clear failed experiments</button>
	{:else}
		<p class="empty">No failed experiments. Suspicious.</p>
	{/if}
</details>

<style>
	.scrap {
		margin-top: 22px;
		padding: 10px 14px;
		background: rgba(255, 253, 245, 0.55);
		border: 1.5px dashed #9aa7b8;
		border-radius: 8px;
	}

	summary {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
		cursor: pointer;
	}

	summary::marker {
		color: var(--ink-soft);
	}

	.marker {
		font-family: 'Caveat Variable', cursive;
		font-size: 18px;
		font-weight: 700;
	}

	.count {
		font-size: 11px;
		color: var(--ink-soft);
	}

	ul {
		margin: 10px 0 12px;
		padding-left: 20px;
		font-size: 14px;
		color: var(--ink-soft);
	}

	li {
		margin-bottom: 3px;
	}

	button {
		min-height: 36px;
		padding: 4px 10px;
		font-size: 12px;
		background: var(--card);
		border: 1.5px solid var(--ink);
		border-radius: 5px;
	}

	.empty {
		margin: 10px 0 2px;
		font-size: 13px;
		color: var(--ink-soft);
	}
</style>
