<script>
	import Header from '../components/Header.svelte';
	import ProductCard from '../components/ProductCard.svelte';
</script>

<h1 class="category-title">Default Landing Page</h1>
<div class="product-row">
	<h1 class="category-title">Category 1</h1>
	<div class="product-holder">
		<ProductCard />
		<ProductCard />
	</div>
</div>
<div class="product-row">
	<h1 class="category-title">Category 2</h1>
	<div class="product-holder">
		<ProductCard />
		<ProductCard />
	</div>
</div>
<div class="product-row">
	<h1 class="category-title">Category 3</h1>
	<div class="product-holder">
		<ProductCard />
		<ProductCard />
	</div>
</div>

<style>
	.product-holder {
		display: flex;
		flex-direction: row;
		gap: 10px;
		align-items: center;
		justify-content: center;
		padding-top: 10px;
	}
	.product-row {
		align-items: center;
		justify-content: center;
		display: flex;
		flex-direction: column;
	}
	.category-title {
		font-size: 2rem;
		color: orangered;
	}
</style>
