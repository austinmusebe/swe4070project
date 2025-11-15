import { getDb } from '$lib/db.js';
import { ObjectId } from 'mongodb';
import { fail } from '@sveltejs/kit';

// Load user addresses
export async function load({ url }) {
	const userId = url.searchParams.get('userId');
	if (!userId) return { addresses: [] };

	const db = await getDb();
	const addresses = db.collection('addresses');

	const userAddresses = await addresses.find({ userId }).toArray();

	return {
		addresses: userAddresses.map((addr) => ({
			...addr,
			_id: addr._id.toString()
		}))
	};
}

export const actions = {
	addAddress: async ({ request }) => {
		const formData = await request.formData();
		const userId = formData.get('userId');
		const address = JSON.parse(formData.get('address'));

		const db = await getDb();
		const addresses = db.collection('addresses');

		// Check if first address
		const count = await addresses.countDocuments({ userId });

		const result = await addresses.insertOne({
			...address,
			userId,
			isDefault: count === 0,
			createdAt: new Date()
		});

		return { success: true, addressId: result.insertedId.toString() };
	},

	updateAddress: async ({ request }) => {
		const formData = await request.formData();
		const addressId = formData.get('addressId');
		const updates = JSON.parse(formData.get('updates'));

		const db = await getDb();
		const addresses = db.collection('addresses');

		await addresses.updateOne({ _id: new ObjectId(addressId) }, { $set: updates });

		return { success: true };
	},

	deleteAddress: async ({ request }) => {
		const formData = await request.formData();
		const addressId = formData.get('addressId');

		const db = await getDb();
		const addresses = db.collection('addresses');

		await addresses.deleteOne({ _id: new ObjectId(addressId) });

		return { success: true };
	},

	setDefault: async ({ request }) => {
		const formData = await request.formData();
		const addressId = formData.get('addressId');
		const userId = formData.get('userId');

		const db = await getDb();
		const addresses = db.collection('addresses');

		// Remove default from all
		await addresses.updateMany({ userId }, { $set: { isDefault: false } });

		// Set new default
		await addresses.updateOne({ _id: new ObjectId(addressId) }, { $set: { isDefault: true } });

		return { success: true };
	},

	updateProfile: async ({ request }) => {
		const formData = await request.formData();
		const userId = formData.get('userId');
		const name = formData.get('name');
		const email = formData.get('email');
		const phone = formData.get('phone');

		const db = await getDb();
		const users = db.collection('users');

		await users.updateOne({ _id: new ObjectId(userId) }, { $set: { name, email, phone } });

		return {
			success: true,
			user: { _id: userId, name, email, phone }
		};
	}
};
