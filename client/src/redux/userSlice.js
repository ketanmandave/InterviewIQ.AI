import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        isAuthLoading: true,
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
            state.isAuthLoading = false;
        },
        clearUserData: (state) => {
            state.userData = null;
            state.isAuthLoading = false;
        },
    },
})

export const { setUserData, clearUserData } = userSlice.actions;

export default userSlice.reducer;
