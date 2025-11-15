import { getDb } from '$lib/db.js';
import bcrypt from 'bcrypt';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const firstName = formData.get('firstName');
		const lastName = formData.get('lastName');
		const email = formData.get('email');
		const username = formData.get('username');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');

		// Validation
		if (!firstName || !lastName || !email || !username || !password) {
			return fail(400, { error: 'Please fill in all fields' });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match' });
		}

		if (password.length < 6) {
			return fail(400, { error: 'Password must be at least 6 characters' });
		}

		const db = await getDb();
		const users = db.collection('users');

		// Check if user exists
		const existingUser = await users.findOne({ $or: [{ email }, { username }] });
		if (existingUser) {
			return fail(400, { error: 'User already exists' });
		}

		// Hash password and create user
		const hashedPassword = await bcrypt.hash(password, 10);
		const result = await users.insertOne({
			firstName,
			lastName,
			name: `${firstName} ${lastName}`,
			email,
			username,
			password: hashedPassword,
			phone: '',
			joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
			createdAt: new Date()
		});

		// Return user data (without password)
		return {
			success: true,
			user: {
				_id: result.insertedId.toString(),
				firstName,
				lastName,
				name: `${firstName} ${lastName}`,
				email,
				username,
				phone: '',
				joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
			}
		};
	}
};
