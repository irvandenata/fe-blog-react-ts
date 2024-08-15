import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const landingSlice = createSlice({
    name: "landing",
    initialState: {
        header: {
            is_load: false,
            data: {},
        },
        techStack: {
            is_load: false,
            frontend: [],
            backend: [],
            others: [],
        },
    },
    reducers: {
        setHeader: (state, action: PayloadAction<any>) => {
            state.header.data = action.payload;
            state.header.is_load = true;
        },
        setTechStack: (state, action: PayloadAction<any>) => {
            state.techStack.frontend = action.payload.frontend;
            state.techStack.backend = action.payload.backend;
            state.techStack.others = action.payload.others;
            state.techStack.is_load = true;
        },
    },
});

export const { setHeader,setTechStack } = landingSlice.actions;
export default landingSlice.reducer;
