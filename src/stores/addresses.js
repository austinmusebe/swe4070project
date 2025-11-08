import { writable, derived } from 'svelte/store';
import { currentUser } from './user.js';

function createAddressStore() {
	const { subscribe, set, update } = writable([]);

	// Load addresses when user changes
	currentUser.subscribe((user) => {
		if (user) {
			const userAddresses = JSON.parse(localStorage.getItem(`addresses_${user.id}`) || '[]');
			set(userAddresses);
		} else {
			set([]);
		}
	});

	return {
		subscribe,
		add: (address, userId) => {
			update((addresses) => {
				const newAddress = {
					id: Date.now().toString(),
					...address,
					isDefault: addresses.length === 0
				};
				const updated = [...addresses, newAddress];
				localStorage.setItem(`addresses_${userId}`, JSON.stringify(updated));
				return updated;
			});
		},
		update: (addressId, updates, userId) => {
			update((addresses) => {
				const updated = addresses.map((addr) =>
					addr.id === addressId ? { ...addr, ...updates } : addr
				);
				localStorage.setItem(`addresses_${userId}`, JSON.stringify(updated));
				return updated;
			});
		},
		delete: (addressId, userId) => {
			update((addresses) => {
				const updated = addresses.filter((addr) => addr.id !== addressId);
				localStorage.setItem(`addresses_${userId}`, JSON.stringify(updated));
				return updated;
			});
		},
		setDefault: (addressId, userId) => {
			update((addresses) => {
				const updated = addresses.map((addr) => ({
					...addr,
					isDefault: addr.id === addressId
				}));
				localStorage.setItem(`addresses_${userId}`, JSON.stringify(updated));
				return updated;
			});
		}
	};
}

export const addresses = createAddressStore();

// Derived store for default address
export const defaultAddress = derived(
	addresses,
	($addresses) => $addresses.find((addr) => addr.isDefault) || null
);
