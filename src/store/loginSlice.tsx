import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LoginData = {
    username: string;
    role: string;
    accessToken: string;
    manufacturerId: string;
};

const initialState: LoginData = {
    username: "",
    role: "",
    accessToken: "",
    manufacturerId: "",
};

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<LoginData>) => {
            state.username = action.payload.username;
            state.role = action.payload.role;
            state.accessToken = action.payload.accessToken;
            state.manufacturerId = action.payload.manufacturerId;
        },
        logout: (state) => {
            state.username = "";
            state.role = "";
            state.accessToken = "";
            state.manufacturerId = "";
        },
    },
});

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
