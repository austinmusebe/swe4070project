<script>
	import { currentAdmin } from '../../stores/admin.js';
	import { goto } from '$app/navigation';

	let admin = $state(null);
	let { data } = $props();

	$effect(() => {
		currentAdmin.subscribe((a) => {
			admin = a;
			if (!a) {
				goto('/admin-login');
			}
		});
	});

	function handleLogout() {
		currentAdmin.logout();
		goto('/admin-login');
	}

	const stats = data?.stats || { totalRevenue: 0, totalOrders: 0, totalUsers: 0 };
	const orders = data?.orders || [];
</script>

{#if admin}
	<div class="dashboard-container">
		<header class="dashboard-header">
			<h1>Admin Dashboard</h1>
			<button class="logout-btn" onclick={handleLogout}>Logout</button>
		</header>

		<!-- Stats Cards -->
		<div class="stats-grid">
			<div class="stat-card revenue">
				<div class="stat-icon">💰</div>
				<div class="stat-info">
					<h3>Total Revenue</h3>
					<p class="stat-value">${stats.totalRevenue.toFixed(2)}</p>
				</div>
			</div>

			<div class="stat-card orders">
				<div class="stat-icon">📦</div>
				<div class="stat-info">
					<h3>Total Orders</h3>
					<p class="stat-value">{stats.totalOrders}</p>
				</div>
			</div>

			<div class="stat-card users">
				<div class="stat-icon">👥</div>
				<div class="stat-info">
					<h3>Total Users</h3>
					<p class="stat-value">{stats.totalUsers}</p>
				</div>
			</div>
		</div>

		<!-- Orders Table -->
		<div class="orders-section">
			<h2>Recent Orders</h2>
			{#if orders.length === 0}
				<div class="empty-state">
					<p>No orders yet</p>
				</div>
			{:else}
				<div class="orders-table">
					<table>
						<thead>
							<tr>
								<th>Order ID</th>
								<th>Customer</th>
								<th>Items</th>
								<th>Total</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							{#each orders as order}
								<tr>
									<td class="order-id">{order.orderId}</td>
									<td>
										<div class="customer-info">
											<strong>{order.shipping.fullName}</strong>
											<span>{order.shipping.email}</span>
										</div>
									</td>
									<td>
										<div class="items-list">
											{#each order.items as item}
												<div class="item-row">
													{item.product.name} × {item.quantity}
													<span class="item-price"
														>${(item.product.price * item.quantity).toFixed(2)}</span
													>
												</div>
											{/each}
										</div>
									</td>
									<td class="total-amount">${order.total}</td>
									<td class="order-date">
										{new Date(order.date).toLocaleDateString()}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background-color: #f5f5f5;
	}

	.dashboard-container {
		min-height: 100vh;
		padding: 40px;
		max-width: 1400px;
		margin: 0 auto;
	}

	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40px;
	}

	.dashboard-header h1 {
		margin: 0;
		font-size: 2.5rem;
		color: #1a1a1a;
	}

	.logout-btn {
		background-color: #ff6b6b;
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.logout-btn:hover {
		background-color: #ff5252;
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 24px;
		margin-bottom: 40px;
	}

	.stat-card {
		background-color: white;
		padding: 30px;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		display: flex;
		align-items: center;
		gap: 20px;
	}

	.stat-icon {
		font-size: 3rem;
		width: 80px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}

	.revenue .stat-icon {
		background-color: #d4edda;
	}

	.orders .stat-icon {
		background-color: #d1ecf1;
	}

	.users .stat-icon {
		background-color: #f8d7da;
	}

	.stat-info {
		flex: 1;
	}

	.stat-info h3 {
		margin: 0 0 8px 0;
		color: #666;
		font-size: 1rem;
		font-weight: 500;
	}

	.stat-value {
		margin: 0;
		font-size: 2.5rem;
		font-weight: 700;
		color: #1a1a1a;
	}

	/* Orders Section */
	.orders-section {
		background-color: white;
		padding: 30px;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.orders-section h2 {
		margin: 0 0 24px 0;
		font-size: 1.8rem;
		color: #1a1a1a;
	}

	.empty-state {
		text-align: center;
		padding: 60px;
		color: #999;
	}

	.orders-table {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	thead {
		background-color: #f8f8f8;
	}

	th {
		text-align: left;
		padding: 16px;
		font-weight: 600;
		color: #666;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	td {
		padding: 20px 16px;
		border-bottom: 1px solid #f0f0f0;
	}

	tbody tr:hover {
		background-color: #fafafa;
	}

	.order-id {
		font-family: monospace;
		color: #666;
		font-size: 0.9rem;
	}

	.customer-info {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.customer-info strong {
		color: #1a1a1a;
	}

	.customer-info span {
		color: #999;
		font-size: 0.9rem;
	}

	.items-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.item-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		color: #666;
		font-size: 0.95rem;
	}

	.item-price {
		color: #1a1a1a;
		font-weight: 600;
	}

	.total-amount {
		font-size: 1.2rem;
		font-weight: 700;
		color: #ff6b6b;
	}

	.order-date {
		color: #666;
	}

	@media (max-width: 768px) {
		.dashboard-container {
			padding: 20px;
		}

		.dashboard-header {
			flex-direction: column;
			gap: 16px;
			align-items: flex-start;
		}

		.dashboard-header h1 {
			font-size: 2rem;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}

		.orders-table {
			font-size: 0.85rem;
		}

		th,
		td {
			padding: 12px 8px;
		}
	}
</style>
