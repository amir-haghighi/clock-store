"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CartItemType, useCartStore } from "@/store/useCartStore";
import { useUser } from "@/hooks/useUser";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

// ───────────────────────────────────────────
// Types
// ───────────────────────────────────────────

export type DetailedCartItemType = {
    productId: string;
    quantity: number;

    selectedColor: {
        name: string;
        hex: string;
    };

    title: string;
    slug: string;
    brand: string;
    image: string;

    price: number;
    discountPrice: number | null;
    stock: number;
};

export type CartType = DetailedCartItemType[];

// ───────────────────────────────────────────
// fetch cart
// ───────────────────────────────────────────

const fetchServerCart = async (): Promise<DetailedCartItemType[]> => {
    const res = await fetch(`${API}/api/v1/cart`, {
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("fetch failed");
    }

    const data = await res.json();
    return data?.data?.items ?? [];
};

// ───────────────────────────────────────────
// fetch details
// ───────────────────────────────────────────

const fetchCartDetails = async (
    items: Partial<CartItemType>[]
): Promise<DetailedCartItemType[]> => {
    const res = await fetch(`${API}/api/v1/cart/getDetails`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
    });

    if (!res.ok) {
        throw new Error("fetching cartDetails failed");
    }

    const data = await res.json();

    return data?.data ?? [];
};

// ───────────────────────────────────────────
// merge cart
// ───────────────────────────────────────────

const pushCartForMerge = async (
    items: CartItemType[]
): Promise<DetailedCartItemType[]> => {
    const res = await fetch(`${API}/api/v1/cart/merge`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
    });

    if (!res.ok) {
        throw new Error("cart merge failed");
    }

    const data = await res.json();

    return data?.data?.items ?? [];
};

// ───────────────────────────────────────────
// hook
// ───────────────────────────────────────────

export const useCart = () => {
    const {
        cartItems: offlineCartItems,
        removeItem: removeItemOffline,
        decreaseItem: decreaseItemOffline,
        increaseItem: increaseItemOffline,
        addItem: addItemOffline,
    } = useCartStore();

    const { isAuthenticated } = useUser();
    const queryClient = useQueryClient();

    // ───────────────────────────────────────
    // server cart
    // ───────────────────────────────────────

    const cartQuery = useQuery({
        queryKey: ["cart"],
        queryFn: fetchServerCart,
        enabled: isAuthenticated,
        staleTime: 60_000,
    });

    // ───────────────────────────────────────
    // get details for guest cart
    // ───────────────────────────────────────
    const cartKey = offlineCartItems
        .map(i => `${i.productId}-${i.selectedColor.name}-${i.quantity}`)
        .sort()
        .join("|");
    const detailsQuery = useQuery({
        queryKey: ["cart-details", cartKey],
        queryFn: () => fetchCartDetails(offlineCartItems),
        enabled: !isAuthenticated && offlineCartItems.length > 0,
        placeholderData: (prev) => prev,
    });
    // ───────────────────────────────────────
    // merge cart
    // ───────────────────────────────────────

    const mergeMutation = useMutation({
        mutationFn: pushCartForMerge,

        onSuccess: (items) => {
            queryClient.setQueryData(["cart"], items);
        },
    });

    // ───────────────────────────────────────
    // add item
    // ───────────────────────────────────────
    const addItem = async (item: CartItemType) => {

        const detailedItem = detailsQuery.data?.find(
            (val) =>
                val.productId === item.productId &&
                val.selectedColor.name === item.selectedColor.name
        );

        const stock = detailedItem?.stock ?? 0;
        if (isAuthenticated) {
            await mergeMutation.mutateAsync([item]);
        }

        addItemOffline({
            ...item,
            stock,
        });
    };
    // ───────────────────────────────────────
    // increase and decrease  item
    // ───────────────────────────────────────
    const increaseItem = async (item: {
        productId: string;
        selectedColor: { name: string; hex: string };
    }) => {
        const detailedItem = detailsQuery.data?.find(
            (val) =>
                val.productId === item.productId &&
                val.selectedColor.name === item.selectedColor.name
        );
        const stock = detailedItem?.stock ?? 0;
        // ───── GUEST ─────
        if (!isAuthenticated) {
            increaseItemOffline({
                productId: item.productId,
                selectedColor: item.selectedColor,
                stock
            });
            return;
        }

        // ───── AUTH ─────
        const current = cartQuery.data?.find(
            (i) =>
                i.productId === item.productId &&
                i.selectedColor?.name === item.selectedColor.name
        );

        await fetch(`${API}/api/v1/cart/items/${item.productId}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                quantity: (current?.quantity ?? 0) + 1,
                selectedColor: item.selectedColor,
            }),
        });

        queryClient.invalidateQueries({ queryKey: ["cart"] });
    };

    const decreaseItem = async (item: {
        productId: string;
        selectedColor: { name: string; hex: string };
    }) => {
        if (!isAuthenticated) {
            decreaseItemOffline({
                productId: item.productId,
                selectedColor: item.selectedColor,
            });
            return;
        }

        const current = cartQuery.data?.find(
            (i) =>
                i.productId === item.productId &&
                i.selectedColor?.name === item.selectedColor.name
        );

        const newQty = (current?.quantity ?? 1) - 1;

        // if goes to 0 → remove instead of patch
        if (newQty <= 0) {
            await fetch(`${API}/api/v1/cart/items/${item.productId}`, {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    selectedColor: item.selectedColor,
                }),
            });

            queryClient.invalidateQueries({ queryKey: ["cart"] });
            return;
        }

        await fetch(`${API}/api/v1/cart/items/${item.productId}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                quantity: newQty,
                selectedColor: item.selectedColor,
            }),
        });

        queryClient.invalidateQueries({ queryKey: ["cart"] });
    };

    const removeItem = async (item: {
        productId: string;
        selectedColor: { name: string; hex: string };
    }) => {

        if (!isAuthenticated) {
            removeItemOffline({
                productId: item.productId,
                selectedColor: item.selectedColor,
            });
            return;
        }

        await fetch(`${API}/api/v1/cart/items/${item.productId}`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                selectedColor: item.selectedColor,
            }),
        });

        queryClient.invalidateQueries({ queryKey: ["cart"] });
    };
    // ───────────────────────────────────────
    // items
    // ───────────────────────────────────────

    const items = isAuthenticated
        ? cartQuery.data ?? []
        : detailsQuery.data ?? [];
    // ───────────────────────────────────────
    // loading
    // ───────────────────────────────────────

    const isLoading = isAuthenticated
        ? cartQuery.isPending
        : detailsQuery.isPending

    return {
        items,

        addItem,
        removeItem,
        increaseItem,
        decreaseItem,
        offlineCartItems,

        isLoading,
        isSyncing: mergeMutation.isPending,
        isError:
            cartQuery.isError ||
            detailsQuery.isError ||
            mergeMutation.isError
    };
};