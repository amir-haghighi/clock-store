import { DetailedCartItemType } from "@/hooks/useCart";
import api from "@/lib/api";
import { CartItemType } from "@/store/useCartStore";

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

export const fetchServerCart = async (): Promise<DetailedCartItemType[]> => {
    const res = await api.get("/cart")
    let { data } = await api.get('/cart');
    return data?.data?.items ?? [];
};

export const fetchCartDetails = async (
    items: Partial<CartItemType>[]
): Promise<DetailedCartItemType[]> => {
    if (!items.length) return [];
    const { data } = await api.post("cart/getDetails", { items })
    return data?.data ?? [];
};

export const pushCartMerge = async (
    items: CartItemType[]
): Promise<DetailedCartItemType[]> => {
    const { data } = await api.post("/cart/merge", { items });
    return data?.data?.items ?? [];
};

export const apiAddItem = async (item: CartItemType): Promise<DetailedCartItemType[]> => {

    const { data } = await api.post("/cart/items", item)
    return data?.data?.items ?? [];
};

export const apiUpdateItem = async (
    productId: string,
    quantity: number,
    selectedColor: { name: string; hex: string }
): Promise<void> => {
    await api.patch(`/cart/items/${productId}`, { quantity, selectedColor })
};

export const apiRemoveItem = async (
    productId: string,
    selectedColor: { name: string; hex: string }
): Promise<void> => {
    await api.delete(`/cart/items/${productId}`, { data: { selectedColor } })

};
