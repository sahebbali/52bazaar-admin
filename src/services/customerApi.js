import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../env";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("52bazaarToken");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    getAllCustomer: builder.query({
      query: (body) => ({
        url: `/admin/get-all-customers?page=${body.page}&limit=${body.limit}&search=${body.search}&status=${body.status}&dateFrom=${body.dateFrom}&dateTo=${body.dateTo}`,
        method: "GET",
      }),
      invalidatesTags: ["Payment"],
    }),
    getPaymentsById: builder.query({
      query: (id) => ({
        url: `/admin/get-payment/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Payment"],
    }),

    createCustomer: builder.mutation({
      query: (body) => ({
        url: `/admin/create-customer`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useGetAllCustomerQuery,
  useGetPaymentsByIdQuery,
  useCreateCustomerMutation,
} = customerApi;
