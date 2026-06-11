import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItemType = {
    productId: string;
    quantity: number;
    selectedColor: {
        name: string;
        hex: string;
    };
};

export type AddItemArgumentType = CartItemType & {
    stock: number;
};

type CartStore = {
    cartItems: CartItemType[];
    addItem: (item: AddItemArgumentType) => void;
    removeItem: (item: CartItemType) => void;
    clearCart: () => void;
    setCart: (items: CartItemType[]) => void;
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

                    const safeQty = Math.min(item.quantity, item.stock);

                    if (index !== -1) {
                        const updated = [...state.cartItems];

                        updated[index] = {
                            ...updated[index],
                            quantity: Math.min(
                                updated[index].quantity + safeQty,
                                item.stock,
                            ),
                        };

                        return { cartItems: updated };
                    }

                    return {
                        cartItems: [
                            ...state.cartItems,
                            {
                                productId: item.productId,
                                quantity: safeQty,
                                selectedColor: item.selectedColor,
                            },
                        ],
                    };
                }),

            removeItem: (item) =>
                set((state) => ({
                    cartItems: state.cartItems.filter(
                        (i) =>
                            !(
                                i.productId === item.productId &&
                                i.selectedColor?.name === item.selectedColor?.name
                            )
                    ),
                })),

            setCart: (items) => set({ cartItems: items }),
            clearCart: () => set({ cartItems: [] }),
        }),
        {
            name: "cart-storage",
        }
    )
);