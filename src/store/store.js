import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import { categoryApi } from "../services/categoryApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, categoryApi.middleware),
});
