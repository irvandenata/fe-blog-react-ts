import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const imageModalSlice = createSlice({
    name: "imageModal",
    initialState: {
        isOpen: false,
        title: "Image Detail",
        imageUrl: "",
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
                keyId?: number;
            }>
        ) => {
            state.isOpen = action.payload.isOpen;
            state.title = action.payload.title || state.title;
            state.isUpdate = action.payload.isUpdate || state.isUpdate;
            state.keyId = action.payload.keyId || state.keyId;
        },
        cloeModal: (state) => {
            state.isOpen = false;
        },
        openModal: (
            state,
            action: PayloadAction<{
                imageUrl: string;
            }>
        ) => {
            state.isOpen = true;
            state.imageUrl = action.payload.imageUrl;
        },
        resetModal: (state) => {
            state.isOpen = false;
            state.imageUrl = "";         
        },
        startProccess: (state) => {
            state.onProcess = true;
        },
        endProccess: (state) => {
            state.onProcess = false;
        },
    },
});

export const {
    setModal,
    cloeModal,
    openModal,
    resetModal,
    startProccess,
    endProccess,
} = imageModalSlice.actions;
export default imageModalSlice.reducer;
