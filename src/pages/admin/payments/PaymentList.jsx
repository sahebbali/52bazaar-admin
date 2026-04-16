// pages/admin/payments/PaymentList.jsx
import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useGetAllPaymentsQuery } from "../../../services/paymentApi"; // Adjust import path as needed
import { exportToCSV } from "../../../utils/exportUtils";
import { Loading } from "../../../common/Loading";
import Pagination from "./../products/components/Pagination";
import { PanelRightDashedIcon } from "lucide-react";

// Constants
export const STATUS_CONFIG = {
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800",
    icon: "✓",
  },
  paid: {
    label: "Paid",
    color: "bg-green-100 text-green-800",
    icon: "✓",
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: "⏳",
  },
  failed: {
    label: "Failed",
    color: "bg-red-100 text-red-800",
    icon: "✕",
  },
  refunded: {
    label: "Refunded",
    color: "bg-gray-100 text-gray-800",
    icon: "↺",
  },
};

export const METHOD_CONFIG = {
  bkash: { label: "bKash", icon: "💚", color: "bg-pink-50 text-pink-700" },
  nagad: { label: "Nagad", icon: "🧡", color: "bg-orange-50 text-orange-700" },
  credit_card: {
    label: "Credit Card",
    icon: "💳",
    color: "bg-blue-50 text-blue-700",
  },
  cash_on_delivery: {
    label: "Cash on Delivery",
    icon: "💰",
    color: "bg-gray-50 text-gray-700",
  },
};

// Custom hook for responsive design
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
};

export default function PaymentList() {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    method: "",
    startDate: "",
    endDate: "",
  });

  // Selection state
  const [selectedPayments, setSelectedPayments] = useState([]);

  // Responsive design
  const isMobile = useMediaQuery("(max-width: 768px)");

  // API call with pagination and filters
  const {
    data: paymentData,
    isLoading,
    isError,
    error,
  } = useGetAllPaymentsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    status: filters.status,
    paymentMethod: filters.method,
    dateFrom: filters.startDate,
    dateTo: filters.endDate,
  });

  // Extract data from API response
  const payments = paymentData?.data || [];
  const totalItems = paymentData?.pagination?.totalCount || 0;
  const totalPages = paymentData?.pagination?.totalPages || 0;

  // Calculate pagination indices
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    setSelectedPayments([]); // Clear selection when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
    setSelectedPayments([]);
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedPayments([]);
  }, [searchTerm, filters]);

  // Debounced search to avoid too many API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle export
  const handleExport = useCallback(() => {
    if (!payments.length) return;

    const exportData = payments.map((payment) => ({
      "Transaction ID": payment.transactionId,
      "Order ID": payment.orderId,
      Customer: payment.customer,
      Amount: `$${payment.amount}`,
      Method: METHOD_CONFIG[payment.method]?.label || payment.method,
      Status: STATUS_CONFIG[payment.status]?.label || payment.status,
      Date: new Date(payment.date).toLocaleString(),
      "Gateway Response": payment.gatewayResponse || "",
    }));

    exportToCSV(exportData, `payments_export_${new Date().toISOString()}.csv`);
  }, [payments]);

  // Handle select all on current page
  const handleSelectAll = useCallback(() => {
    if (selectedPayments.length === payments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(payments.map((p) => p.id));
    }
  }, [selectedPayments.length, payments]);

  // Handle single payment selection
  const handleSelectPayment = useCallback((id) => {
    setSelectedPayments((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({
      status: "",
      method: "",
      startDate: "",
      endDate: "",
    });
    setSearchTerm("");
  }, []);

  // Format helpers
  const formatAmount = useCallback((amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "৳",
    }).format(amount);
  }, []);

  const formatDate = useCallback((date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Loading state
  if (isLoading) {
    return <Loading type="spinner" size="lg" text="Loading payments..." />;
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error loading payments
          </h3>
          <p className="text-gray-500">
            {error?.message || "Please try again later"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Payment Records
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all transactions
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search by transaction ID, order ID or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border text-gray-900 cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="px-4 py-2 border text-gray-900 cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Status</option>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>

            {/* Method Filter */}
            <select
              value={filters.method}
              onChange={(e) =>
                setFilters({ ...filters, method: e.target.value })
              }
              className="px-4 py-2 border text-gray-900 cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Methods</option>
              {Object.entries(METHOD_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>

            {/* Date Range */}
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="px-4 py-2 border text-gray-900 cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="px-4 py-2 border text-gray-900 cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="End Date"
            />

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={!payments.length}
              className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📥 Export
            </button>
          </div>

          {/* Active Filters Display */}
          {(filters.status ||
            filters.method ||
            filters.startDate ||
            filters.endDate ||
            searchTerm) && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs flex items-center gap-1">
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="hover:text-red-500"
                  >
                    ✕
                  </button>
                </span>
              )}
              {filters.status && (
                <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs flex items-center gap-1">
                  Status: {STATUS_CONFIG[filters.status]?.label}
                  <button
                    onClick={() => setFilters({ ...filters, status: "" })}
                    className="hover:text-red-500"
                  >
                    ✕
                  </button>
                </span>
              )}
              {filters.method && (
                <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs flex items-center gap-1">
                  Method: {METHOD_CONFIG[filters.method]?.label}
                  <button
                    onClick={() => setFilters({ ...filters, method: "" })}
                    className="hover:text-red-500"
                  >
                    ✕
                  </button>
                </span>
              )}
              {(filters.startDate || filters.endDate) && (
                <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs">
                  Date: {filters.startDate || "any"} to{" "}
                  {filters.endDate || "any"}
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedPayments.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-sm text-green-700">
              {selectedPayments.length} payment(s) selected on current page
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const selectedData = payments.filter((p) =>
                    selectedPayments.includes(p.id),
                  );
                  exportToCSV(
                    selectedData,
                    `selected_payments_${new Date().toISOString()}.csv`,
                  );
                }}
                className="px-3 py-1 text-sm text-gray-700 cursor-pointer bg-white border border-green-300 rounded-lg hover:bg-green-100"
              >
                Export Selected
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `Process ${selectedPayments.length} selected payments?`,
                    )
                  ) {
                    // Handle bulk action
                    console.log("Bulk action for:", selectedPayments);
                  }
                }}
                className="px-3 py-1 text-sm cursor-pointer bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
              >
                Bulk Action
              </button>
            </div>
          </div>
        )}

        {/* Desktop Table View */}
        {!isMobile && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={
                          payments.length > 0 &&
                          selectedPayments.length === payments.length
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Transaction ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Method
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedPayments.includes(payment.id)}
                          onChange={() => handleSelectPayment(payment.id)}
                          className="rounded border-gray-300 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/payments/${payment.id}`}
                          className="font-mono text-sm text-green-600 hover:underline"
                        >
                          {payment.transactionId}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/orders/${payment.orderId}`}
                          className="text-sm text-gray-700 hover:text-green-600"
                        >
                          {payment.orderId}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {payment.customer}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        {"৳ " + payment.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${METHOD_CONFIG[payment.method]?.color}`}
                        >
                          {METHOD_CONFIG[payment.method]?.icon}{" "}
                          {METHOD_CONFIG[payment.method]?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[payment.status]?.color}`}
                        >
                          {STATUS_CONFIG[payment.status]?.icon}{" "}
                          {STATUS_CONFIG[payment.status]?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(payment.date)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          to={`/admin/payments/${payment.id}`}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Component */}
            {totalItems > 0 && (
              <div className="border-t border-gray-200">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            )}
          </div>
        )}

        {/* Mobile Card View */}
        {isMobile && (
          <>
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedPayments.includes(payment.id)}
                        onChange={() => handleSelectPayment(payment.id)}
                        className="rounded border-gray-300 cursor-pointer"
                      />
                      <div>
                        <Link
                          to={`/admin/payments/${payment.id}`}
                          className="font-mono text-sm font-semibold text-green-600"
                        >
                          {payment.transactionId}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDate(payment.date)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[payment.status]?.color}`}
                    >
                      {STATUS_CONFIG[payment.status]?.label}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Order ID:</span>
                      <Link
                        to={`/admin/orders/${payment.orderId}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        {payment.orderId}
                      </Link>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Customer:</span>
                      <span className="text-sm font-medium text-gray-700">
                        {payment.customer}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Amount:</span>
                      <span className="text-lg font-bold text-green-600">
                        {"৳ " + payment.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Method:</span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${METHOD_CONFIG[payment.method]?.color}`}
                      >
                        {METHOD_CONFIG[payment.method]?.icon}{" "}
                        {METHOD_CONFIG[payment.method]?.label}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                    <Link
                      to={`/admin/payments/${payment.id}`}
                      className="flex-1 text-center px-3 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100"
                    >
                      View Details
                    </Link>
                    {payment.refundable && payment.status === "completed" && (
                      <Link
                        to={`/admin/payments/${payment.id}/refund`}
                        className="px-3 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-100"
                      >
                        Refund
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Component for Mobile */}
            {totalItems > 0 && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && payments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No payments found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
