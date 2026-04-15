// pages/Inventory.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import InventoryTable from "./components/InventoryTable";
import ExportButton from "./components/ExportButton";

import StockAdjustmentModal from "./components/StockAdjustmentModal";
import { Loading } from "../../../common/Loading";
import {
  useGetAllInventoryQuery,
  useUpdateStockMutation,
} from "../../../services/inventoryApi";
import { Notification } from "../../../components/ToastNotification";
import Pagination from "../../../components/common/Pagination";

const Inventory = () => {
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // API hooks
  const {
    data: inventoryData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetAllInventoryQuery({
    page: pagination.currentPage,
    limit: pagination.itemsPerPage,
    search: debouncedSearchTerm,
    status: filterStatus,
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [
    updateStock,
    {
      data: updateStockData,
      isLoading: updateStockLoading,
      isError: updateStockError,
    },
  ] = useUpdateStockMutation();

  useEffect(() => {
    if (updateStockData) {
      Notification("Stock updated successfully", "success");
      refetch();
    }
    if (updateStockError) {
      Notification("Failed to update stock", "error");
    }
  }, [updateStockData, updateStockError, refetch]);
  // Reset to first page when filter changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [filterStatus]);

  // Extract data from response
  const products = inventoryData?.data || inventoryData?.products || [];
  const totalItems = inventoryData?.pagination
    ? inventoryData?.pagination?.total
    : 0;
  const totalPages =
    inventoryData?.data?.totalPages ||
    inventoryData?.totalPages ||
    Math.ceil(totalItems / pagination.itemsPerPage);

  // Calculate displayed range
  const startIndex =
    products.length > 0
      ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1
      : 0;
  const endIndex = Math.min(startIndex + products.length - 1, totalItems);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((itemsPerPage) => {
    setPagination({ currentPage: 1, itemsPerPage });
  }, []);

  // Handle stock update
  const handleStockUpdate = useCallback(
    async (productId, newStock) => {
      try {
        // Call your update stock mutation here
        // await updateStock(productId, newStock);
        Notification("Stock updated successfully", "success");
        refetch(); // Refresh the data
      } catch (error) {
        Notification("Failed to update stock", "error");
      }
    },
    [refetch],
  );

  // Handle stock adjustment
  const handleAdjustStock = useCallback((product) => {
    setSelectedProduct(product);
    setShowModal(true);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setSelectedProduct(null);
  }, []);

  // Handle stock adjustment submission
  const handleStockAdjustment = useCallback(
    async (productId, quantity, reason) => {
      try {
        console.log(
          "Adjusting stock for product",
          productId,
          "by quantity",
          quantity,
          "reason:",
          reason,
        );
        const obj = {
          productId,
          quantity,
          reason,
        };
        await updateStock(obj).unwrap();
        // Notification("Stock adjusted successfully", "success");
        handleModalClose();
        refetch(); // Refresh the data
      } catch (error) {
        console.error("Failed to adjust stock:", error);
        Notification("Failed to adjust stock", "error");
      }
    },
    [handleModalClose, refetch],
  );

  // Handle export
  const handleExport = useCallback(() => {
    // Export current filtered data
    const exportData = products.map((product) => ({
      "Product Name": product.name,
      SKU: product.sku,
      "Current Stock": product.currentStock,
      "Low Stock Threshold": product.lowStockThreshold,
      Status: getStockStatus(product.currentStock, product.lowStockThreshold),
      Price: product.price,
      Category: product.category?.name || "N/A",
    }));

    // Convert to CSV and download
    const csv = convertToCSV(exportData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory_export_${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [products]);

  // Helper function to get stock status
  const getStockStatus = (currentStock, threshold) => {
    if (currentStock === 0) return "Out of Stock";
    if (currentStock <= threshold) return "Low Stock";
    return "In Stock";
  };

  // Helper function to convert to CSV
  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => JSON.stringify(row[header] || "")).join(","),
      ),
    ];
    return csvRows.join("\n");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loading />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 mb-2">Failed to load inventory data</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Inventory Management
        </h1>
        <p className="text-gray-600 mt-1">Manage your product stock levels</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-2xl text-black font-bold">{totalItems}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Low Stock</p>
          <p className="text-2xl text-black font-bold">
            {
              products.filter(
                (p) =>
                  p.currentStock <= p.lowStockThreshold && p.currentStock > 0,
              ).length
            }
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Out of Stock</p>
          <p className="text-2xl text-black font-bold">
            {products.filter((p) => p.currentStock === 0).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Total Value</p>
          <p className="text-2xl text-black font-bold">
            $
            {products
              .reduce((sum, p) => sum + p.currentStock * (p.price || 0), 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-wrap">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 pl-10 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-primary) w-64"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
          >
            <option value="">All Products</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
            <option value="in">In Stock</option>
          </select>

          {isFetching && (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-(--color-primary)"></div>
              <span className="ml-2 text-sm text-gray-500">Updating...</span>
            </div>
          )}
        </div>

        <ExportButton
          products={products}
          onExport={handleExport}
          disabled={products.length === 0}
        />
      </div>

      {/* Inventory Table */}
      <InventoryTable
        products={products}
        onStockUpdate={handleStockUpdate}
        onAdjustStock={handleAdjustStock}
        isLoading={isFetching}
      />

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={totalPages}
            itemsPerPage={pagination.itemsPerPage}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showModal && selectedProduct && (
        <StockAdjustmentModal
          product={selectedProduct}
          onClose={handleModalClose}
          onAdjust={handleStockAdjustment}
        />
      )}
    </div>
  );
};

export default Inventory;
