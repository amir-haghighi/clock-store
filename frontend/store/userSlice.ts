import { createSlice } from "@reduxjs/toolkit"



const initialState = {
    name: "",
    email: "",
    role: "",
    isVerified: false,
    avatar: ""
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        editUser: (state, action) => {
            Object.assign(state, action.payload)
        }

    }
})

export const { editUser } = userSlice.actions
export default userSlice.reducer