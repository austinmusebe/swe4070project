<script>
	import Header from '../../components/Header.svelte';
	import ProductCard from '../../components/ProductCard.svelte';
</script>

<!-- // Browse products -->
<div class="product-section">
	<ProductCard />
	<ProductCard />
	<ProductCard />
	<ProductCard />
</div>

<style>
	.product-section {
		display: flex;
		flex-direction: row;
		gap: 70px;
		padding-top: 10px;
		align-items: center;
		justify-content: center;
	}
</style>
