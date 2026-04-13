import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Grid3x3, Table2 } from "lucide-react";
import ProductTable from "./components/ProductTable";
import ProductGrid from "./components/ProductGrid";
import DeleteConfirmation from "./components/DeleteConfirmation";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "../../../services/productApi";
import Pagination from "./components/Pagination";
import { Notification } from "../../../components/ToastNotification";

const ProductList = () => {
  const [viewMode, setViewMode] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    stockStatus: "",
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [
    deleteProduct,
    { data: deleteData, isLoading: isDeleting, error: deleteError },
  ] = useDeleteProductMutation();

  useEffect(() => {
    if (deleteData) {
      console.log("Delete successful:", deleteData);
      Notification(
        deleteData?.message || "Product deleted successfully",
        "success",
      );
      setShowDeleteModal(false);
      setProductToDelete(null);
      // Optionally show a success notification here
    }
    if (deleteError) {
      console.error("Delete failed:", deleteError);
      Notification(
        deleteError?.data?.message || "Failed to delete product",
        "error",
      );
      // Optionally show an error notification here
    }
  }, [deleteData, deleteError]);
  // API call with all parameters
  const { data, isLoading, refetch } = useGetAllProductsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    category: filters.category,
    status: filters.status,
    stockStatus: filters.stockStatus,
  });

  // Extract data from API response
  const products = data?.data || [];
  const totalItems = data?.total || 0;
  const categories = data?.categories || []; // Assuming API returns categories list

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  // Refetch data when dependencies change
  useEffect(() => {
    refetch();
  }, [currentPage, itemsPerPage, searchTerm, filters, refetch]);

  // Stock status helper function
  const getStockStatus = (stock, threshold) => {
    if (stock <= 0)
      return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (stock <= threshold)
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    return { label: "In Stock", color: "bg-green-100 text-green-800" };
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      console.log("Delete product:", id);
      // API call to delete
      // await deleteProductMutation(id).unwrap();

      // Refetch products after deletion

      await deleteProduct({ id }).unwrap();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (action === "delete") {
      try {
        // API call to bulk delete
        // await bulkDeleteProducts(selectedProducts).unwrap();

        refetch();
        setSelectedProducts([]);
      } catch (error) {
        console.error("Bulk delete failed:", error);
      }
    }
  };

  // Calculate pagination values
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex =
    totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <Link
          to="/admin/products/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={20} />
          Add Product
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={filters.stockStatus}
            onChange={(e) =>
              setFilters({ ...filters, stockStatus: e.target.value })
            }
            className="px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Stock</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>

          <button
            onClick={() =>
              setFilters({ category: "", status: "", stockStatus: "" })
            }
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Clear Filters
          </button>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded ${viewMode === "table" ? "bg-blue-100 text-blue-600" : "text-gray-400"}`}
            >
              <Table2 size={20} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-400"}`}
            >
              <Grid3x3 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-3 mb-4 flex items-center justify-between">
          <span className="text-sm text-blue-700">
            {selectedProducts.length} products selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction("delete")}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedProducts([])}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products View */}
      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : viewMode === "table" ? (
        <>
          <ProductTable
            products={products}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            onDelete={(product) => {
              setProductToDelete(product);
              setShowDeleteModal(true);
            }}
            getStockStatus={getStockStatus}
          />

          {totalItems > 0 && (
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
          )}
        </>
      ) : (
        <>
          <ProductGrid
            products={products}
            onDelete={(product) => {
              setProductToDelete(product);
              setShowDeleteModal(true);
            }}
            getStockStatus={getStockStatus}
          />

          {totalItems > 0 && (
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
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <DeleteConfirmation
          product={productToDelete}
          onConfirm={() => handleDelete(productToDelete._id)}
          onCancel={() => {
            setShowDeleteModal(false);
            setProductToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductList;
