import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API, User } from "./types";

const fetchMe = async (): Promise<User | null> => {
    console.log(`${API}/users/me`)
    const res = await fetch(`${API}/users/me`, {
        method: "GET",
        credentials: "include",
    });

    const data = await res.json();

    console.log("res data:", data);

    if (!res.ok) return null;

    return data;
};
export function useCurrentUser() {


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