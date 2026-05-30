import Products from "@/components/products/Products"
import { useQuery } from "@tanstack/react-query";
import { API } from "./types";

const getProducts = async () => {
    const res = await fetch(`${API}/products`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    })

    const data = await res.json();


    if (!res.ok) return null;

    return data;
}

export const useProduct = () => {
    const query = useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
        retry: false,
        staleTime: 1000 * 60 * 5,

    })
    return {
        products: query?.data?.data,
        loading: query.isLoading,
        isEmpty: !query.data?.data || (query?.data.data.isArray && query.data?.data.length === 0),
        error: query.error,
        isFetching: query.isFetching,
        refetch: query.refetch,
    };

}