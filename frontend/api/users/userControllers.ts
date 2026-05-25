
export type UserType = {
    id: string
    name: string
    email: string
}

export async function getMe(): Promise<UserType> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`)
    if (!res.ok) throw new Error("Failed to fetch users")
    return res.json()

}

export const signup = async (data: any) => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.log(result.message);
            return;
        }

        return result
    } catch (error) {
        return error
    }
}
