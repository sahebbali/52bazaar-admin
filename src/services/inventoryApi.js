import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../env";

export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("52bazaarToken");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Inventory"],
  endpoints: (builder) => ({
    getAllInventory: builder.query({
      query: (body) => ({
        url: `/admin/get-all-inventory?page=${body.page}&limit=${body.limit}&search=${body.search}&status=${body.status}`,
        method: "GET",
      }),
      invalidatesTags: ["Inventory"],
    }),
    // getOrdersById: builder.query({
    //   query: (id) => ({
    //     url: `/admin/get-order-by-id/${id}`,
    //     method: "GET",
    //   }),
    //   invalidatesTags: ["Order"],
    // }),
    updateStock: builder.mutation({
      query: (body) => ({
        url: `/admin/update-stock`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Inventory"],
    }),
  }),
});

export const {
  useGetAllInventoryQuery,
  // useGetOrdersByIdQuery,
  // useUpdateOrderStatusMutation,
  useUpdateStockMutation,
} = inventoryApi;
