import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
    name: "action",
    initialState: {
        onProccess: false,
        name : "view-data",
    },
    reducers: {
        startProccess: (state) => {
            state.onProccess = true;
        },
        setAction : (state, action) => {
            state.name = action.payload.name;
        },
        stopProccess: (state) => {
            state.onProccess = false;
        },
    },
});

export const { startProccess, stopProccess,setAction } = menuSlice.actions;
export default menuSlice.reducer;