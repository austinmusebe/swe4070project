import { ADMIN_USERNAME, ADMIN_PASSWORD } from '$env/static/private';
import { fail } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!username || !password) {
			return fail(400, { error: 'Please fill in all fields' });
		}

		if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
			return fail(401, { error: 'Invalid admin credentials' });
		}

		return { success: true };
	}
};
