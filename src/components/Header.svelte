<script>
	import Button from './Button.svelte';
	import { currentUser } from '../stores/user.js';
	import { cart, isCartOpen } from '../stores/cart.js';
	import { goto } from '$app/navigation';

	let user = $state(null);
	let cartItems = $state([]);

	$effect(() => {
		currentUser.subscribe((u) => {
			user = u;
		});
	});

	$effect(() => {
		cart.subscribe((items) => {
			cartItems = items;
		});
	});

	let cartCount = $derived(cartItems.reduce((sum, item) => sum + item.quantity, 0));

	function handleLogout() {
		currentUser.logout();
		goto('/login');
	}

	function openCart() {
		isCartOpen.set(true);
	}
</script>

<header>
	<nav>
		<ul class="header-content">
			<li class="business"><a href="/home">SCAMMER SHOP</a></li>
			<div class="nav-links">
				<a href="/home">Home</a>
				<button class="btn-cart" onclick={openCart}>
					🛒 Cart
					{#if cartCount > 0}
						<span class="cart-badge">{cartCount}</span>
					{/if}
				</button>
				{#if user}
					<a href="/account">Manage Account</a>
					<span class="user-greeting">Hello, {user.name.split(' ')[0]}</span>
					<button class="btn-logout" onclick={handleLogout}>Logout</button>
				{:else}
					<a href="/login">Sign In</a>
					<a href="/register" class="btn-register">Get Started</a>
				{/if}
			</div>
		</ul>
	</nav>
</header>

<style>
	header {
		background-color: #dddddd;
	}
	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		list-style: none;
		margin: 0;
	}
	.business {
		font-size: 2rem;
		white-space: nowrap;
		padding-left: 10px;
	}
	.business a {
		color: orangered;
		font-weight: 800;
	}
	.nav-links {
		display: flex;
		gap: 20px;
		padding-right: 10px;
		align-items: center;
	}
	.nav-links a {
		text-decoration: none;
		color: #333;
		font-weight: 500;
		padding: 8px 16px;
		border-radius: 8px;
		transition: all 0.2s;
	}
	.nav-links a:hover {
		text-decoration: underline;
		color: #ff6b6b;
	}
	.btn-register {
		background-color: #1a1a1a;
		color: white !important;
	}

	.btn-register:hover {
		background-color: #333 !important;
		color: white !important;
	}

	.user-greeting {
		color: #666;
		font-weight: 500;
		font-size: 0.95rem;
	}

	.btn-logout {
		background-color: #ff6b6b;
		color: white;
		border: none;
		padding: 8px 16px;
		border-radius: 8px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-logout:hover {
		background-color: #ff5252;
	}

	.btn-cart {
		background: white;
		border: 1px solid #ff6b6b;
		color: #ff6b6b;
		padding: 7px 14px;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 6px;
		transition: all 0.2s;
		font-size: 0.95rem;
	}

	.btn-cart:hover {
		background-color: #ff6b6b;
		color: white;
	}

	.cart-badge {
		background-color: #ff6b6b;
		color: white;
		border-radius: 12px;
		padding: 2px 7px;
		font-size: 0.75rem;
		font-weight: 700;
		line-height: 1;
	}

	.btn-cart:hover .cart-badge {
		background-color: white;
		color: #ff6b6b;
	}
</style>
