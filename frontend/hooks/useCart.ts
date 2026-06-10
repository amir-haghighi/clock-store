"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { CartItemType, useCartStore } from "@/store/useCartStore";
import { useUser } from "@/hooks/useUser";
import { useProducts } from "./useProducts";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

// ── fetch cart ─────────────────────────────
const fetchServerCart = async (): Promise<CartItemType[]> => {
    console.log("fetching the cart ")
    const res = await fetch(`${API}/api/v1/cart`, {
        credentials: "include",
    });

    if (!res.ok) throw new Error("fetch failed");

    const data = await res.json();
    return data?.data?.items ?? [];
};

// ── send local cart to server for merge ───
const pushCartForMerge = async (items: CartItemType[]): Promise<void> => {
    await fetch(`${API}/api/v1/cart/merge`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
    });
};

export const useCart = () => {
    const { products } = useProducts()
    const { cartItems, putItems } = useCartStore();
    const { isAuthenticated } = useUser();
    const hasSynced = useRef(false);
    const query = useQuery({
        queryKey: ["cart"],
        queryFn: fetchServerCart,
        enabled: isAuthenticated,
        staleTime: 1000 * 60,
    });


    // فقط hydrate از سرور (بدون merge در فرانت)
    useEffect(() => {
        if (!isAuthenticated) return;
        if (!query.data) return;
        if (hasSynced.current) return;

        putItems(query.data);
        hasSynced.current = true;

        // ارسال cart لوکال برای merge در بک‌اند
        pushCartForMerge(cartItems);
    }, [query.data, isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) {
            hasSynced.current = false;
        }
    }, [isAuthenticated]);

    const syncMutation = useMutation({
        mutationFn: () => pushCartForMerge(cartItems),
    });

    if (query?.data) {
        const cartDetails = query.data.map(cartItem => {
            console.log({ cartItem })
            const product = products.find(p => p.id === cartItem.id);

            return {
                ...product,
                quantity: cartItem.quantity,
                selectedColor: cartItem.selectedColor
            };
        });
    }

    return {
        cartItems,
        isLoading: isAuthenticated && query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
        syncCart: syncMutation.mutate,
    };
};