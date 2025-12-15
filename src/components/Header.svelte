<script>
	import Button from './Button.svelte';
	import { currentUser } from '../stores/user.js';
	import { goto } from '$app/navigation';

	let user = $state(null);

	$effect(() => {
		currentUser.subscribe((u) => {
			user = u;
		});
	});

	function handleLogout() {
		currentUser.logout();
		goto('/login');
	}
</script>

<header>
	<nav>
		<ul class="header-content">
			<li class="business"><a href="/home">SCAMMER SHOP</a></li>
			<div class="nav-links">
				<a href="/home">Home</a>
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
</style>
