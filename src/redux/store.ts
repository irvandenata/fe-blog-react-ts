import { configureStore } from '@reduxjs/toolkit';
import menuReducer from '@/redux/slices/menuSlice';
import modalReducer from '@/redux/slices/modalSlice';
import actionReducer from '@/redux/slices/actionSlice';
import imageModalReducer from '@/redux/slices/imageModalSlice';
import dataReducer from '@/redux/slices/dataSlice';
import userReducer from '@/redux/slices/userSlice';
const store = configureStore({
    reducer: {
        menu: menuReducer,
        action: actionReducer,
        modal: modalReducer,
        imageModal: imageModalReducer,
        data: dataReducer,
        user: userReducer,
    },
});

store.subscribe(() => {
   console.log("Store Change : ", store.getState());
});
export default store;