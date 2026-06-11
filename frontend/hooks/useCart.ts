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
    const { cartItems: offlineCartItems, setCart, addItem: addItemOffline, clearCart } = useCartStore();
    const { products } = useProducts()
    console.log({ hori: products })
    const hasSynced = useRef(false);
    const { isAuthenticated } = useUser();
    const query = useQuery({
        queryKey: ["cart"],
        queryFn: fetchServerCart,
        enabled: isAuthenticated,
        staleTime: 1000 * 60,
    });
    let addItem: (item: CartItemType) => void = () => { }
    useEffect(() => {
        // if the user is offline
        if (!isAuthenticated) {
            addItem = (args: CartItemType) => addItemOffline({ ...args, stock })
        }
        // online mode 
        else {



            // addItem = useMutation({
            //     mutationFn: pushCartForMerge,
            //     onError: () => {
            //         const hasSynced = useRef(false);
            //     }
            //         onSuccess: () => {
            //         const hasSynced = useRef(false);
            //         clearCart()

            //         // پاک کردن user از cache
            //         queryClient.setQueryData(["me"], null);
            //         queryClient.invalidateQueries({ queryKey: ["me"] })
            //         // یا:
            //         // queryClient.removeQueries({ queryKey: ["me"] })
            //     },
            // })

        }
    }, [isAuthenticated])



    // console.log({ cartItemssss: offlineCartItems })




    // console.log({ dataaaa: query.data })

    // const sourceOfTruth = query?.data ??
    //     // فقط hydrate از سرور (بدون merge در فرانت)
    //     useEffect(() => {
    //         if (!isAuthenticated) return;
    //         if (!query.data) return;
    //         if (hasSynced.current) return;

    //         // setCart(query.data);
    //         hasSynced.current = true;

    //         // ارسال cart لوکال برای merge در بک‌اند
    //         pushCartForMerge(cartItems);
    //     }, [query.data, isAuthenticated]);

    // useEffect(() => {
    //     if (!isAuthenticated) {
    //         hasSynced.current = false;
    //     }
    // }, [isAuthenticated]);

    // const syncMutation = useMutation({
    //     mutationFn: () => pushCartForMerge(cartItems),
    // });

    // if (query?.data) {
    //     const cartDetails = query.data.map(cartItem => {
    //         console.log({ cartItem })
    //         const product = products.find(p => p.id === cartItem.id);

    //         return {
    //             ...product,
    //             quantity: cartItem.quantity,
    //             selectedColor: cartItem.selectedColor
    //         };
    //     });
    // }

    // return {
    //     // cartItems,   
    //     isLoading: isAuthenticated && query.isLoading,
    //     isError: query.isError,
    //     refetch: query.refetch,
    //     syncCart: syncMutation.mutate,
    // };
    return {
        cartItems: []
    }
};