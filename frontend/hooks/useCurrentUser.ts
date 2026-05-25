import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API, User } from "./types";

const fetchMe = async (): Promise<User | null> => {
    const res = await fetch(`${API}/auth/me`, {
        credentials: "include",
    });

    if (!res.ok) return null;
    console.log("res", res.json)
    return res.json();
};

export function useCurrentUser() {
    const queryClient = useQueryClient();

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