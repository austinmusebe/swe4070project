<script>
	import { cart } from '../../stores/cart.js';
	import CartItem from '../../components/CartItem.svelte';
	import { goto } from '$app/navigation';

	let cartItems = $state([]);

	$effect(() => {
		cart.subscribe((items) => {
			cartItems = items;
		});
	});

	let total = $derived(cart.getTotal(cartItems));

	function proceedToCheckout() {
		if (cartItems.length > 0) {
			goto('/checkout');
		}
	}

	function clearCart() {
		cart.clear();
	}
</script>

<div class="cart-page-container">
	<div class="cart-header">
		<h1>Your Shopping Cart</h1>
		<p>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
	</div>

	{#if cartItems.length === 0}
		<div class="empty-cart-card">
			<span class="empty-icon">🛒</span>
			<h2>Your cart is empty</h2>
			<p>Looks like you haven't added anything to your cart yet.</p>
			<a href="/home" class="btn-shop">Start Shopping</a>
		</div>
	{:else}
		<div class="cart-grid">
			<div class="cart-items-card">
				<div class="items-header">
					<h2>Cart Items</h2>
					<button class="clear-btn" onclick={clearCart}>Clear Cart</button>
				</div>
				<div class="items-list">
					{#each cartItems as item}
						<CartItem {item} />
					{/each}
				</div>
			</div>

			<div class="cart-summary-sidebar">
				<div class="summary-card">
					<h2>Order Summary</h2>
					<div class="summary-row">
						<span>Subtotal</span>
						<span>${total.toFixed(2)}</span>
					</div>
					<div class="summary-row">
						<span>Estimated Shipping</span>
						<span>$5.00</span>
					</div>
					<div class="summary-row">
						<span>Estimated Tax</span>
						<span>${(total * 0.08).toFixed(2)}</span>
					</div>
					<div class="summary-divider"></div>
					<div class="summary-total">
						<span>Estimated Total</span>
						<span>${(total + 5 + total * 0.08).toFixed(2)}</span>
					</div>
					<button class="checkout-btn" onclick={proceedToCheckout}>
						Proceed to Checkout
					</button>
					<a href="/home" class="continue-link">← Continue Shopping</a>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background-color: #f5f5f5;
	}

	.cart-page-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 40px 20px;
		min-height: 80vh;
	}

	.cart-header {
		margin-bottom: 30px;
	}

	.cart-header h1 {
		margin: 0 0 8px 0;
		font-size: 2.2rem;
		color: #1a1a1a;
	}

	.cart-header p {
		margin: 0;
		color: #666;
		font-size: 1rem;
	}

	.empty-cart-card {
		background-color: white;
		border-radius: 12px;
		padding: 80px 20px;
		text-align: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 16px;
		display: block;
		opacity: 0.5;
	}

	.empty-cart-card h2 {
		margin: 0 0 8px 0;
		font-size: 1.5rem;
		color: #1a1a1a;
	}

	.empty-cart-card p {
		margin: 0 0 24px 0;
		color: #666;
	}

	.btn-shop {
		display: inline-block;
		background-color: #ff6b6b;
		color: white;
		text-decoration: none;
		padding: 12px 28px;
		border-radius: 8px;
		font-weight: 600;
		transition: background-color 0.2s;
	}

	.btn-shop:hover {
		background-color: #ff5252;
	}

	.cart-grid {
		display: grid;
		grid-template-columns: 1fr 380px;
		gap: 30px;
		align-items: flex-start;
	}

	.cart-items-card {
		background-color: white;
		border-radius: 12px;
		padding: 30px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.items-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
		padding-bottom: 16px;
		border-bottom: 1px solid #e0e0e0;
	}

	.items-header h2 {
		margin: 0;
		font-size: 1.4rem;
		color: #1a1a1a;
	}

	.clear-btn {
		background: none;
		border: none;
		color: #999;
		font-size: 0.9rem;
		cursor: pointer;
		padding: 4px 8px;
		transition: color 0.2s;
	}

	.clear-btn:hover {
		color: #ff6b6b;
	}

	.items-list {
		display: flex;
		flex-direction: column;
	}

	.cart-summary-sidebar {
		position: sticky;
		top: 20px;
	}

	.summary-card {
		background-color: white;
		border-radius: 12px;
		padding: 30px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.summary-card h2 {
		margin: 0 0 20px 0;
		font-size: 1.3rem;
		color: #1a1a1a;
		padding-bottom: 16px;
		border-bottom: 1px solid #e0e0e0;
	}

	.summary-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 14px;
		color: #666;
		font-size: 0.95rem;
	}

	.summary-divider {
		height: 1px;
		background-color: #e0e0e0;
		margin: 16px 0;
	}

	.summary-total {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
		font-size: 1.2rem;
		font-weight: 700;
		color: #1a1a1a;
	}

	.summary-total span:last-child {
		color: #ff6b6b;
		font-size: 1.5rem;
	}

	.checkout-btn {
		width: 100%;
		background-color: #ff6b6b;
		color: white;
		border: none;
		padding: 16px;
		border-radius: 10px;
		font-size: 1.05rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
		margin-bottom: 16px;
	}

	.checkout-btn:hover {
		background-color: #ff5252;
	}

	.continue-link {
		display: block;
		text-align: center;
		color: #666;
		text-decoration: none;
		font-size: 0.95rem;
		font-weight: 500;
		transition: color 0.2s;
	}

	.continue-link:hover {
		color: #ff6b6b;
	}

	@media (max-width: 900px) {
		.cart-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
