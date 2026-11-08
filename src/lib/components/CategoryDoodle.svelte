<script lang="ts">
	import type { Category } from '../types';

	let { category }: { category: Category } = $props();
</script>

<svg
	class="doodle"
	viewBox="0 0 64 64"
	aria-hidden="true"
	fill="none"
	stroke="currentColor"
	stroke-width="2.2"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	{#if category === 'alkali-metal'}
		<path d="M12 44c6-18 16-26 28-26 7 0 12 4 12 10 0 9-10 16-24 16-9 0-16 3-16 8 0 3 3 5 8 5" />
		<circle cx="46" cy="18" r="3" />
	{:else if category === 'alkaline-earth-metal'}
		<path d="M10 50l12-26 10 16 8-12 14 22z" />
		<path d="M22 24l-4-8M32 40l3-7" />
	{:else if category === 'transition-metal'}
		<rect x="14" y="14" width="36" height="36" rx="4" transform="rotate(12 32 32)" />
		<path d="M22 32h20M32 22v20" />
	{:else if category === 'post-transition-metal'}
		<path d="M14 48l18-34 18 34z" />
		<path d="M24 40h16" />
	{:else if category === 'metalloid'}
		<path d="M32 8l18 12v24L32 56 14 44V20z" />
		<path d="M32 20v24M22 28l20 16" />
	{:else if category === 'reactive-nonmetal'}
		<circle cx="32" cy="32" r="18" />
		<path d="M14 32h36M32 14c8 8 8 28 0 36M32 14c-8 8-8 28 0 36" />
	{:else if category === 'halogen'}
		<path d="M18 18l28 28M46 18L18 46" />
		<circle cx="32" cy="32" r="6" fill="currentColor" stroke="none" />
	{:else if category === 'noble-gas'}
		<circle cx="32" cy="32" r="18" />
		<circle cx="32" cy="32" r="5" fill="currentColor" stroke="none" />
		<path d="M42 22l4-4M48 32h6M42 42l4 4" />
	{:else if category === 'lanthanide'}
		<path d="M12 40c8-14 20-22 32-22 5 0 8 2 8 6 0 6-8 11-20 11-8 0-14 3-14 8 0 4 4 6 10 6" />
		<path d="M42 18l2-6M50 24l6-3" />
	{:else}
		<path d="M32 8v12M14 20l8 8M50 20l-8 8M10 40h12M42 40h12M20 52l6-6M44 52l-6-6" />
		<circle cx="32" cy="34" r="8" />
	{/if}
</svg>

<style>
	.doodle {
		width: 52px;
		height: 52px;
		color: var(--ink-soft);
		opacity: 0.7;
	}
</style>
