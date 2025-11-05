<script>
	import Button from '../../components/Button.svelte';

	let username = $state('');
	let password = $state('');
</script>

<div class="container">
	<div class="login-section">
		<div class="left-card">
			<img src="src/lib/assets/undefined.jpeg" alt="Login visual" class="placeholder" />
		</div>
		<div class="right-card">
			<div class="details">
				<h1>Welcome Back</h1>
				<p>Don't have an account? <a href="/register">Sign up</a></p>

				<form>
					<div class="input-group">
						<label for="username">Username</label>
						<input
							type="text"
							id="username"
							bind:value={username}
							placeholder="Enter your username"
							class="user-pass"
						/>
					</div>

					<div class="input-group">
						<label for="password">Password</label>
						<input
							type="password"
							id="password"
							bind:value={password}
							placeholder="Enter your password"
							class="user-pass"
						/>
					</div>

					<a href="/forgot-password" class="forgot-link">Forgot password?</a>

					<div class="button-container">
						<Button text="Log In" />
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background-color: #f5f5f5;
	}

	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 20px;
	}

	.login-section {
		display: flex;
		flex-direction: row;
		width: 100%;
		max-width: 1000px;
		min-height: 600px;
		background-color: white;
		border-radius: 16px;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
		overflow: hidden;
	}

	.left-card {
		flex: 1;
		background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 40px;
		position: relative;
	}

	.left-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background:
			radial-gradient(circle at 20% 50%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
			radial-gradient(circle at 80% 80%, rgba(255, 193, 7, 0.1) 0%, transparent 50%);
	}

	.placeholder {
		max-width: 100%;
		max-height: 400px;
		border-radius: 12px;
		object-fit: cover;
		position: relative;
		z-index: 1;
	}

	.right-card {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 40px;
		background-color: white;
	}

	.details {
		width: 100%;
		max-width: 400px;
	}

	h1 {
		font-size: 2rem;
		color: #1a1a1a;
		margin: 0 0 8px 0;
		font-weight: 600;
	}

	p {
		font-size: 0.95rem;
		color: #666;
		margin: 0 0 32px 0;
	}

	a {
		color: #ff6b6b;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	a:hover {
		color: #ff5252;
	}

	form {
		width: 100%;
	}

	.input-group {
		margin-bottom: 20px;
	}

	label {
		display: block;
		font-size: 0.9rem;
		font-weight: 500;
		color: #333;
		margin-bottom: 8px;
	}

	input {
		width: 100%;
		padding: 14px 16px;
		background-color: #f8f8f8;
		color: #1a1a1a;
		border: 2px solid transparent;
		border-radius: 10px;
		font-size: 0.95rem;
		transition: all 0.2s;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		background-color: white;
		border-color: #ff6b6b;
	}

	input:hover {
		background-color: #f0f0f0;
	}

	input::placeholder {
		color: #999;
	}

	.forgot-link {
		display: block;
		text-align: right;
		font-size: 0.9rem;
		margin-bottom: 24px;
	}

	.button-container {
		margin-top: 24px;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.login-section {
			flex-direction: column;
			min-height: auto;
		}

		.left-card {
			min-height: 250px;
		}

		.placeholder {
			max-height: 200px;
		}

		h1 {
			font-size: 1.75rem;
		}
	}
</style>
