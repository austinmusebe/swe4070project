import { getDb } from '$lib/db.js';
import bcrypt from 'bcrypt';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (!email || !password) {
			return fail(400, { error: 'Please fill in all fields' });
		}

		const db = await getDb();
		const users = db.collection('users');

		// Find user
		const user = await users.findOne({ email });
		if (!user) {
			return fail(401, { error: 'Invalid credentials' });
		}

		// Verify password
		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			return fail(401, { error: 'Invalid credentials' });
		}

		// Return user without password
		return {
			success: true,
			user: {
				_id: user._id.toString(),
				firstName: user.firstName,
				lastName: user.lastName,
				name: user.name,
				email: user.email,
				username: user.username,
				phone: user.phone || '',
				joinDate: user.joinDate
			}
		};
	}
};
