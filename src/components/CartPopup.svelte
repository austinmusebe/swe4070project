<script>
	import { cart, isCartOpen } from '../stores/cart.js';
	import { goto } from '$app/navigation';

	let cartItems = $state([]);
	let showCart = $state(false);

	$effect(() => {
		cart.subscribe((items) => {
			cartItems = items;
		});
	});

	$effect(() => {
		isCartOpen.subscribe((value) => {
			showCart = value;
		});
	});

	function closeCart() {
		isCartOpen.set(false);
	}

	function removeItem(productId) {
		cart.removeItem(productId);
	}

	function updateQuantity(productId, quantity) {
		cart.updateQuantity(productId, quantity);
	}

	function proceedToCheckout() {
		if (cartItems.length > 0) {
			isCartOpen.set(false);
			goto('/checkout');
		}
	}

	// Changed from $: to $derived
	let total = $derived(cart.getTotal(cartItems));
</script>

{#if showCart}
	<div class="cart-overlay" onclick={closeCart} role="button" tabindex="0">
		<div class="cart-popup" onclick={(e) => e.stopPropagation()} role="dialog">
			<div class="cart-header">
				<h2>Shopping Cart ({cartItems.length})</h2>
				<button class="close-btn" onclick={closeCart}>✕</button>
			</div>

			<div class="cart-body">
				{#if cartItems.length === 0}
					<div class="empty-cart">
						<span class="empty-icon">🛒</span>
						<p>Your cart is empty</p>
						<button class="continue-shopping" onclick={closeCart}> Continue Shopping </button>
					</div>
				{:else}
					<div class="cart-items">
						{#each cartItems as item}
							<div class="cart-item">
								<div class="item-image">
									{#if item.product.image}
										<img src={item.product.image} alt={item.product.name} />
									{:else}
										<div class="placeholder-small">No Image</div>
									{/if}
								</div>
								<div class="item-details">
									<h3>{item.product.name}</h3>
									<p class="item-price">${item.product.price.toFixed(2)}</p>
								</div>
								<div class="item-quantity">
									<button
										class="qty-btn"
										onclick={() => updateQuantity(item.product.id, item.quantity - 1)}
									>
										-
									</button>
									<span>{item.quantity}</span>
									<button
										class="qty-btn"
										onclick={() => updateQuantity(item.product.id, item.quantity + 1)}
									>
										+
									</button>
								</div>
								<div class="item-total">
									<p>${(item.product.price * item.quantity).toFixed(2)}</p>
								</div>
								<button class="remove-btn" onclick={() => removeItem(item.product.id)}> 🗑️ </button>
							</div>
						{/each}
					</div>

					<div class="cart-footer">
						<div class="cart-total">
							<span>Total:</span>
							<span class="total-amount">${total.toFixed(2)}</span>
						</div>
						<button class="checkout-btn" onclick={proceedToCheckout}> Proceed to Checkout </button>
						<button class="continue-btn" onclick={closeCart}> Continue Shopping </button>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.cart-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 1000;
		display: flex;
		justify-content: flex-end;
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.cart-popup {
		width: 100%;
		max-width: 500px;
		background-color: white;
		box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		animation: slideIn 0.3s ease-out;
		max-height: 100vh;
	}

	@keyframes slideIn {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}

	.cart-header {
		padding: 24px;
		border-bottom: 1px solid #e0e0e0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #1a1a1a;
		color: white;
	}

	.cart-header h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
	}

	.close-btn {
		background: none;
		border: none;
		color: white;
		font-size: 1.8rem;
		cursor: pointer;
		padding: 0;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: background-color 0.2s;
	}

	.close-btn:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	.cart-body {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	.empty-cart {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60px 24px;
		text-align: center;
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 16px;
		opacity: 0.5;
	}

	.empty-cart p {
		color: #666;
		font-size: 1.1rem;
		margin: 0 0 24px 0;
	}

	.continue-shopping {
		background-color: #ff6b6b;
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.continue-shopping:hover {
		background-color: #ff5252;
	}

	.cart-items {
		flex: 1;
		padding: 16px;
	}

	.cart-item {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 16px;
		background-color: #f8f8f8;
		border-radius: 12px;
		margin-bottom: 12px;
	}

	.item-image {
		width: 60px;
		height: 60px;
		background-color: black;
		border-radius: 8px;
		overflow: hidden;
		flex-shrink: 0;
	}

	.item-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder-small {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #999;
		font-size: 0.7rem;
		text-align: center;
	}

	.item-details {
		flex: 1;
		min-width: 0;
	}

	.item-details h3 {
		margin: 0 0 4px 0;
		font-size: 1rem;
		color: #1a1a1a;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.item-price {
		margin: 0;
		color: #666;
		font-size: 0.9rem;
	}

	.item-quantity {
		display: flex;
		align-items: center;
		gap: 8px;
		background-color: white;
		border-radius: 8px;
		padding: 4px;
	}

	.qty-btn {
		width: 28px;
		height: 28px;
		background-color: #ff6b6b;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s;
	}

	.qty-btn:hover {
		background-color: #ff5252;
	}

	.item-quantity span {
		min-width: 24px;
		text-align: center;
		font-weight: 600;
	}

	.item-total {
		font-weight: 700;
		color: #1a1a1a;
		font-size: 1.1rem;
	}

	.item-total p {
		margin: 0;
	}

	.remove-btn {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1.2rem;
		padding: 8px;
		opacity: 0.6;
		transition: opacity 0.2s;
	}

	.remove-btn:hover {
		opacity: 1;
	}

	.cart-footer {
		padding: 24px;
		border-top: 2px solid #e0e0e0;
		background-color: white;
	}

	.cart-total {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		font-size: 1.2rem;
	}

	.total-amount {
		font-size: 1.8rem;
		font-weight: 700;
		color: #ff6b6b;
	}

	.checkout-btn {
		width: 100%;
		background-color: #ff6b6b;
		color: white;
		border: none;
		padding: 16px;
		border-radius: 10px;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		margin-bottom: 12px;
		transition: background-color 0.2s;
	}

	.checkout-btn:hover {
		background-color: #ff5252;
	}

	.continue-btn {
		width: 100%;
		background-color: white;
		color: #666;
		border: 2px solid #e0e0e0;
		padding: 14px;
		border-radius: 10px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.continue-btn:hover {
		border-color: #ccc;
		color: #333;
	}

	@media (max-width: 568px) {
		.cart-popup {
			max-width: 100%;
		}

		.cart-item {
			flex-wrap: wrap;
		}

		.item-total {
			order: 4;
			width: 100%;
			text-align: right;
			margin-top: 8px;
		}
	}
</style>
