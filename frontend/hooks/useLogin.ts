import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User, API } from "./types";


type LoginInput = {
    email: string;
    password: string;
};

const loginUser = async (data: LoginInput): Promise<User> => {
    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw await res.json();
    }

    return res.json();
};

export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginUser,

        onSuccess: (data) => {
            // sync user in cache
            queryClient.setQueryData(["me"], data.data);
        },
    });
}