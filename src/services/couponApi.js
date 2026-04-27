import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../env";
import { use } from "react";

export const couponApi = createApi({
  reducerPath: "couponApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("52bazaarToken");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Coupon"],
  endpoints: (builder) => ({
    addCoupon: builder.mutation({
      query: (body) => ({
        url: "/admin/create-coupon",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Coupon"],
    }),
    getAllCoupons: builder.query({
      query: (body) => ({
        url: `/admin/get-all-coupons?page=${body.page}&limit=${body.limit}&search=${body.search}&status=${body.status}&endDate=${body.endDate}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (id) => ({
        url: `/admin/get-product-by-id/${id}`, // RESTful approach (preferred)
      }),
      providesTags: ["Coupon"],
    }),
    updateProduct: builder.mutation({
      query: (body) => ({
        url: `/admin/update-product`, // RESTful approach (preferred)
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Coupon"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/delete-product/${id}`, // RESTful approach (preferred)
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon"],
    }),
  }),
});

export const {
  useAddCouponMutation,
  useGetAllCouponsQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = couponApi;
