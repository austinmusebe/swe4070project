<script>
	import ProductCard from '../../components/ProductCard.svelte';
	import CartPopup from '../../components/CartPopup.svelte';
	import { isCartOpen } from '../../stores/cart.js';

	// Sample products - replace with real data
	let products = [
		{
			id: '1',
			name: 'Premium Headphones',
			price: 99.99,
			image: '',
			description: 'High-quality audio'
		},
		{ id: '2', name: 'Smart Watch', price: 199.99, image: '', description: 'Track your fitness' },
		{
			id: '3',
			name: 'Wireless Keyboard',
			price: 79.99,
			image: '',
			description: 'Mechanical switches'
		},
		{ id: '4', name: 'USB-C Cable', price: 19.99, image: '', description: 'Fast charging' }
	];

	function openCart() {
		isCartOpen.set(true);
	}
</script>

<div class="container">
	<div class="header-section">
		<h1>Our Products</h1>
		<button class="view-cart-btn" onclick={openCart}>
			<span>🛒</span>
			View Cart
		</button>
	</div>

	<div class="product-section">
		{#each products as product}
			<ProductCard {product} />
		{/each}
	</div>
</div>

<CartPopup />

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 40px 20px;
	}

	.header-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
	}

	.header-section h1 {
		margin: 0;
		font-size: 2rem;
		color: #1a1a1a;
	}

	.view-cart-btn {
		background-color: #ff6b6b;
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 10px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
		transition: background-color 0.2s;
	}

	.view-cart-btn:hover {
		background-color: #ff5252;
	}

	.view-cart-btn span {
		font-size: 1.2rem;
	}

	.product-section {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 30px;
	}

	@media (max-width: 768px) {
		.header-section {
			flex-direction: column;
			gap: 16px;
			align-items: flex-start;
		}

		.view-cart-btn {
			width: 100%;
			justify-content: center;
		}
	}
</style>
