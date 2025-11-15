import { writable } from 'svelte/store';

function createAddressStore() {
	const { subscribe, set } = writable([]);

	return {
		subscribe,
		set
	};
}

export const addresses = createAddressStore();

// Keep derived store
import { derived } from 'svelte/store';
export const defaultAddress = derived(
	addresses,
	($addresses) => $addresses.find((addr) => addr.isDefault) || null
);
