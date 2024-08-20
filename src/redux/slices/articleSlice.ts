import { createSlice } from "@reduxjs/toolkit";

const articleSlice = createSlice({
    name: "article",
    initialState: {
        filter: {
            category: 0,
        },
    },
    reducers: {
        setCategoryFilter: (state, action) => {
            state.filter.category = action.payload.category;
        },
        resetFilter: (state) => {
            state.filter.category = 0;
        }
    },
});

export const {
    setCategoryFilter,
    resetFilter,
} = articleSlice.actions;
export default articleSlice.reducer;
