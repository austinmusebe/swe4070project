<script>
	import { cart } from '../../stores/cart';
	import { goto } from '$app/navigation';

	let cartItems = $state([]);
	let total = $derived(cart.getTotal(cartItems));

	$effect(() => {
		cart.subscribe((items) => {
			cartItems = items;
			if (items.length === 0) {
				goto('/home');
			}
		});
	});

	// Shipping Information
	let shippingInfo = $state({
		fullName: '',
		email: '',
		phone: '',
		street: '',
		city: '',
		state: '',
		zip: '',
		country: 'USA'
	});

	// Payment Information
	let paymentInfo = $state({
		cardNumber: '',
		cardName: '',
		expiryDate: '',
		cvv: ''
	});

	let currentStep = $state(1); // 1: Shipping, 2: Payment, 3: Review
	let agreeToTerms = $state(false);

	function nextStep() {
		if (currentStep === 1) {
			if (!validateShipping()) return;
			currentStep = 2;
		} else if (currentStep === 2) {
			if (!validatePayment()) return;
			currentStep = 3;
		}
	}

	function prevStep() {
		if (currentStep > 1) {
			currentStep--;
		}
	}

	function validateShipping() {
		if (
			!shippingInfo.fullName ||
			!shippingInfo.email ||
			!shippingInfo.phone ||
			!shippingInfo.street ||
			!shippingInfo.city ||
			!shippingInfo.zip
		) {
			alert('Please fill in all shipping information');
			return false;
		}
		return true;
	}

	function validatePayment() {
		if (
			!paymentInfo.cardNumber ||
			!paymentInfo.cardName ||
			!paymentInfo.expiryDate ||
			!paymentInfo.cvv
		) {
			alert('Please fill in all payment information');
			return false;
		}
		return true;
	}

	function completeOrder() {
		if (!agreeToTerms) {
			alert('Please agree to the terms and conditions');
			return;
		}

		// Simulate order processing
		alert('Order placed successfully! 🎉');
		cart.clear();
		goto('/account');
	}

	function formatCardNumber(value) {
		return value
			.replace(/\s/g, '')
			.replace(/(\d{4})/g, '$1 ')
			.trim();
	}

	function handleCardNumberInput(e) {
		let value = e.target.value.replace(/\s/g, '');
		if (value.length <= 16) {
			paymentInfo.cardNumber = formatCardNumber(value);
		}
	}

	function handleExpiryInput(e) {
		let value = e.target.value.replace(/\D/g, '');
		if (value.length >= 2) {
			value = value.slice(0, 2) + '/' + value.slice(2, 4);
		}
		paymentInfo.expiryDate = value;
	}
</script>

<div class="checkout-container">
	<div class="checkout-header">
		<h1>Checkout</h1>
		<div class="steps-indicator">
			<div class="step" class:active={currentStep === 1} class:completed={currentStep > 1}>
				<span class="step-number">1</span>
				<span class="step-label">Shipping</span>
			</div>
			<div class="step-line" class:completed={currentStep > 1}></div>
			<div class="step" class:active={currentStep === 2} class:completed={currentStep > 2}>
				<span class="step-number">2</span>
				<span class="step-label">Payment</span>
			</div>
			<div class="step-line" class:completed={currentStep > 2}></div>
			<div class="step" class:active={currentStep === 3}>
				<span class="step-number">3</span>
				<span class="step-label">Review</span>
			</div>
		</div>
	</div>

	<div class="checkout-content">
		<div class="checkout-main">
			<!-- Step 1: Shipping Information -->
			{#if currentStep === 1}
				<div class="checkout-section">
					<h2>Shipping Information</h2>
					<div class="form-grid">
						<div class="form-group full-width">
							<label for="fullName">Full Name *</label>
							<input
								type="text"
								id="fullName"
								bind:value={shippingInfo.fullName}
								placeholder="John Doe"
								class="input-field"
							/>
						</div>

						<div class="form-group">
							<label for="email">Email *</label>
							<input
								type="email"
								id="email"
								bind:value={shippingInfo.email}
								placeholder="john@example.com"
								class="input-field"
							/>
						</div>

						<div class="form-group">
							<label for="phone">Phone *</label>
							<input
								type="tel"
								id="phone"
								bind:value={shippingInfo.phone}
								placeholder="+1 (555) 123-4567"
								class="input-field"
							/>
						</div>

						<div class="form-group full-width">
							<label for="street">Street Address *</label>
							<input
								type="text"
								id="street"
								bind:value={shippingInfo.street}
								placeholder="123 Main Street"
								class="input-field"
							/>
						</div>

						<div class="form-group">
							<label for="city">City *</label>
							<input
								type="text"
								id="city"
								bind:value={shippingInfo.city}
								placeholder="New York"
								class="input-field"
							/>
						</div>

						<div class="form-group">
							<label for="state">State</label>
							<input
								type="text"
								id="state"
								bind:value={shippingInfo.state}
								placeholder="NY"
								class="input-field"
							/>
						</div>

						<div class="form-group">
							<label for="zip">ZIP Code *</label>
							<input
								type="text"
								id="zip"
								bind:value={shippingInfo.zip}
								placeholder="10001"
								class="input-field"
							/>
						</div>

						<div class="form-group">
							<label for="country">Country</label>
							<input
								type="text"
								id="country"
								bind:value={shippingInfo.country}
								placeholder="USA"
								class="input-field"
							/>
						</div>
					</div>

					<div class="button-group">
						<button class="btn-back" onclick={() => goto('/home')}> ← Back to Shopping </button>
						<button class="btn-next" onclick={nextStep}> Continue to Payment → </button>
					</div>
				</div>
			{/if}

			<!-- Step 2: Payment Information -->
			{#if currentStep === 2}
				<div class="checkout-section">
					<h2>Payment Information</h2>
					<div class="form-grid">
						<div class="form-group full-width">
							<label for="cardNumber">Card Number *</label>
							<input
								type="text"
								id="cardNumber"
								value={paymentInfo.cardNumber}
								oninput={handleCardNumberInput}
								placeholder="1234 5678 9012 3456"
								maxlength="19"
								class="input-field"
							/>
						</div>

						<div class="form-group full-width">
							<label for="cardName">Cardholder Name *</label>
							<input
								type="text"
								id="cardName"
								bind:value={paymentInfo.cardName}
								placeholder="John Doe"
								class="input-field"
							/>
						</div>

						<div class="form-group">
							<label for="expiryDate">Expiry Date *</label>
							<input
								type="text"
								id="expiryDate"
								value={paymentInfo.expiryDate}
								oninput={handleExpiryInput}
								placeholder="MM/YY"
								maxlength="5"
								class="input-field"
							/>
						</div>

						<div class="form-group">
							<label for="cvv">CVV *</label>
							<input
								type="text"
								id="cvv"
								bind:value={paymentInfo.cvv}
								placeholder="123"
								maxlength="4"
								class="input-field"
							/>
						</div>
					</div>

					<div class="payment-notice">
						<span class="lock-icon">🔒</span>
						<p>Your payment information is secure and encrypted</p>
					</div>

					<div class="button-group">
						<button class="btn-back" onclick={prevStep}> ← Back to Shipping </button>
						<button class="btn-next" onclick={nextStep}> Review Order → </button>
					</div>
				</div>
			{/if}

			<!-- Step 3: Review Order -->
			{#if currentStep === 3}
				<div class="checkout-section">
					<h2>Review Your Order</h2>

					<div class="review-section">
						<h3>Shipping Information</h3>
						<div class="review-card">
							<p><strong>{shippingInfo.fullName}</strong></p>
							<p>{shippingInfo.email}</p>
							<p>{shippingInfo.phone}</p>
							<p>{shippingInfo.street}</p>
							<p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}</p>
							<p>{shippingInfo.country}</p>
							<button class="edit-link" onclick={() => (currentStep = 1)}>Edit</button>
						</div>
					</div>

					<div class="review-section">
						<h3>Payment Method</h3>
						<div class="review-card">
							<p><strong>Card ending in {paymentInfo.cardNumber.slice(-4)}</strong></p>
							<p>{paymentInfo.cardName}</p>
							<p>Expires: {paymentInfo.expiryDate}</p>
							<button class="edit-link" onclick={() => (currentStep = 2)}>Edit</button>
						</div>
					</div>

					<div class="review-section">
						<h3>Order Items</h3>
						<div class="review-items">
							{#each cartItems as item}
								<div class="review-item">
									<div class="item-image-small">
										{#if item.product.image}
											<img src={item.product.image} alt={item.product.name} />
										{:else}
											<div class="placeholder-tiny">No Image</div>
										{/if}
									</div>
									<div class="item-info">
										<p class="item-name">{item.product.name}</p>
										<p class="item-quantity">Qty: {item.quantity}</p>
									</div>
									<p class="item-price">${(item.product.price * item.quantity).toFixed(2)}</p>
								</div>
							{/each}
						</div>
					</div>

					<div class="terms-checkbox">
						<input type="checkbox" id="terms" bind:checked={agreeToTerms} />
						<label for="terms">
							I agree to the <a href="/terms">Terms and Conditions</a>
						</label>
					</div>

					<div class="button-group">
						<button class="btn-back" onclick={prevStep}> ← Back to Payment </button>
						<button class="btn-place-order" onclick={completeOrder} disabled={!agreeToTerms}>
							Place Order 🎉
						</button>
					</div>
				</div>
			{/if}
		</div>

		<!-- Order Summary Sidebar -->
		<div class="checkout-sidebar">
			<div class="summary-card">
				<h3>Order Summary</h3>

				<div class="summary-items">
					{#each cartItems as item}
						<div class="summary-item">
							<span>{item.product.name} × {item.quantity}</span>
							<span>${(item.product.price * item.quantity).toFixed(2)}</span>
						</div>
					{/each}
				</div>

				<div class="summary-divider"></div>

				<div class="summary-row">
					<span>Subtotal</span>
					<span>${total.toFixed(2)}</span>
				</div>

				<div class="summary-row">
					<span>Shipping</span>
					<span>$5.00</span>
				</div>

				<div class="summary-row">
					<span>Tax</span>
					<span>${(total * 0.08).toFixed(2)}</span>
				</div>

				<div class="summary-divider"></div>

				<div class="summary-total">
					<span>Total</span>
					<span>${(total + 5 + total * 0.08).toFixed(2)}</span>
				</div>
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

	.checkout-container {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding: 40px 20px;
	}

	.checkout-header {
		max-width: 1200px;
		margin: 0 auto 40px auto;
	}

	.checkout-header h1 {
		margin: 0 0 30px 0;
		color: #1a1a1a;
		font-size: 2.5rem;
		text-align: center;
	}

	.steps-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
	}

	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}

	.step-number {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-color: #e0e0e0;
		color: #999;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 1.2rem;
		transition: all 0.3s;
	}

	.step.active .step-number {
		background-color: #ff6b6b;
		color: white;
	}

	.step.completed .step-number {
		background-color: #4caf50;
		color: white;
	}

	.step-label {
		font-size: 0.9rem;
		color: #666;
		font-weight: 500;
	}

	.step.active .step-label {
		color: #ff6b6b;
		font-weight: 600;
	}

	.step-line {
		width: 100px;
		height: 3px;
		background-color: #e0e0e0;
		margin: 0 20px;
		margin-bottom: 28px;
		transition: all 0.3s;
	}

	.step-line.completed {
		background-color: #4caf50;
	}

	.checkout-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		gap: 30px;
		align-items: flex-start;
	}

	.checkout-main {
		flex: 1;
	}

	.checkout-section {
		background-color: white;
		border-radius: 12px;
		padding: 40px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.checkout-section h2 {
		margin: 0 0 30px 0;
		color: #1a1a1a;
		font-size: 1.8rem;
		font-weight: 600;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20px;
		margin-bottom: 30px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
	}

	.form-group.full-width {
		grid-column: 1 / -1;
	}

	.form-group label {
		font-size: 0.9rem;
		font-weight: 600;
		color: #333;
		margin-bottom: 8px;
	}

	.input-field {
		padding: 14px 16px;
		background-color: #f8f8f8;
		border: 2px solid transparent;
		border-radius: 8px;
		font-size: 1rem;
		transition: all 0.2s;
	}

	.input-field:focus {
		outline: none;
		background-color: white;
		border-color: #ff6b6b;
	}

	.payment-notice {
		background-color: #f0f9ff;
		border: 1px solid #bae6fd;
		border-radius: 8px;
		padding: 16px;
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 30px;
	}

	.lock-icon {
		font-size: 1.5rem;
	}

	.payment-notice p {
		margin: 0;
		color: #0369a1;
		font-weight: 500;
	}

	.button-group {
		display: flex;
		gap: 16px;
		justify-content: space-between;
	}

	.btn-back {
		padding: 14px 28px;
		background-color: white;
		color: #666;
		border: 2px solid #e0e0e0;
		border-radius: 10px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-back:hover {
		border-color: #ccc;
		color: #333;
	}

	.btn-next,
	.btn-place-order {
		padding: 14px 28px;
		background-color: #ff6b6b;
		color: white;
		border: none;
		border-radius: 10px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		flex: 1;
		max-width: 300px;
	}

	.btn-next:hover,
	.btn-place-order:hover:not(:disabled) {
		background-color: #ff5252;
	}

	.btn-place-order:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}

	/* Review Section */
	.review-section {
		margin-bottom: 30px;
	}

	.review-section h3 {
		margin: 0 0 16px 0;
		color: #1a1a1a;
		font-size: 1.2rem;
		font-weight: 600;
	}

	.review-card {
		background-color: #f8f8f8;
		padding: 20px;
		border-radius: 8px;
		position: relative;
	}

	.review-card p {
		margin: 0 0 8px 0;
		color: #666;
		line-height: 1.6;
	}

	.edit-link {
		position: absolute;
		top: 20px;
		right: 20px;
		background: none;
		border: none;
		color: #ff6b6b;
		font-weight: 600;
		cursor: pointer;
		text-decoration: underline;
	}

	.edit-link:hover {
		color: #ff5252;
	}

	.review-items {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.review-item {
		display: flex;
		align-items: center;
		gap: 16px;
		background-color: #f8f8f8;
		padding: 16px;
		border-radius: 8px;
	}

	.item-image-small {
		width: 50px;
		height: 50px;
		background-color: black;
		border-radius: 6px;
		overflow: hidden;
		flex-shrink: 0;
	}

	.item-image-small img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder-tiny {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #999;
		font-size: 0.6rem;
	}

	.item-info {
		flex: 1;
	}

	.item-name {
		margin: 0 0 4px 0;
		color: #1a1a1a;
		font-weight: 600;
	}

	.item-quantity {
		margin: 0;
		color: #666;
		font-size: 0.9rem;
	}

	.item-price {
		margin: 0;
		color: #1a1a1a;
		font-weight: 700;
		font-size: 1.1rem;
	}

	.terms-checkbox {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 30px;
		padding: 16px;
		background-color: #f8f8f8;
		border-radius: 8px;
	}

	.terms-checkbox input[type='checkbox'] {
		width: 20px;
		height: 20px;
		cursor: pointer;
		accent-color: #ff6b6b;
	}

	.terms-checkbox label {
		font-size: 0.95rem;
		color: #666;
		cursor: pointer;
	}

	.terms-checkbox a {
		color: #ff6b6b;
		text-decoration: none;
		font-weight: 600;
	}

	.terms-checkbox a:hover {
		text-decoration: underline;
	}

	/* Sidebar */
	.checkout-sidebar {
		flex: 0 0 350px;
		position: sticky;
		top: 20px;
	}

	.summary-card {
		background-color: white;
		border-radius: 12px;
		padding: 30px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.summary-card h3 {
		margin: 0 0 20px 0;
		color: #1a1a1a;
		font-size: 1.5rem;
		font-weight: 600;
	}

	.summary-items {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 20px;
	}

	.summary-item {
		display: flex;
		justify-content: space-between;
		color: #666;
		font-size: 0.95rem;
	}

	.summary-divider {
		height: 1px;
		background-color: #e0e0e0;
		margin: 20px 0;
	}

	.summary-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 12px;
		color: #666;
	}

	.summary-total {
		display: flex;
		justify-content: space-between;
		font-size: 1.5rem;
		font-weight: 700;
		color: #1a1a1a;
		margin-top: 20px;
	}

	.summary-total span:last-child {
		color: #ff6b6b;
	}

	/* Responsive */
	@media (max-width: 968px) {
		.checkout-content {
			flex-direction: column;
		}

		.checkout-sidebar {
			flex: 1;
			position: static;
			width: 100%;
		}

		.form-grid {
			grid-template-columns: 1fr;
		}

		.step-line {
			width: 50px;
			margin: 0 10px;
		}

		.step-label {
			display: none;
		}
	}

	@media (max-width: 568px) {
		.checkout-container {
			padding: 20px 10px;
		}

		.checkout-section {
			padding: 24px 20px;
		}

		.checkout-header h1 {
			font-size: 2rem;
		}

		.button-group {
			flex-direction: column;
		}

		.btn-next,
		.btn-place-order {
			max-width: 100%;
		}

		.step-number {
			width: 40px;
			height: 40px;
			font-size: 1rem;
		}
	}
</style>
