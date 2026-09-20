// Cart state & products
import { writable } from 'svelte/store';

function createCart() {
	const storedCart = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
	const initialCart = storedCart ? JSON.parse(storedCart) : [];

	const { subscribe, set, update } = writable(initialCart);

	function saveCart(items) {
		if (typeof window !== 'undefined') {
			localStorage.setItem('cart', JSON.stringify(items));
		}
	}

	return {
		subscribe,
		addItem: (product, quantity) => {
			update((items) => {
				const existingItem = items.find((item) => item.product.id === product.id);
				let newItems;

				if (existingItem) {
					newItems = items.map((item) =>
						item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
					);
				} else {
					newItems = [...items, { product, quantity }];
				}
				saveCart(newItems);
				return newItems;
			});
		},
		removeItem: (productId) => {
			update((items) => {
				const newItems = items.filter((item) => item.product.id !== productId);
				saveCart(newItems);
				return newItems;
			});
		},
		updateQuantity: (productId, quantity) => {
			update((items) => {
				let newItems;
				if (quantity <= 0) {
					newItems = items.filter((item) => item.product.id !== productId);
				} else {
					newItems = items.map((item) =>
						item.product.id === productId ? { ...item, quantity } : item
					);
				}
				saveCart(newItems);
				return newItems;
			});
		},
		clear: () => {
			saveCart([]);
			set([]);
		},
		getTotal: (items) => {
			return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
		}
	};
}

export const cart = createCart();
export const isCartOpen = writable(false);
