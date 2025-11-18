import { writable } from 'svelte/store';

function createAdminStore() {
	const storedAdmin = typeof window !== 'undefined' ? localStorage.getItem('adminSession') : null;
	const initialAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

	const { subscribe, set } = writable(initialAdmin);

	return {
		subscribe,
		set: (admin) => {
			if (admin) {
				localStorage.setItem('adminSession', JSON.stringify(admin));
			} else {
				localStorage.removeItem('adminSession');
			}
			set(admin);
		},
		logout: () => {
			localStorage.removeItem('adminSession');
			set(null);
		}
	};
}

export const currentAdmin = createAdminStore();
