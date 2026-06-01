import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API, User } from "./types";

const fetchMe = async (): Promise<User | null> => {
    const res = await fetch(`${API}/api/v1/users/me`, {
        method: "GET",
        credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) return null;

    return data;
};
export function useUser() {


    const query = useQuery({
        queryKey: ["me"],
        queryFn: fetchMe,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });


    return {
        user: query.data,
        loading: query.isLoading,
        isAuthenticated: !!query.data,
        error: query.error,
        refetch: query.refetch,
    };
}