import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../authSlice';
import chatReducer from "../chatSlice"; // import new slice


export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer
    }
})