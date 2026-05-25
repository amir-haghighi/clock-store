import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API, User } from "./types";

type SignupInput = {
    name: string;
    email: string;
    password: string;
};

const signupUser = async (data: SignupInput): Promise<any> => {
    const res = await fetch(`${API}/auth/signup`, {
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

export function useSignup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: signupUser,

        onSuccess: (data) => {
            // sync user after signup
            queryClient.setQueryData(["me"], data.data);
        },
    });
}