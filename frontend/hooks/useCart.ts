"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CartItemType, useCartStore } from "@/store/useCartStore";
import { useUser } from "@/hooks/useUser";
import { useEffect, useRef } from "react";
import { fetchServerCart, apiAddItem, apiRemoveItem, apiUpdateItem, fetchCartDetails, pushCartMerge } from "@/services/cartServices";

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
// hook
// ───────────────────────────────────────────

export const useCart = () => {
    const {
        cartItems: offlineCartItems,
        removeItem: removeItemOffline,
        decreaseItem: decreaseItemOffline,
        increaseItem: increaseItemOffline,
        addItem: addItemOffline,
        setCart: setOfflineItems,
        clearCart: clearOfflineItems
    } = useCartStore();

    const { isAuthenticated } = useUser();
    const queryClient = useQueryClient();

    // track previous auth state to detect login/logout transitions
    const prevAuthRef = useRef<boolean | null>(null);

    // ───────────────────────────────────────
    // server cart (auth only)
    // ───────────────────────────────────────

    const cartQuery = useQuery({
        queryKey: ["cart"],
        queryFn: fetchServerCart,
        enabled: isAuthenticated,
        staleTime: 1000 * 30,  // 30s or more 
        refetchOnMount: false
    });

    // ───────────────────────────────────────
    // guest cart details (guest only)
    // quantity intentionally excluded from key — product details don't
    // change when quantity changes, only when items/colors change
    // ───────────────────────────────────────

    const cartKey = offlineCartItems
        .map(i => `${i.productId}-${i.selectedColor.name}`)
        .sort()
        .join("|");
    const detailsQuery = useQuery({
        queryKey: ["cart-details", cartKey],
        queryFn: () => fetchCartDetails(
            offlineCartItems.map(i => ({
                productId: i.productId,
                selectedColor: i.selectedColor,
            }))
        ),
        enabled: !isAuthenticated && offlineCartItems.length > 0,
        staleTime: 10000,
    });
    // ───────────────────────────────────────
    // merge mutation (used on login)
    // ───────────────────────────────────────

    const mergeMutation = useMutation({
        mutationFn: pushCartMerge,
        onSuccess: (items) => {
            queryClient.setQueryData(["cart"], items);
            clearOfflineItems();
        },
    });

    // ───────────────────────────────────────
    // login transition: merge local → server, then clear local
    // logout transition: copy server cart → Zustand
    // ───────────────────────────────────────

    useEffect(() => {
        const prev = prevAuthRef.current;

        // login: prev was false/null, now true
        if (prev === false && isAuthenticated) {
            if (offlineCartItems.length > 0) {
                mergeMutation.mutate(offlineCartItems);
            } else {
                // nothing to merge, just clear in case
                clearOfflineItems();
            }
        }

        // logout: prev was true, now false
        if (prev === true && !isAuthenticated) {
            const serverItems = queryClient.getQueryData<DetailedCartItemType[]>(["cart"]);
            if (serverItems?.length) {
                // convert DetailedCartItemType → CartItemType for Zustand
                const offlineItems: CartItemType[] = serverItems.map((i) => ({
                    productId: i.productId,
                    quantity: i.quantity,
                    selectedColor: i.selectedColor,
                    stock: i.stock,
                }));
                setOfflineItems(offlineItems);
            }
            queryClient.removeQueries({ queryKey: ["cart"] });
        }

        prevAuthRef.current = isAuthenticated;
    }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

    // ───────────────────────────────────────
    // addItem
    // ───────────────────────────────────────
    const addItem = async (item: CartItemType) => {
        if (isAuthenticated) {
            try {
                const updatedItems = await apiAddItem(item);
                queryClient.setQueryData(["cart"], updatedItems);
            } catch (err) {
                console.error("addItem failed:", err);
            }
            return;
        }

        // guest: fetch details on-demand برای این آیتم خاص
        let stock = 999; // fallback امن
        try {
            const details = await fetchCartDetails([item]);
            const detailedItem = details.find(
                (v) => v.productId === item.productId &&
                    v.selectedColor.name === item.selectedColor.name
            );
            stock = detailedItem?.stock ?? 999;
        } catch {
            // اگه fetch fail شد، با stock=999 ادامه بده
        }

        addItemOffline({ ...item, stock });
    };
    // ───────────────────────────────────────
    // increaseItem
    // ───────────────────────────────────────

    const increaseItem = async (item: {
        productId: string;
        selectedColor: { name: string; hex: string };
    }) => {
        if (!isAuthenticated) {
            const detailedItem = detailsQuery.data?.find(
                (v) =>
                    v.productId === item.productId &&
                    v.selectedColor.name === item.selectedColor.name
            );
            increaseItemOffline({
                productId: item.productId,
                selectedColor: item.selectedColor,
                stock: detailedItem?.stock ?? 0,
            });
            return;
        }

        const current = cartQuery.data?.find(
            (i) =>
                i.productId === item.productId &&
                i.selectedColor?.name === item.selectedColor.name
        );

        try {
            await apiUpdateItem(
                item.productId,
                (current?.quantity ?? 0) + 1,
                item.selectedColor
            );
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        } catch (err) {
            console.error("increaseItem failed:", err);
        }
    };

    // ───────────────────────────────────────
    // decreaseItem
    // ───────────────────────────────────────

    const decreaseItem = async (item: {
        productId: string;
        selectedColor: { name: string; hex: string };
    }) => {
        if (!isAuthenticated) {
            const current = offlineCartItems.find(
                i => i.productId === item.productId &&
                    i.selectedColor.name === item.selectedColor.name
            );
            if ((current?.quantity ?? 1) <= 1) {
                removeItemOffline({ productId: item.productId, selectedColor: item.selectedColor });
            } else {
                decreaseItemOffline({ productId: item.productId, selectedColor: item.selectedColor });
            }
            return;
        }

        const current = cartQuery.data?.find(
            (i) =>
                i.productId === item.productId &&
                i.selectedColor?.name === item.selectedColor.name
        );

        const newQty = (current?.quantity ?? 1) - 1;

        try {
            if (newQty <= 0) {
                await apiRemoveItem(item.productId, item.selectedColor);
            } else {
                await apiUpdateItem(item.productId, newQty, item.selectedColor);
            }
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        } catch (err) {
            console.error("decreaseItem failed:", err);
        }
    };

    // ───────────────────────────────────────
    // removeItem
    // ───────────────────────────────────────

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

        try {

            await apiRemoveItem(item.productId, item.selectedColor);
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        } catch (err) {
            console.error("removeItem failed:", err);
        }
    };

    // ───────────────────────────────────────
    // derived
    // ───────────────────────────────────────

    const items: DetailedCartItemType[] = isAuthenticated
        ? cartQuery.data ?? []
        : detailsQuery.data?.map((item) => {
            const localItem = offlineCartItems.find(
                (i) =>
                    i.productId === item.productId &&
                    i.selectedColor.name === item.selectedColor.name
            );

            return {
                ...item,
                quantity: localItem?.quantity ?? item.quantity ?? 1,
            };
        }) ?? [];
    const isLoading = isAuthenticated
        ? cartQuery.isPending
        : detailsQuery.isPending && offlineCartItems.length > 0;

    return {
        items,
        offlineCartItems,

        addItem,
        removeItem,
        increaseItem,
        decreaseItem,

        isLoading,
        isSyncing: mergeMutation.isPending,
        isError:
            cartQuery.isError || detailsQuery.isError || mergeMutation.isError,
    };
};