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
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    getAllCustomer: builder.query({
      query: (body) => ({
        url: `/admin/get-all-customers?page=${body.page}&limit=${body.limit}&search=${body.search}&status=${body.status}&dateFrom=${body.dateFrom}&dateTo=${body.dateTo}`,
        method: "GET",
      }),
      invalidatesTags: ["Customer"],
    }),
    getCustomerById: builder.query({
      query: (id) => ({
        url: `/admin/get-customer/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Customer"],
    }),

    createCustomer: builder.mutation({
      query: (body) => ({
        url: `/admin/create-customer`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customer"],
    }),
    updateCustomer: builder.mutation({
      query: (body) => ({
        url: `/admin/update-customer/${body.id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Customer"],
    }),
  }),
});

export const {
  useGetAllCustomerQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} = customerApi;
