<script>
	import Button from '../../components/Button.svelte';
	import { currentUser } from '../../stores/user.js';
	import { goto } from '$app/navigation';

	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let username = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let errorMessage = $state('');

	function handleRegister() {
		errorMessage = '';

		// Validation
		if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
			errorMessage = 'Please fill in all fields';
			return;
		}

		if (password !== confirmPassword) {
			errorMessage = 'Passwords do not match';
			return;
		}

		if (password.length < 6) {
			errorMessage = 'Password must be at least 6 characters';
			return;
		}

		// Register user
		const result = currentUser.register({
			firstName,
			lastName,
			name: `${firstName} ${lastName}`,
			email,
			username,
			password,
			phone: ''
		});

		if (result.success) {
			goto('/home');
		} else {
			errorMessage = result.error;
		}
	}
</script>

<div class="container">
	<div class="register-section">
		<div class="left-card">
			<div class="welcome-content">
				<h2>Join Us Today</h2>
				<p>Start your journey with us and discover amazing products.</p>
			</div>
		</div>
		<div class="right-card">
			<div class="details">
				<h1>Create Account</h1>
				<p>Already have an account? <a href="/login">Sign in</a></p>

				{#if errorMessage}
					<div class="error-message">
						{errorMessage}
					</div>
				{/if}

				<form
					onsubmit={(e) => {
						e.preventDefault();
						handleRegister();
					}}
				>
					<div class="name-section">
						<div class="input-group">
							<label for="firstName">First Name</label>
							<input type="text" id="firstName" bind:value={firstName} placeholder="John" />
						</div>

						<div class="input-group">
							<label for="lastName">Last Name</label>
							<input type="text" id="lastName" bind:value={lastName} placeholder="Doe" />
						</div>
					</div>

					<div class="input-group">
						<label for="email">Email</label>
						<input type="email" id="email" bind:value={email} placeholder="john.doe@example.com" />
					</div>

					<div class="input-group">
						<label for="username">Username</label>
						<input
							type="text"
							id="username"
							bind:value={username}
							placeholder="Choose a username"
						/>
					</div>

					<div class="input-group">
						<label for="password">Password</label>
						<input
							type="password"
							id="password"
							bind:value={password}
							placeholder="Create a strong password"
						/>
					</div>

					<div class="input-group">
						<label for="confirmPassword">Confirm Password</label>
						<input
							type="password"
							id="confirmPassword"
							bind:value={confirmPassword}
							placeholder="Re-enter your password"
						/>
					</div>

					<div class="button-container">
						<button type="submit" class="register-btn">Create Account</button>
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

	.register-section {
		display: flex;
		flex-direction: row;
		width: 100%;
		max-width: 1100px;
		min-height: 700px;
		background-color: white;
		border-radius: 16px;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
		overflow: hidden;
	}

	.left-card {
		flex: 0.8;
		background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 60px 40px;
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

	.welcome-content {
		position: relative;
		z-index: 1;
		color: white;
		max-width: 350px;
	}

	.welcome-content h2 {
		font-size: 2.5rem;
		margin: 0 0 16px 0;
		font-weight: 600;
	}

	.welcome-content > p {
		font-size: 1.1rem;
		color: #ccc;
		margin: 0 0 40px 0;
		line-height: 1.6;
	}

	.features {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.feature {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 1rem;
		color: #e0e0e0;
	}

	.icon {
		width: 28px;
		height: 28px;
		background-color: #ff6b6b;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		flex-shrink: 0;
	}

	.right-card {
		flex: 1.2;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 40px;
		background-color: white;
		overflow-y: auto;
	}

	.details {
		width: 100%;
		max-width: 450px;
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
		margin: 0 0 24px 0;
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

	.error-message {
		background-color: #fee;
		color: #c33;
		padding: 12px;
		border-radius: 8px;
		margin-bottom: 20px;
		font-size: 0.9rem;
		border: 1px solid #fcc;
	}

	.name-section {
		display: flex;
		gap: 16px;
		margin-bottom: 20px;
	}

	.name-section .input-group {
		flex: 1;
		margin-bottom: 0;
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

	input[type='text'],
	input[type='email'],
	input[type='password'] {
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

	input[type='text']:focus,
	input[type='email']:focus,
	input[type='password']:focus {
		outline: none;
		background-color: white;
		border-color: #ff6b6b;
	}

	input[type='text']:hover,
	input[type='email']:hover,
	input[type='password']:hover {
		background-color: #f0f0f0;
	}

	input::placeholder {
		color: #999;
	}

	.button-container {
		margin-top: 24px;
	}

	.register-btn {
		width: 100%;
		background-color: #ff6b6b;
		color: white;
		border: none;
		padding: 16px;
		border-radius: 10px;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.register-btn:hover {
		background-color: #ff5252;
	}

	@media (max-width: 968px) {
		.register-section {
			flex-direction: column;
			min-height: auto;
		}

		.left-card {
			padding: 40px 30px;
		}

		.welcome-content h2 {
			font-size: 2rem;
		}

		.welcome-content > p {
			font-size: 1rem;
		}

		h1 {
			font-size: 1.75rem;
		}
	}

	@media (max-width: 568px) {
		.name-section {
			flex-direction: column;
			gap: 0;
		}

		.name-section .input-group {
			margin-bottom: 20px;
		}
	}
</style>
