import { useMutation, useQueryClient } from "@tanstack/react-query";

const API = process.env.NEXT_PUBLIC_API_URL;

type LogoutResponse = {
    message: string;
};

const logoutUser = async (): Promise<LogoutResponse> => {
    const res = await fetch(`${API}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
        throw data;
    }

    return data;
};

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutUser,

        onSuccess: () => {
            // پاک کردن user از cache
            queryClient.setQueryData(["me"], null);
            queryClient.invalidateQueries({ queryKey: ["me"] })
            // یا:
            // queryClient.removeQueries({ queryKey: ["me"] })
        },
    });
}