import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const modalSlice = createSlice({
    name: "modal",
    initialState: {
        isOpen: false,
        title: "",
        onProcess: false,
        isUpdate: false,
        keyId: 0,
    },
    reducers: {
        setModal: (
            state,
            action: PayloadAction<{
                isOpen: boolean;
                title?: string;
                isUpdate?: boolean;
                keyId?: any;
            }>
        ) => {
            state.isOpen = action.payload.isOpen
            state.title = action.payload.title || state.title;
            state.isUpdate = action.payload.isUpdate || state.isUpdate;
            state.keyId = action.payload.keyId || state.keyId;
        },
        cloeModal: (state) => {
            state.isOpen = false;
        },
        openModal: (state) => {
            state.isOpen = true;
        },
        resetModal: (state) => {
            state.isOpen = false;
            state.title = "";
        },
        startProccess: (state) => {
            state.onProcess = true;
        },
        endProccess: (state) => {
            state.onProcess = false;
        },
    },
});

export const { setModal, cloeModal, openModal , resetModal, startProccess, endProccess } = modalSlice.actions;
export default modalSlice.reducer;
