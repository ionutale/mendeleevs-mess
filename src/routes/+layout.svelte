<script lang="ts">
	import '@fontsource-variable/caveat';
	import '@fontsource-variable/nunito';
	import '../lib/styles/base.css';
	import favicon from '../lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Mendeleev's Mess</title>
</svelte:head>

{@render children()}
