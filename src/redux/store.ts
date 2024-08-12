import { configureStore } from '@reduxjs/toolkit';
import menuReducer from '@/redux/slices/menuSlice';
import modalReducer from '@/redux/slices/modalSlice';
import actionReducer from '@/redux/slices/actionSlice';
const store = configureStore({
    reducer: {
        menu: menuReducer,
        action: actionReducer,
        modal: modalReducer,
    },
});

store.subscribe(() => {
   console.log("Store Change : ", store.getState());
});
export default store;