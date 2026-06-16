import { useQuery, useQueryClient } from "@tanstack/react-query";
import { API, User } from "./types";
import api from "@/lib/api";

const fetchMe = async (): Promise<User | null> => {
    const { data: resData } = await api.get(`${API}/api/v1/users/me`)
    return resData;
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