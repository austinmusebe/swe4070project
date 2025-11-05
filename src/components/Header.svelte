<script>
	import Button from './Button.svelte';
</script>

<header>
	<nav>
		<ul class="header-content">
			<li class="business"><a href="/">Bees' Ness</a></li>
			<div class="nav-links">
				<a href="/home">Home</a>
				<a href="/account">Manage Account</a>
				<a href="/login">Sign In</a>
				<a href="/register" class="btn-register">Get Started</a>
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
		/* gap: 20px; */
		margin: 0;
	}
	.business {
		/* padding-right: 87%; */
		font-size: 2rem;
		white-space: nowrap;
		padding-left: 10px;
	}
	.nav-links {
		display: flex;
		gap: 20px;
		padding-right: 10px;
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
</style>
