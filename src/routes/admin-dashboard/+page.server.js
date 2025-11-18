import { getDb } from '$lib/db.js';

export async function load() {
	const db = await getDb();
	const orders = db.collection('orders');
	const users = db.collection('users');

	// Get all orders
	const allOrders = await orders.find({}).sort({ createdAt: -1 }).toArray();

	// Calculate total revenue
	const totalRevenue = allOrders.reduce((sum, order) => {
		return sum + parseFloat(order.total);
	}, 0);

	// Get total users
	const totalUsers = await users.countDocuments();

	return {
		stats: {
			totalRevenue,
			totalOrders: allOrders.length,
			totalUsers
		},
		orders: allOrders.map((order) => ({
			...order,
			_id: order._id.toString()
		}))
	};
}
