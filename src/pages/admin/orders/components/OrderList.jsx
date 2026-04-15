// components/orders/OrderList.jsx
import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import OrderTable from "./OrderTable";
import Pagination from "../../../../components/common/Pagination";

const OrderList = ({
  orders,
  isLoading,
  onBulkStatusUpdate,
  pagination,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const handleSelectAll = useCallback(
    (e) => {
      if (e.target.checked) {
        setSelectedOrders(orders.map((order) => order.id));
      } else {
        setSelectedOrders([]);
      }
    },
    [orders],
  );

  const handleSelectOrder = useCallback((orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  }, []);

  const handleBulkUpdate = useCallback(async () => {
    if (!bulkStatus || selectedOrders.length === 0) return;

    setUpdateLoading(true);
    try {
      await onBulkStatusUpdate(selectedOrders, bulkStatus);
      setSelectedOrders([]);
      setShowBulkUpdate(false);
      setBulkStatus("");
      // Show success toast/notification here
    } catch (error) {
      console.error("Bulk update failed:", error);
      // Show error toast/notification here
    } finally {
      setUpdateLoading(false);
    }
  }, [bulkStatus, selectedOrders, onBulkStatusUpdate]);

  const statusOptions = useMemo(
    () => [
      { value: "pending", label: "Pending", color: "yellow" },
      { value: "processing", label: "Processing", color: "blue" },
      { value: "shipped", label: "Shipped", color: "purple" },
      { value: "delivered", label: "Delivered", color: "green" },
      { value: "cancelled", label: "Cancelled", color: "red" },
    ],
    [],
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-primary)"></div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col justify-center items-center h-64">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-gray-500 text-lg">No orders found</p>
          <p className="text-gray-400 text-sm mt-1">
            Try adjusting your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Bulk Action Bar */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 p-4 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-(--color-primary) font-medium">
              {selectedOrders.length} order(s) selected
            </span>
            <button
              onClick={() => setSelectedOrders([])}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
          <button
            onClick={() => setShowBulkUpdate(true)}
            className="px-4 py-2 text-sm bg-(--color-primary) text-white rounded-md hover:bg-(--color-primary-hover) transition-colors"
            disabled={updateLoading}
          >
            Bulk Update Status
          </button>
        </div>
      )}

      {/* Order Table */}
      <OrderTable
        orders={orders}
        selectedOrders={selectedOrders}
        onSelectAll={handleSelectAll}
        onSelectOrder={handleSelectOrder}
        statusOptions={statusOptions}
      />

      {/* Pagination */}
      {pagination.totalItems > 0 && (
        <div className="border-t border-gray-200 px-6 py-4">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            itemsPerPage={pagination.itemsPerPage}
            totalItems={pagination.totalItems}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            onPageChange={onPageChange}
            onItemsPerPageChange={onItemsPerPageChange}
          />
        </div>
      )}

      {/* Bulk Update Modal */}
      {showBulkUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Bulk Update Status</h3>
            <p className="text-sm text-gray-600 mb-4">
              Update status for {selectedOrders.length} selected order(s)
            </p>

            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-(--color-primary) focus:border-(--color-primary) mb-4"
              disabled={updateLoading}
            >
              <option value="">Select Status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowBulkUpdate(false);
                  setBulkStatus("");
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={updateLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpdate}
                disabled={!bulkStatus || updateLoading}
                className="px-4 py-2 text-white bg-(--color-primary) rounded-md hover:bg-(--color-primary-hover) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
