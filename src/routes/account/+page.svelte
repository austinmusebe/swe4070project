<script>
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { currentUser } from '../../stores/user.js';
	import { addresses } from '../../stores/addresses.js';
	import { invalidateAll } from '$app/navigation';

	let user = $state(null);
	/**
	 * @type {string | any[] | null | undefined}
	 */
	let userAddresses = $state([]);
	let { data } = $props();

	$effect(() => {
		if (data?.addresses) {
			addresses.set(data.addresses);
		}
	});

	$effect(() => {
		currentUser.subscribe((u) => {
			user = u;
			if (!u) {
				goto('/login');
			} else if (u && typeof window !== 'undefined' && !window.location.search) {
				goto(`/account?userId=${u._id}`, { replaceState: true, noScroll: true });
			}
		});
	});

	$effect(() => {
		addresses.subscribe((addrs) => {
			userAddresses = addrs;
		});
	});

	let isEditingProfile = $state(false);
	let isEditingPassword = $state(false);
	let isAddingAddress = $state(false);
	let editingAddressId = $state(null);

	let profileForm = $state({
		name: '',
		email: '',
		phone: ''
	});

	let newAddress = $state({
		label: 'Home',
		street: '',
		city: '',
		state: '',
		zip: '',
		country: 'Kenya'
	});

	// Map related
	let map = $state(null);
	let marker = $state(null);
	let mapContainer = $state(null);

	$effect(() => {
		if (user) {
			profileForm = {
				name: user.name || '',
				email: user.email || '',
				phone: user.phone || ''
			};
		}
	});

	function handleLogout() {
		currentUser.logout();
		goto('/login');
	}

	async function saveProfile() {
		if (user) {
			const formData = new FormData();
			formData.append('userId', user._id);
			formData.append('name', profileForm.name);
			formData.append('email', profileForm.email);
			formData.append('phone', profileForm.phone);

			const response = await fetch('?/updateProfile', { method: 'POST', body: formData });
			const result = await response.json();

			if (result.success) {
				currentUser.set({ ...user, ...profileForm });
				isEditingProfile = false;
			}
		}
	}

	function startAddingAddress() {
		isAddingAddress = true;
		editingAddressId = null;
		newAddress = {
			label: 'Home',
			street: '',
			city: '',
			state: '',
			zip: '',
			country: 'USA'
		};
		setTimeout(initMap, 100);
	}

	function startEditingAddress(address) {
		editingAddressId = address.id;
		newAddress = { ...address };
		isAddingAddress = true;
		setTimeout(initMap, 100);
	}

	function cancelAddressForm() {
		isAddingAddress = false;
		editingAddressId = null;
		newAddress = {
			label: 'Home',
			street: '',
			city: '',
			state: '',
			zip: '',
			country: 'USA'
		};
	}

	async function saveAddress() {
		if (!newAddress.street || !newAddress.city) {
			alert('Please fill in all required fields');
			return;
		}

		if (!user) return;

		const formData = new FormData();
		formData.append('userId', user._id);

		if (editingAddressId) {
			formData.append('addressId', editingAddressId);
			formData.append('updates', JSON.stringify(newAddress));
			await fetch('?/updateAddress', { method: 'POST', body: formData });
		} else {
			formData.append('address', JSON.stringify(newAddress));
			await fetch('?/addAddress', { method: 'POST', body: formData });
		}

		// Reload addresses
		// const response = await fetch(`/account?userId=${user._id}`);
		// const html = await response.text();
		// location.reload();
		await invalidateAll();
		cancelAddressForm();
	}

	/**
	 * @param {any} id
	 */
	async function deleteAddress(id) {
		if (!user) return;
		if (confirm('Are you sure you want to delete this address?')) {
			const formData = new FormData();
			formData.append('addressId', id);
			await fetch('?/deleteAddress', { method: 'POST', body: formData });
			// location.reload();
			await invalidateAll();
		}
	}

	/**
	 * @param {any} id
	 */
	async function setDefaultAddress(id) {
		if (!user) return;
		const formData = new FormData();
		formData.append('addressId', id);
		formData.append('userId', user._id);
		await fetch('?/setDefault', { method: 'POST', body: formData });
		// location.reload();
		await invalidateAll();
	}

	async function initMap() {
		if (!mapContainer) return;

		// Dynamically import Leaflet
		const L = await import('leaflet');
		await import('leaflet/dist/leaflet.css');

		// Initialize map
		if (map) {
			map.remove();
		}

		map = L.map(mapContainer).setView([40.7128, -74.006], 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
			maxZoom: 19
		}).addTo(map);

		// Add marker
		marker = L.marker([40.7128, -74.006], {
			draggable: true
		}).addTo(map);

		// Update address when marker is dragged
		marker.on('dragend', async function (e) {
			const position = marker.getLatLng();
			// Reverse geocoding
			try {
				const response = await fetch(
					`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
				);
				const data = await response.json();
				if (data.address) {
					newAddress.street = data.address.road || data.address.suburb || '';
					newAddress.city = data.address.city || data.address.town || data.address.village || '';
					newAddress.state = data.address.state || '';
					newAddress.zip = data.address.postcode || '';
					newAddress.country = data.address.country || 'USA';
				}
			} catch (error) {
				console.error('Geocoding error:', error);
			}
		});
	}

	async function searchAddress() {
		const query = `${newAddress.street}, ${newAddress.city}, ${newAddress.state}`;
		if (!query.trim()) return;

		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
			);
			const data = await response.json();
			if (data && data.length > 0) {
				const L = await import('leaflet');
				const lat = parseFloat(data[0].lat);
				const lon = parseFloat(data[0].lon);
				map.setView([lat, lon], 15);
				marker.setLatLng([lat, lon]);
			}
		} catch (error) {
			console.error('Search error:', error);
		}
	}
</script>

{#if user}
	<div class="account-container">
		<div class="account-header">
			<div class="header-content">
				<div class="user-avatar">
					<span class="avatar-text"
						>{user.name
							.split(' ')
							.map((n) => n[0])
							.join('')}</span
					>
				</div>
				<div class="user-info">
					<h1>{user.name}</h1>
					<p>@{user.username}</p>
				</div>
			</div>
		</div>

		<div class="account-content">
			<div class="main-content">
				<!-- Profile Information -->
				<section class="content-card">
					<div class="card-header">
						<h2>Profile Information</h2>
						<button class="edit-btn" onclick={() => (isEditingProfile = !isEditingProfile)}>
							{isEditingProfile ? 'Cancel' : 'Edit'}
						</button>
					</div>
					<div class="card-body">
						<div class="info-grid">
							<div class="info-item">
								<label>Full Name</label>
								{#if isEditingProfile}
									<input type="text" bind:value={profileForm.name} class="edit-input" />
								{:else}
									<p>{user.name}</p>
								{/if}
							</div>
							<div class="info-item">
								<label>Email</label>
								{#if isEditingProfile}
									<input type="email" bind:value={profileForm.email} class="edit-input" />
								{:else}
									<p>{user.email}</p>
								{/if}
							</div>
							<div class="info-item">
								<label>Phone</label>
								{#if isEditingProfile}
									<input type="tel" bind:value={profileForm.phone} class="edit-input" />
								{:else}
									<p>{user.phone || 'Not provided'}</p>
								{/if}
							</div>
						</div>
						{#if isEditingProfile}
							<div class="action-buttons">
								<button class="save-btn" onclick={saveProfile}>Save Changes</button>
								<button class="cancel-btn" onclick={() => (isEditingProfile = false)}>Cancel</button
								>
							</div>
						{/if}
					</div>
				</section>

				<!-- Addresses Section -->
				<section class="content-card" id="addresses">
					<div class="card-header">
						<h2>Saved Addresses</h2>
						{#if !isAddingAddress}
							<button class="edit-btn" onclick={startAddingAddress}> + Add Address </button>
						{/if}
					</div>
					<div class="card-body">
						{#if isAddingAddress}
							<div class="address-form">
								<h3>{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>

								<div class="form-grid">
									<div class="form-group">
										<label for="label">Label</label>
										<select id="label" bind:value={newAddress.label} class="edit-input">
											<option value="Home">Home</option>
											<option value="Work">Work</option>
											<option value="Other">Other</option>
										</select>
									</div>

									<div class="form-group full-width">
										<label for="street">Location Name: *</label>
										<input
											type="text"
											id="street"
											bind:value={newAddress.street}
											placeholder="123 Main Street"
											class="edit-input"
										/>
									</div>

									<div class="form-group">
										<label for="city">City *</label>
										<input
											type="text"
											id="city"
											bind:value={newAddress.city}
											placeholder="New York"
											class="edit-input"
										/>
									</div>

									<div class="form-group">
										<label for="state">State</label>
										<input
											type="text"
											id="state"
											bind:value={newAddress.state}
											placeholder="NY"
											class="edit-input"
										/>
									</div>

									<div class="form-group">
										<label for="zip">ZIP Code</label>
										<input
											type="text"
											id="zip"
											bind:value={newAddress.zip}
											placeholder="10001"
											class="edit-input"
										/>
									</div>

									<div class="form-group">
										<label for="country">Country</label>
										<input
											type="text"
											id="country"
											bind:value={newAddress.country}
											placeholder="USA"
											class="edit-input"
										/>
									</div>
								</div>

								<button class="search-map-btn" onclick={searchAddress}> 📍 Find on Map </button>

								<div class="map-container" bind:this={mapContainer}></div>
								<p class="map-hint">Drag the marker to adjust the location</p>

								<div class="action-buttons">
									<button class="save-btn" onclick={saveAddress}>
										{editingAddressId ? 'Update Address' : 'Save Address'}
									</button>
									<button class="cancel-btn" onclick={cancelAddressForm}>Cancel</button>
								</div>
							</div>
						{:else if userAddresses.length === 0}
							<div class="empty-state">
								<span class="empty-icon">📍</span>
								<p>No addresses saved yet</p>
								<button class="add-first-btn" onclick={startAddingAddress}>
									Add Your First Address
								</button>
							</div>
						{:else}
							<div class="addresses-list">
								{#each userAddresses as address}
									<div class="address-item">
										<div class="address-content">
											<div class="address-header-row">
												<h4>{address.label}</h4>
												{#if address.isDefault}
													<span class="default-badge">Default</span>
												{/if}
											</div>
											<p class="address-text">
												{address.street}<br />
												{address.city}, {address.state}
												{address.zip}<br />
												{address.country}
											</p>
										</div>
										<div class="address-actions">
											<button class="action-link" onclick={() => startEditingAddress(address)}>
												Edit
											</button>
											{#if !address.isDefault}
												<button class="action-link" onclick={() => setDefaultAddress(address.id)}>
													Set as Default
												</button>
											{/if}
											<button class="action-link delete" onclick={() => deleteAddress(address.id)}>
												Delete
											</button>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</section>
			</div>
		</div>
	</div>
{/if}

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background-color: #f5f5f5;
	}

	.account-container {
		min-height: 100vh;
		background-color: #f5f5f5;
	}

	.account-header {
		background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
		color: white;
		padding: 60px 40px;
		position: relative;
	}

	.account-header::before {
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

	.header-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		gap: 24px;
		position: relative;
		z-index: 1;
	}

	.user-avatar {
		width: 100px;
		height: 100px;
		background-color: #ff6b6b;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2.5rem;
		font-weight: 700;
		color: white;
	}

	.user-info h1 {
		margin: 0 0 8px 0;
		font-size: 2rem;
		font-weight: 600;
	}

	.user-info p {
		margin: 0 0 8px 0;
		color: #ccc;
		font-size: 1.1rem;
	}

	.account-content {
		max-width: 1200px;
		margin: -40px auto 40px auto;
		padding: 0 40px;
		display: flex;
		gap: 30px;
		position: relative;
		z-index: 2;
	}

	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.content-card {
		background-color: white;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		overflow: hidden;
	}

	.card-header {
		padding: 24px 30px;
		border-bottom: 1px solid #e0e0e0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.card-header h2 {
		margin: 0;
		font-size: 1.5rem;
		color: #1a1a1a;
		font-weight: 600;
	}

	.edit-btn {
		color: #ff6b6b;
		background: none;
		border: none;
		cursor: pointer;
		font-weight: 600;
		transition: color 0.2s;
	}

	.edit-btn:hover {
		color: #ff5252;
	}

	.card-body {
		padding: 30px;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 24px;
	}

	.info-item label {
		display: block;
		font-size: 0.85rem;
		font-weight: 600;
		color: #666;
		margin-bottom: 8px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.info-item p {
		margin: 0;
		color: #1a1a1a;
		font-size: 1rem;
	}

	.edit-input {
		width: 100%;
		padding: 12px 14px;
		background-color: #f8f8f8;
		border: 2px solid transparent;
		border-radius: 8px;
		font-size: 1rem;
		transition: all 0.2s;
		box-sizing: border-box;
	}

	.edit-input:focus {
		outline: none;
		background-color: white;
		border-color: #ff6b6b;
	}

	.action-buttons {
		margin-top: 24px;
		display: flex;
		gap: 12px;
	}

	.save-btn {
		background-color: #ff6b6b;
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.save-btn:hover {
		background-color: #ff5252;
	}

	.cancel-btn {
		background-color: white;
		color: #666;
		border: 2px solid #e0e0e0;
		padding: 12px 24px;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.cancel-btn:hover {
		border-color: #ccc;
		color: #333;
	}
	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 60px 20px;
		text-align: center;
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 16px;
		opacity: 0.5;
	}

	.empty-state p {
		color: #666;
		font-size: 1.1rem;
		margin: 0 0 24px 0;
	}

	.add-first-btn {
		background-color: #ff6b6b;
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.add-first-btn:hover {
		background-color: #ff5252;
	}

	/* Address Styles */
	.address-form {
		background-color: #f8f8f8;
		padding: 24px;
		border-radius: 12px;
	}

	.address-form h3 {
		margin: 0 0 20px 0;
		color: #1a1a1a;
		font-size: 1.2rem;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
		margin-bottom: 20px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
	}

	.form-group.full-width {
		grid-column: 1 / -1;
	}

	.form-group label {
		font-size: 0.85rem;
		font-weight: 600;
		color: #666;
		margin-bottom: 6px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.map-container {
		width: 100%;
		height: 300px;
		border-radius: 8px;
		margin: 16px 0;
		border: 2px solid #e0e0e0;
	}

	.map-hint {
		text-align: center;
		color: #999;
		font-size: 0.9rem;
		margin: 8px 0 20px 0;
	}

	.search-map-btn {
		width: 100%;
		background-color: #1a1a1a;
		color: white;
		border: none;
		padding: 12px;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
		margin-bottom: 16px;
	}

	.search-map-btn:hover {
		background-color: #333;
	}

	.addresses-list {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.address-item {
		background-color: #f8f8f8;
		padding: 20px;
		border-radius: 12px;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 20px;
	}

	.address-content {
		flex: 1;
	}

	.address-header-row {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 8px;
	}

	.address-item h4 {
		margin: 0;
		color: #1a1a1a;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.default-badge {
		background-color: #ff6b6b;
		color: white;
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.address-text {
		margin: 0;
		color: #666;
		line-height: 1.6;
	}

	.address-actions {
		display: flex;
		flex-direction: column;
		gap: 8px;
		align-items: flex-end;
	}

	.action-link {
		background: none;
		border: none;
		color: #ff6b6b;
		font-weight: 600;
		cursor: pointer;
		padding: 4px 8px;
		transition: color 0.2s;
	}

	.action-link:hover {
		color: #ff5252;
	}

	.action-link.delete {
		color: #999;
	}

	.action-link.delete:hover {
		color: #e74c3c;
	}

	@media (max-width: 968px) {
		.account-content {
			flex-direction: column;
		}
		.account-header {
			padding: 40px 30px;
		}

		.account-content {
			padding: 0 30px;
		}

		.form-grid {
			grid-template-columns: 1fr;
		}

		.address-item {
			flex-direction: column;
		}

		.address-actions {
			width: 100%;
			flex-direction: row;
			justify-content: flex-start;
		}
	}

	@media (max-width: 568px) {
		.header-content {
			flex-direction: column;
			text-align: center;
		}

		.user-avatar {
			width: 80px;
			height: 80px;
			font-size: 2rem;
		}

		.user-info h1 {
			font-size: 1.5rem;
		}

		.info-grid {
			grid-template-columns: 1fr;
		}

		.action-buttons {
			flex-direction: column;
		}

		.save-btn,
		.cancel-btn {
			width: 100%;
		}
	}
</style>
