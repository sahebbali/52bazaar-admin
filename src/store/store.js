import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import { categoryApi } from "../services/categoryApi";
import { productApi } from "../services/productApi";
import { orderApi } from "../services/orderApi";
import { inventoryApi } from "../services/inventoryApi";
import { paymentApi } from "../services/paymentApi";

import { customerApi } from "./../services/customerApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [inventoryApi.reducerPath]: inventoryApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      categoryApi.middleware,
      productApi.middleware,
      orderApi.middleware,
      inventoryApi.middleware,
      paymentApi.middleware,
      customerApi.middleware,
    ),
});
