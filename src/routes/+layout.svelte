<script lang="ts">
	import '@fontsource-variable/caveat';
	import '@fontsource-variable/nunito';
	import '../lib/styles/base.css';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<title>Mendeleev's Mess</title>
</svelte:head>

{@render children()}
