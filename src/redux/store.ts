import { configureStore } from '@reduxjs/toolkit';
import menuReducer from '@/redux/slices/menuSlice';
import actionReducer from '@/redux/slices/actionSlice';
const store = configureStore({
    reducer: {
        menu: menuReducer,
        action: actionReducer,
    },
});

store.subscribe(() => {
   console.log("Store Change : ", store.getState());
});
export default store;