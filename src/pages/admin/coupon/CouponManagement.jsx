// components/admin/CouponManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Check,
  Search,
  Filter,
  X,
} from "lucide-react";
import CouponForm from "./components/CouponForm";
import {
  useAddCouponMutation,
  useDeleteCouponMutation,
  useGetAllCouponsQuery,
  useUpdateCouponMutation,
} from "../../../services/couponApi";
import { Notification } from "../../../components/ToastNotification";

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // Pagination and filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const {
    data: CouponData,
    isLoading: couponLoading,
    refetch,
  } = useGetAllCouponsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    status: statusFilter,
    endDate: dateFilter,
  });

  const [
    addCoupon,
    {
      data: addCouponData,
      isLoading: addCouponLoading,
      isError: addCouponError,
      error: addCouponErrorData,
    },
  ] = useAddCouponMutation();

  useEffect(() => {
    if (addCouponData) {
      Notification(
        addCouponData?.message || "Coupon addd successfully",
        "success",
      );
      onCloseForm();
      refetch(); // Refresh the list after adding
    }

    if (addCouponErrorData) {
      Notification(
        addCouponErrorData?.data?.message || "Error adding coupon",
        "error",
      );
      console.error("Error adding coupon:", addCouponErrorData);
    }
  }, [addCouponData, addCouponErrorData, refetch]);
  // update coupon mutation
  const [
    updateCoupon,
    {
      data: updateCouponData,
      isLoading: updateCouponLoading,
      isError: updateCouponError,
      error: updateCouponErrorData,
    },
  ] = useUpdateCouponMutation();
  useEffect(() => {
    if (CouponData) {
      setCoupons(CouponData.data || []);
    }
  }, [CouponData]);

  // delete coupon
  const [
    deleteCoupon,
    {
      data: deleteCouponData,
      isLoading: deleteCouponLoading,
      isError: deleteCouponError,
      error: deleteCouponErrorData,
    },
  ] = useDeleteCouponMutation();

  useEffect(() => {
    if (deleteCouponData) {
      Notification(
        deleteCouponData?.message || "Coupon Deleted successfully",
        "success",
      );
      onCloseForm();
      refetch(); // Refresh the list after adding
    }

    if (deleteCouponErrorData) {
      Notification(
        deleteCouponErrorData?.data?.message || "Error adding coupon",
        "error",
      );
      console.error("Error adding coupon:", deleteCouponErrorData);
    }
  }, [deleteCouponData, deleteCouponErrorData, refetch]);

  useEffect(() => {
    if (updateCouponData) {
      Notification(
        updateCouponData?.message || "Coupon Updated successfully",
        "success",
      );
      onCloseForm();
      refetch(); // Refresh the list after adding
    }

    if (updateCouponErrorData) {
      Notification(
        updateCouponErrorData?.data?.message || "Error adding coupon",
        "error",
      );
      console.error("Error adding coupon:", updateCouponErrorData);
    }
  }, [updateCouponData, updateCouponErrorData, refetch]);
  const onCloseForm = () => {
    setShowForm(false);
    setEditingCoupon(null);
  };

  const handleCreateCoupon = async (couponData) => {
    await addCoupon(couponData);
  };

  const handleUpdateCoupon = async (updatedData) => {
    // Add your update mutation here
    console.log("Update coupon:", updatedData);
    await updateCoupon(updatedData);
  };

  const handleDeleteCoupon = async (id) => {
    await deleteCoupon(id);
  };

  const handleToggleStatus = async (id) => {
    // Add your toggle status mutation here
    console.log("Toggle status:", id);
    refetch();
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  // Reset pagination when filters change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleDateFilter = (date) => {
    setDateFilter(date);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("");
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages =
    CouponData?.totalPages ||
    Math.ceil((CouponData?.total || coupons.length) / itemsPerPage);
  const totalItems = CouponData?.total || coupons.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const Pagination = () => {
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 rounded-lg border transition-colors ${
              currentPage === page
                ? "bg-(--color-primary) text-white border-(--color-primary)"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Coupon Management
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage discount coupons
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCoupon(null);
            setShowForm(true);
          }}
          className="bg-(--color-primary) cursor-pointer hover:bg-(--color-primary-hover) text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Create Coupon
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search coupons by code or description..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border cursor-pointer text-black border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Filter size={20} />
            Filters
            {(statusFilter !== "all" || dateFilter) && (
              <span className="ml-1 w-2 h-2 bg-(--color-primary) rounded-full"></span>
            )}
          </button>

          {/* Clear Filters Button */}
          {(searchTerm || statusFilter !== "all" || dateFilter) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-red-600 border cursor-pointer border-red-300 rounded-lg flex items-center gap-2 hover:bg-red-50 transition-colors"
            >
              <X size={20} />
              Clear Filters
            </button>
          )}
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border cursor-pointer text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <select
                value={dateFilter}
                onChange={(e) => handleDateFilter(e.target.value)}
                className="w-full px-3 py-2 cursor-pointer text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
              >
                <option value="">All Dates</option>
                <option value="upcoming">Upcoming (Not Expired)</option>
                <option value="expired">Expired Only</option>
                <option value="this-week">Expiring This Week</option>
                <option value="this-month">Expiring This Month</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <CouponForm
          onSubmit={editingCoupon ? handleUpdateCoupon : handleCreateCoupon}
          onClose={onCloseForm}
          initialData={editingCoupon}
        />
      )}

      {/* Loading State */}
      {couponLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-primary)"></div>
        </div>
      ) : (
        <>
          {/* Results Info */}
          <div className="mb-4 flex justify-between items-center text-sm text-gray-600">
            <div>
              Showing {coupons.length} of {totalItems} coupons
            </div>
            <div className="flex items-center gap-2">
              <span>Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
              >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </div>
          </div>

          {/* Coupons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className={`bg-white rounded-lg shadow-md border-l-4 overflow-hidden transition-all hover:shadow-lg ${
                  coupon.isActive && !isExpired(coupon.endDate)
                    ? "border-l-green-500"
                    : "border-l-gray-400 opacity-75"
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-800">
                          {coupon.code}
                        </h3>
                        <button
                          onClick={() => copyToClipboard(coupon.code)}
                          className="text-gray-400 cursor-pointer hover:text-gray-600"
                          title="Copy coupon code"
                        >
                          {copiedCode === coupon.code ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {coupon.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCoupon(coupon);
                          setShowForm(true);
                        }}
                        className="text-(--color-primary) cursor-pointer hover:text-(--color-primary-hover)"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon._id)}
                        className="text-red-600 cursor-pointer hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-semibold text-gray-800">
                        {coupon.discountType === "percentage"
                          ? `৳{coupon.discountValue}% OFF`
                          : `৳${coupon.discountValue} OFF`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Minimum Purchase:</span>
                      <span className="font-semibold text-gray-800">
                        ৳{coupon.minPurchase}
                      </span>
                    </div>
                    {coupon.maxDiscount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Max Discount:</span>
                        <span className="font-semibold text-gray-800">
                          ৳{coupon.maxDiscount}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Valid Until:</span>
                      <span className="font-semibold text-gray-800">
                        {new Date(coupon.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Usage:</span>
                      <span className="font-semibold text-gray-800">
                        {coupon.usedCount} / {coupon.usageLimit}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <button
                      onClick={() => handleToggleStatus(coupon.id)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        coupon.isActive && !isExpired(coupon.endDate)
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {coupon.isActive && !isExpired(coupon.endDate)
                        ? "Active"
                        : "Inactive"}
                    </button>
                    <div className="text-xs text-gray-500">
                      {isExpired(coupon.endDate) && "Expired"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {coupons.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No coupons found</p>
              <p className="text-gray-400 mt-2">
                Try adjusting your filters or create a new coupon
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && coupons.length > 0 && <Pagination />}
        </>
      )}
    </div>
  );
};

export default CouponManagement;
