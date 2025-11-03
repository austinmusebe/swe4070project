<script>
	import Button from '../../components/Button.svelte';

	let username = $state('');
	let password = $state('');
</script>

<!-- // User login -->
<h1>this is the login page.</h1>
<div class="container">
	<div class="login-section">
		<div class="left-card">
			<img src="src/lib/assets/undefined.jpeg" alt="placeholder" class="placeholder" /> <br />
		</div>
		<div class="right-card">
			<div class="details">
				<h1>Log In To Your Account</h1>
				<p>Don't have an account? <a href="/register">Register Here</a></p>
				<input type="text" placeholder="Username" class="user-pass" />
				<input type="password" placeholder="Password" class="user-pass" />
			</div>
			<div class="button-container">
				<Button text="Log In" />
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}
	.login-section {
		background-color: red;
		display: flex;
		flex-direction: row;
		/* height: 40%; */
		justify-content: center;
		align-items: stretch;
		border-radius: 6px;
	}
	.left-card {
		background-color: aquamarine;
		/* height: 100%; */
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.right-card {
		background-color: #acc8e5;
	}
	input {
		background-color: rgb(88, 88, 88);
		color: white;
		border-radius: 10px;
	}
	input:hover {
		cursor: pointer;
	}
	input::placeholder {
		color: white;
	}

	.details {
		display: flex;
		flex-direction: column;
		max-width: 50%;
		margin: 20px;
	}
	.user-pass {
		width: 50vw;
	}
	.button-container {
		display: flex;
		justify-content: center;
		padding-bottom: 20px;
	}
	h1 {
		font-size: 2rem;
		color: white;
		white-space: nowrap;
	}
	p {
		font-size: 1rem;
		white-space: nowrap;
	}
	a {
		color: blue;
	}
	.placeholder {
		width: 30vh;
	}
</style>
