import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../env";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("52bazaarToken");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (body) => ({
        url: `/admin/get-all-orders?page=${body.page}&limit=${body.limit}&search=${body.search}&status=${body.status}&paymentStatus=${body.paymentStatus}&startDate=${body.startDate}&endDate=${body.endDate}`,
        method: "GET",
      }),
      invalidatesTags: ["Order"],
    }),
    getOrdersById: builder.query({
      query: (id) => ({
        url: `/admin/get-order-by-id/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const { useGetAllOrdersQuery, useGetOrdersByIdQuery } = orderApi;
