import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
    name: "action",
    initialState: {
        onProccess: false,
    },
    reducers: {
        startProccess: (state) => {
            state.onProccess = true;
        },
        stopProccess: (state) => {
            state.onProccess = false;
        },
    },
});

export const { startProccess, stopProccess } = menuSlice.actions;
export default menuSlice.reducer;