import { getDb } from '$lib/db.js';

export const actions = {
	placeOrder: async ({ request }) => {
		const formData = await request.formData();
		const orderData = JSON.parse(formData.get('orderData'));

		const db = await getDb();
		const orders = db.collection('orders');

		const result = await orders.insertOne({
			...orderData,
			createdAt: new Date()
		});

		return {
			success: true,
			orderId: result.insertedId.toString()
		};
	}
};
