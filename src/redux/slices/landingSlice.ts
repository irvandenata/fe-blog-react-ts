import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const landingSlice = createSlice({
    name: "landing",
    initialState: {
        header: {
            is_load: false,
            data: {},
        },
    },
    reducers: {
        setHeader: (state, action: PayloadAction<any>) => {
            state.header.data = action.payload;
            state.header.is_load = true;
        },
    },
});

export const { setHeader } = landingSlice.actions;
export default landingSlice.reducer;
