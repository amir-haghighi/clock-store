import { useCallback } from "react";

const CART_KEY = "cartItems";

export type CartItemType = {
    productId: string;
    quantity: number;
    selectedColor?: {
        name: string, hex: string
    };
    discountPrice: number;
    brand: string;
    image: string;
    slug: string;
    stock: number;
    title: string;
    // selectedSize?: string;
    price: number;
};

export const useCart = () => {
    const addToCartOffline = useCallback((item: CartItemType) => {
        const stored = localStorage.getItem(CART_KEY);

        const cart: CartItemType[] = stored ? JSON.parse(stored) : [];

        // find same product + same variants
        const existingIndex = cart.findIndex(
            (p) =>
                p.productId === item.productId &&
                p.selectedColor?.name === item.selectedColor?.name
            // p.selectedSize === item.selectedSize
        );

        if (existingIndex !== -1) {
            // update quantity instead of duplicating

            cart[existingIndex].quantity = item.quantity + cart[existingIndex].quantity < item.stock ? item.quantity + cart[existingIndex].quantity : cart[existingIndex].quantity
                ;

        } else {
            cart.push(item);
        }

        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    },
        []
    );

    const cartItems = !!localStorage.getItem(CART_KEY) ? JSON.parse(localStorage.getItem(CART_KEY)!) : []

    return { addToCartOffline, cartItems };
};