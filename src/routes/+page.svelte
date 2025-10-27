<script>
	import Header from '../components/Header.svelte';
	import ProductCard from '../components/ProductCard.svelte';
</script>

<div class="product-holder">
	<ProductCard />
	<ProductCard />
</div>
<h1 class="title">Welcome to SvelteKit, Rabira</h1>
<p class="p-4 text-base text-gray-400">
	Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
</p>

<style>
	.product-holder {
		display: flex;
		flex-direction: row;
		gap: 10px;
		align-items: center;
		justify-content: center;
		padding-top: 10px;
	}
</style>
