<script lang="ts">
	import { onMount } from 'svelte';
	import App from '../lib/components/App.svelte';
	import { initGame } from '../lib/stores/game';

	onMount(() => {
		initGame();
	});
</script>

<App />
