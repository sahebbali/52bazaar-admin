import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../env";

export const categoryApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("52bazaarToken");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: (body) => ({
        url: "/admin/add-category",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const { useAddCategoryMutation } = categoryApi;
