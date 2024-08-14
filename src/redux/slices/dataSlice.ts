import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const dataSlice = createSlice({
    name: "data",
    initialState: {
        selectedOption: [],
        onLoadSelectedOption: false,
        tags: [],
    },
    reducers: {
        storeDataState: (
            state,
            action: PayloadAction<{
                selectedOption?: any;
                tags?: any;
            }>
        ) => {
            state.selectedOption =
                action.payload.selectedOption || state.selectedOption;
            state.tags = action.payload.tags || state.tags;
        },
        setOnLoadSelectedOption: (state, action: PayloadAction<boolean>) => {
            state.onLoadSelectedOption = action.payload;
        },
        resetDataState: (state) => {
            state.selectedOption = [];
            state.tags = [];
        },
    },
});

export const { storeDataState, resetDataState,setOnLoadSelectedOption } = dataSlice.actions;
export default dataSlice.reducer;
