import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        profile: {},
    },
    reducers: {
        storeDataState: (
            state,
            action: PayloadAction<{
                profile?: any;
            }>
        ) => {
            state.profile = action.payload.profile || state.profile;
        },
        setDataUserState: (state, action: PayloadAction<any>) => {
            state.profile = action.payload;
        },
        resetDataUserState: (state) => {
            state.profile = {};
        },
    },
});

export const { storeDataState ,setDataUserState,resetDataUserState } = userSlice.actions;
export default userSlice.reducer;
