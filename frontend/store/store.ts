import { configureStore } from "@reduxjs/toolkit";
//checking the git
import userReducer from "./userSlice"
export const store = configureStore({
    reducer: {
        user: userReducer
    }
})