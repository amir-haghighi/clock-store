import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItemType = {
    productId: string;
    quantity: number;
    selectedColor?: {
        name: string;
        hex: string;
    };
    discountPrice: number;
    brand: string;
    image: string;
    slug: string;
    stock: number;
    title: string;
    price: number;
    updatedAt: number; // ← اضافه شد
};

type CartStore = {
    cartItems: CartItemType[];
    addItem: (item: CartItemType) => void;
    putItems: (items: CartItemType[]) => void;
    removeAll: () => void;
    removeItem: (item: CartItemType) => void;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            cartItems: [],

            addItem: (item) =>
                set((state) => {
                    const index = state.cartItems.findIndex(
                        (i) =>
                            i.productId === item.productId &&
                            i.selectedColor?.name === item.selectedColor?.name
                    );

                    if (index !== -1) {
                        const updated = [...state.cartItems];
                        const current = updated[index];
                        updated[index] = {
                            ...current,
                            quantity: Math.min(current.quantity + item.quantity, item.stock),
                            updatedAt: Date.now(), // ← اضافه شد
                        };
                        return { cartItems: updated };
                    }

                    return {
                        cartItems: [
                            ...state.cartItems,
                            {
                                ...item,
                                quantity: Math.min(item.quantity, item.stock),
                                updatedAt: Date.now(), // ← اضافه شد
                            },
                        ],
                    };
                }),

            removeItem: (item) =>
                set((state) => {
                    const index = state.cartItems.findIndex(
                        (i) =>
                            i.productId === item.productId &&
                            i.selectedColor?.name === item.selectedColor?.name
                    );

                    if (index === -1) return state;

                    const updated = [...state.cartItems];
                    const current = updated[index];
                    const newQuantity = current.quantity - item.quantity;

                    if (newQuantity <= 0) {
                        updated.splice(index, 1);
                    } else {
                        updated[index] = {
                            ...current,
                            quantity: newQuantity,
                            updatedAt: Date.now(), // ← اضافه شد
                        };
                    }

                    return { cartItems: updated };
                }),

            putItems: (items) => set({ cartItems: items }),
            removeAll: () => set({ cartItems: [] }),
        }),
        { name: "cart-storage" }
    )
);