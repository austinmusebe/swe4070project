<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '../components/Header.svelte';
	import CartPopup from '../components/CartPopup.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<Header />

{@render children?.()}

<CartPopup />
