// Cart state & products
import { writable } from 'svelte/store';

function createCart() {
	const { subscribe, set, update } = writable([]);

	return {
		subscribe,
		addItem: (product, quantity) => {
			update((items) => {
				const existingItem = items.find((item) => item.product.id === product.id);

				if (existingItem) {
					return items.map((item) =>
						item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
					);
				}

				return [...items, { product, quantity }];
			});
		},
		removeItem: (productId) => {
			update((items) => items.filter((item) => item.product.id !== productId));
		},
		updateQuantity: (productId, quantity) => {
			update((items) => {
				if (quantity <= 0) {
					return items.filter((item) => item.product.id !== productId);
				}
				return items.map((item) => (item.product.id === productId ? { ...item, quantity } : item));
			});
		},
		clear: () => set([]),
		getTotal: (items) => {
			return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
		}
	};
}

export const cart = createCart();
export const isCartOpen = writable(false);
