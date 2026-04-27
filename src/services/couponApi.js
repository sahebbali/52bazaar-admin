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
    getAllProducts: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        category = "",
        status = "",
        stockStatus = "",
      }) => ({
        url: "/admin/get-all-products",
        params: {
          page,
          limit,
          search,
          category,
          status,
          stockStatus,
        },
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
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = couponApi;
