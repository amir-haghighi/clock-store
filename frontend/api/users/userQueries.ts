import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getMe, signup } from "./userControllers"

export const useUser = () => {

    return useQuery({
        queryKey: ["user"],
        queryFn: getMe
    })
}

export const useCreateUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: signup,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["user"] }, { cancelRefetch: true });
            queryClient.setQueryData(["user"], data)
        },
    })
}