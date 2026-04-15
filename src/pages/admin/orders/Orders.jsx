// pages/Orders.jsx
import React, { useState, useCallback } from "react";
import OrderList from "./components/OrderList";
import OrderFilters from "./components/OrderFilters";

import { useGetAllOrdersQuery } from "../../../services/orderApi";

const Orders = () => {
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    dateRange: { start: "", end: "" },
    search: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page on filter change
  }, []);

  const handlePageChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleItemsPerPageChange = useCallback((itemsPerPage) => {
    setPagination({ currentPage: 1, itemsPerPage });
  }, []);

  const {
    data: response,
    isLoading,
    error,
    isFetching,
  } = useGetAllOrdersQuery({
    page: pagination.currentPage,
    limit: pagination.itemsPerPage,
    search: filters.search,
    status: filters.status,
    paymentStatus: filters.paymentStatus,
    startDate: filters.dateRange.start,
    endDate: filters.dateRange.end,
  });

  // Extract data from response with proper structure
  const orders = response?.data?.orders || response?.orders || [];
  const totalItems = response?.data?.total || response?.total || 0;
  const totalPages =
    response?.data?.totalPages ||
    response?.totalPages ||
    Math.ceil(totalItems / pagination.itemsPerPage);

  // Calculate displayed range
  const startIndex =
    orders.length > 0
      ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1
      : 0;
  const endIndex = Math.min(startIndex + orders.length - 1, totalItems);

  const handleBulkStatusUpdate = async (orderIds, newStatus) => {
    try {
      // API call to update bulk status
      console.log("Updating orders:", orderIds, "to status:", newStatus);
      // Refetch orders after update
      // You might want to invalidate cache or refetch here
    } catch (error) {
      console.error("Bulk update failed:", error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-2">Error loading orders</div>
          <button
            onClick={() => window.location.reload()}
            className="text-(--color-primary) hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage and track all customer orders
          </p>
        </div>

        <OrderFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          isLoading={isLoading}
        />

        <OrderList
          orders={orders}
          isLoading={isLoading || isFetching}
          onBulkStatusUpdate={handleBulkStatusUpdate}
          pagination={{
            currentPage: pagination.currentPage,
            totalPages,
            itemsPerPage: pagination.itemsPerPage,
            totalItems,
            startIndex,
            endIndex,
          }}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
};

export default Orders;
