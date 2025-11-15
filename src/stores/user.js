import { writable } from 'svelte/store';

function createUserStore() {
	// Load from localStorage if available
	const storedUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
	const initialUser = storedUser ? JSON.parse(storedUser) : null;

	const { subscribe, set } = writable(initialUser);

	return {
		subscribe,
		set: (user) => {
			if (user) {
				localStorage.setItem('currentUser', JSON.stringify(user));
			} else {
				localStorage.removeItem('currentUser');
			}
			set(user);
		},
		logout: () => {
			localStorage.removeItem('currentUser');
			set(null);
		}
	};
}

export const currentUser = createUserStore();
