<header>
	<nav>
		<ul class="header-content">
			<li class="business">Bees' Ness</li>
			<div class="nav-links">
				<li><a href="/home">Home</a></li>
				<li><a href="/account">Manage Account</a></li>
				<li><a href="/register">Register</a></li>
				<li><a href="/login"> Login</a></li>
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
		color: #3f3f3f;
	}
	.nav-links a:hover {
		text-decoration: underline;
	}
</style>
