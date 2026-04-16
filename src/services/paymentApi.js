import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../env";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
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
    getAllPayments: builder.query({
      query: (body) => ({
        url: `/admin/get-all-payments?page=${body.page}&limit=${body.limit}&search=${body.search}&status=${body.status}&paymentMethod=${body.paymentMethod}&dateFrom=${body.dateFrom}&dateTo=${body.dateTo}`,
        method: "GET",
      }),
      invalidatesTags: ["Payment"],
    }),

    updatePaymentStatus: builder.mutation({
      query: (body) => ({
        url: `/admin/update-payment-status`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const { useGetAllPaymentsQuery, useUpdatePaymentStatusMutation } =
  paymentApi;
