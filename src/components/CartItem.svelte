<script>
	import { cart } from '../stores/cart.js';

	let { item } = $props();

	function updateQuantity(quantity) {
		cart.updateQuantity(item.product.id, quantity);
	}

	function removeItem() {
		cart.removeItem(item.product.id);
	}
</script>

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
		<button class="qty-btn" onclick={() => updateQuantity(item.quantity - 1)} aria-label="Decrease quantity">
			-
		</button>
		<span>{item.quantity}</span>
		<button class="qty-btn" onclick={() => updateQuantity(item.quantity + 1)} aria-label="Increase quantity">
			+
		</button>
	</div>
	<div class="item-total">
		<p>${(item.product.price * item.quantity).toFixed(2)}</p>
	</div>
	<button class="remove-btn" onclick={removeItem} aria-label="Remove item">🗑️</button>
</div>

<style>
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

	@media (max-width: 568px) {
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
