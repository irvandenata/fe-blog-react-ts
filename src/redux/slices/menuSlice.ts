import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const menuSlice = createSlice({
    name: "menu",
    initialState: {
        name:'Dashboard',
    },
    reducers: {
        setMenu: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
    },
});

export const { setMenu } = menuSlice.actions;
export default menuSlice.reducer;