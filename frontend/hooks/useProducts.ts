import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "./types";
// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductFilters {
    brand?: string;
    category?: string;
    gender?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    search?: string;
    sort?: "newest" | "price" | "-price" | "rating";
    page?: number;
    limit?: number;
}

export interface ReviewPayload {
    rating: number;
    comment: string;
}

export interface CreateProductPayload {
    title: string;
    slug: string;
    brand: string;
    watchModel: string;
    description: string;
    images: string[];
    price: number;
    discountPrice?: number;
    stock: number;
    category: "luxury" | "sport" | "casual" | "smart" | "classic" | "dress";
    gender: "men" | "women" | "unisex";
    colors?: { name: string; hex: string }[];
    specifications?: Record<string, string>;
    isFeatured?: boolean;
}

// ─── Fetch Helpers ────────────────────────────────────────────────────────────

// const getToken = () => localStorage.getItem("token");

// const authHeaders = () => ({
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${getToken()}`,
// });

// ─── Public Hooks ─────────────────────────────────────────────────────────────

/**
 * GET /api/products
 * لیست محصولات با فیلتر و صفحه‌بندی
 */
export const useProducts = (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== "") params.set(key, String(val));
    });

    const query = useQuery({
        queryKey: ["products", filters],
        queryFn: async () => {
            const res = await fetch(`${API}/api/v1/products?${params.toString()}`, {
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data;
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    return {
        products: query.data?.products ?? [],
        page: query.data?.page,
        pages: query.data?.pages,
        total: query.data?.total,
        loading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
        refetch: query.refetch,
    };
};

/**
 * GET /api/products/featured
 * محصولات ویژه صفحه اصلی
 */

export const useFeaturedProducts = (filters: {}) => {
    // const params = new URLSearchParams(filters); 
    const query = useQuery({
        queryKey: ["products", "featured", filters],
        queryFn: async () => {
            const params = new URLSearchParams(filters);
            const res = await fetch(`${API}/api/v1/products/?${params.toString()}`, {
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data;
        },
        staleTime: 1000 * 60 * 10,
        retry: false,
    });
    return {
        isEmpty: !query?.data?.data,
        products: query.data?.data ?? [],
        loading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
        refetch: query.refetch
    };
};

/**
 * GET /api/products/:slug
 * جزئیات یک محصول
 */
export const useProductBySlug = (slug: string) => {
    const query = useQuery({
        queryKey: ["products", slug],
        queryFn: async () => {
            const res = await fetch(`${API}/api/v1/products/${slug}`, {
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data;
        },
        enabled: !!slug,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    return {
        product: query.data ? query.data?.data : null,
        loading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
    };
};

/**
 * POST /api/products/:id/reviews
 * ثبت نظر
 */
export const useCreateReview = (productId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (payload: ReviewPayload) => {
            const res = await fetch(`${API}/api/v1/products/${productId}/reviews`, {
                method: "POST",
                // headers: authHeaders(),
                body: JSON.stringify(payload),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data;
        },
        onSuccess: () => {
            // بعد از ثبت نظر، cache محصول رو invalidate می‌کنه
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    return {
        submitReview: mutation.mutate,
        loading: mutation.isPending,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
    };
};

// ─── Admin Hooks ──────────────────────────────────────────────────────────────

/**
 * POST /api/admin/products
 * ایجاد محصول جدید
 */
export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (payload: CreateProductPayload) => {
            const res = await fetch(`${API}/api/v1/admin/products`, {
                method: "POST",
                // headers: authHeaders(),
                body: JSON.stringify(payload),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    return {
        createProduct: mutation.mutate,
        loading: mutation.isPending,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
    };
};

/**
 * PUT /api/admin/products/:id
 * ویرایش محصول
 */
export const useUpdateProduct = (productId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (payload: Partial<CreateProductPayload>) => {
            const res = await fetch(`${API}/api/v1/admin/products/${productId}`, {
                method: "PUT",
                // headers: authHeaders(),
                body: JSON.stringify(payload),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    return {
        updateProduct: mutation.mutate,
        loading: mutation.isPending,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
    };
};

/**
 * DELETE /api/admin/products/:id
 * حذف محصول
 */
export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (productId: string) => {
            const res = await fetch(`${API}/api/v1/admin/products/${productId}`, {
                method: "DELETE",
                // headers: authHeaders(),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    return {
        deleteProduct: mutation.mutate,
        loading: mutation.isPending,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
    };
};

/**
 * DELETE /api/admin/products/:id/reviews/:reviewId
 * حذف نظر توسط admin
 */
export const useDeleteReview = (productId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (reviewId: string) => {
            const res = await fetch(
                `${API}/api/v1/admin/products/${productId}/reviews/${reviewId}`,
                {
                    method: "DELETE",
                    // headers: authHeaders(),
                    credentials: "include",
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products", productId] });
        },
    });

    return {
        deleteReview: mutation.mutate,
        loading: mutation.isPending,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
    };
};
