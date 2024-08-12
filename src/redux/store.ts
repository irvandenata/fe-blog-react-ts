import { configureStore } from '@reduxjs/toolkit';
import menuReducer from '@/redux/slices/menuSlice';
import modalReducer from '@/redux/slices/modalSlice';
import actionReducer from '@/redux/slices/actionSlice';
import imageModalReducer from '@/redux/slices/imageModalSlice';
const store = configureStore({
    reducer: {
        menu: menuReducer,
        action: actionReducer,
        modal: modalReducer,
        imageModal: imageModalReducer,
    },
});

store.subscribe(() => {
   console.log("Store Change : ", store.getState());
});
export default store;