<script>
	import { text } from '@sveltejs/kit';
	import Button from './Button.svelte';

	let count = $state(0);
	let product = {
		name: 'Product',
		price: 0,
		image: '',
		description: ''
	};
</script>

<div>
	<div class="product-card">
		<div class="top-card">
			<!-- We're going to have an image here I guess -->
			{#if product.image}
				<img src={product.image} alt={product.name} />
			{:else}
				<div class="placeholder">No Image</div>
			{/if}
		</div>
		<div class="bottom-card">
			<h3>{product.name}</h3>
			<p class="price">${product.price}</p>
			<p class="description">{product.description}</p>
			<!-- We have detials about the items here. -->
		</div>
	</div>
	<div class="quantity-buy">
		<!-- We have the quanitty selector and  a buy button-->
		<div class="change-quantity">
			<button class="increment" onclick={() => count++}>+</button>
			<p class="item-count">{count}</p>
			<button class="decrement" onclick={() => count--}>-</button>
		</div>
		<Button text="Add to Cart" />
	</div>
</div>

<style>
	.product-card {
		border: 1px solid #ddd;
		border-radius: 8px;
		overflow: auto;
		align-items: center;
		justify-content: center;
		display: flex;
		overflow: auto;
		flex-direction: column;
	}
	.top-card {
		background-color: black;
		height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	.top-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.placeholder {
		color: #999;
	}
	.bottom-card {
		background-color: grey;
		padding: 1rem;
		color: white;
		width: 100%;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}
	.price {
		font-weight: bold;
		font-size: 1rem;
	}
	button {
		background-color: orangered;
		color: white;
		border-radius: 8px;
		padding: 5px;
	}
	.increment {
		border-radius: 16px;
		padding: 4px;
	}
	.decrement {
		border-radius: 16px;
		padding: 5px;
	}
	.quantity-buy {
		align-items: center;
		justify-content: center;
		display: flex;
		flex-direction: column;
	}
	.change-quantity {
		display: flex;
		flex-direction: row;
		gap: 10px;
		padding: 10px;
		align-items: center;
	}
</style>
