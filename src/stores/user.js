import { writable } from 'svelte/store';

function createUserStore() {
	// Load from localStorage if available
	const storedUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
	const initialUser = storedUser ? JSON.parse(storedUser) : null;

	const { subscribe, set, update } = writable(initialUser);

	return {
		subscribe,
		login: (email, password) => {
			// Get all users from localStorage
			const users = JSON.parse(localStorage.getItem('users') || '[]');
			const user = users.find((u) => u.email === email && u.password === password);

			if (user) {
				// Remove password from stored session
				const { password, ...userWithoutPassword } = user;
				localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
				set(userWithoutPassword);
				return { success: true };
			}
			return { success: false, error: 'Invalid credentials' };
		},
		register: (userData) => {
			// Get existing users
			const users = JSON.parse(localStorage.getItem('users') || '[]');

			// Check if user already exists
			if (users.find((u) => u.email === userData.email)) {
				return { success: false, error: 'User already exists' };
			}

			// Create new user with ID and timestamp
			const newUser = {
				id: Date.now().toString(),
				...userData,
				joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
				createdAt: new Date().toISOString()
			};

			// Save to users array
			users.push(newUser);
			localStorage.setItem('users', JSON.stringify(users));

			// Auto-login after registration
			const { password, ...userWithoutPassword } = newUser;
			localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
			set(userWithoutPassword);

			return { success: true };
		},
		logout: () => {
			localStorage.removeItem('currentUser');
			set(null);
		},
		updateProfile: (updates) => {
			update((user) => {
				if (!user) return null;

				const updatedUser = { ...user, ...updates };

				// Update in localStorage
				localStorage.setItem('currentUser', JSON.stringify(updatedUser));

				// Update in users array
				const users = JSON.parse(localStorage.getItem('users') || '[]');
				const userIndex = users.findIndex((u) => u.id === user.id);
				if (userIndex !== -1) {
					users[userIndex] = { ...users[userIndex], ...updates };
					localStorage.setItem('users', JSON.stringify(users));
				}

				return updatedUser;
			});
		}
	};
}

export const currentUser = createUserStore();
