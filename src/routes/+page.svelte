<script>
	import Header from '../components/Header.svelte';
	import ProductCard from '../components/ProductCard.svelte';
</script>

<div class="holder">
	<h1 class="category-title">Welcome to Our Store</h1>
	<a href="/home" class="start-button">Start Shopping</a>
</div>

<!-- <div class="product-row">
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
	</div> -->
<!-- </div> -->

<style>
	.start-button {
		background: orangered;
		font-size: 1.5rem;
		padding: 5px;
		border-radius: 6px;
		color: white;
	}
	.holder {
		padding: 10px;
		gap: 20px;
		align-items: center;
		justify-content: center;
		display: flex;
		flex-direction: column;
		align-self: center;
		height: 90vh;
	}
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
