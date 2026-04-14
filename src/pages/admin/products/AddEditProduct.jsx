import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Save,
  X,
  Upload,
  Star,
  StarOff,
  Trash2,
  ImagePlus,
} from "lucide-react";
import {
  useAddProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../../services/productApi";
import { Notification } from "../../../components/ToastNotification";
import { getStatusColor } from "./../../../utils/orderUtils";
import { useGetCategoryTreeQuery } from "../../../services/categoryApi";

const AddEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    description: "",
    regularPrice: "",
    salePrice: "",
    cost: "",
    stockQuantity: "",
    lowStockThreshold: "",
    images: [], // Array of { url, file, preview, isFeatured }
    slug: "",
    metaTitle: "",
    metaDescription: "",
    weight: "",
    dimensions: "",
    tags: [],
  });

  const [addProduct, { data, isLoading: isAdding, isError }] =
    useAddProductMutation();
  useEffect(() => {
    if (data) {
      Notification(data.message, "success");
      navigate("/admin/products");
    }
    if (isError) {
      console.log("Error:", isError);
      Notification(isError?.data?.message || "Something went wrong", "error");
    }
  }, [data, isError]);
  // update product
  const [
    updateProduct,
    { data: updateData, isLoading: isUpdating, isError: isUpdateError },
  ] = useUpdateProductMutation();
  console.log("updateData", updateData);
  console.log("isUpdateError", isUpdateError);
  useEffect(() => {
    if (updateData) {
      Notification(updateData.message, "success");
      navigate("/admin/products");
    }
    if (isUpdateError) {
      console.log("Error:", isUpdateError);
      Notification(isUpdateError?.data?.message, "error");
    }
  }, [updateData, isUpdateError]);

  // console.log("my id", id);
  const { data: categoryData = [] } = useGetCategoryTreeQuery();

  console.log("Categories Tree from API:", categoryData);
  const categoryTree = useMemo(() => {
    return (categoryData || []).map(({ name, icon }) => ({
      name,
      icon,
    }));
  }, [categoryData]);

  const { data: productData } = useGetProductByIdQuery(id);
  // console.log("Fetched product data:", productData);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, productData]);

  const fetchProduct = async () => {
    console.log("Fetching product data...");
    setLoading(true);
    // const mockProduct = {
    //   name: "Wireless Headphones",
    //   sku: "WH-001",
    //   category: "Electronics",
    //   description: "High-quality wireless headphones",
    //   regularPrice: 99.99,
    //   salePrice: 79.99,
    //   cost: 45.0,
    //   stockQuantity: 45,
    //   lowStockThreshold: 10,
    //   images: [
    //     {
    //       url: "https://via.placeholder.com/400?text=Image+1",
    //       preview: "https://via.placeholder.com/400?text=Image+1",
    //       isFeatured: true,
    //     },
    //     {
    //       url: "https://via.placeholder.com/400?text=Image+2",
    //       preview: "https://via.placeholder.com/400?text=Image+2",
    //       isFeatured: false,
    //     },
    //   ],
    //   slug: "wireless-headphones",
    //   metaTitle: "Best Wireless Headphones",
    //   metaDescription: "Shop our premium wireless headphones",
    //   weight: "0.5",
    //   dimensions: "20x15x5",
    //   tags: ["headphones", "wireless", "audio"],
    // };
    setFormData(productData.data || []);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // ── Append all scalar fields ─────────────────────────────────────────
      const scalarFields = [
        "name",
        "sku",
        "slug",
        "description",
        "category",
        "regularPrice",
        "salePrice",
        "cost",
        "stockQuantity",
        "lowStockThreshold",
        "unit",
        "weight",
        "dimensions",
        "metaTitle",
        "metaDescription",
      ];
      scalarFields.forEach((field) => {
        if (
          formData[field] !== "" &&
          formData[field] !== null &&
          formData[field] !== undefined
        ) {
          formDataToSend.append(field, formData[field]);
        }
      });

      // ── Append tags array as JSON ────────────────────────────────────────
      formDataToSend.append("tags", JSON.stringify(formData.tags));
      if (id) {
        formDataToSend.append("id", id);
      }

      // ── Append image files (new uploads only) ────────────────────────────
      // Images that came from the server (existing) have a `url` but no `file`
      // Images the user just picked have a `file` (File object) and a `preview`
      formData.images.forEach((img) => {
        if (img.file) {
          formDataToSend.append("images", img.file);
        }
      });
      if (id) {
        console.log("Updating product with data:", formDataToSend);
        await updateProduct(formDataToSend); // pass FormData, NOT formData
      } else {
        await addProduct(formDataToSend); // pass FormData, NOT formData
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInput = (e) => {
    const { name, value } = e.target;
    const arr = value.split(",").map((t) => t.trim());
    setFormData((prev) => ({ ...prev, [name]: arr }));
  };

  // ─── Image Handlers ───────────────────────────────────────────

  const handleImageFiles = (files) => {
    const fileArray = Array.from(files);
    const newImages = fileArray.map((file) => ({
      url: null,
      file,
      preview: URL.createObjectURL(file),
      isFeatured: false,
    }));

    setFormData((prev) => {
      const combined = [...prev.images, ...newImages];
      // Auto-set first image as featured if none is set
      const hasFeatured = combined.some((img) => img.isFeatured);
      if (!hasFeatured && combined.length > 0) {
        combined[0] = { ...combined[0], isFeatured: true };
      }
      return { ...prev, images: combined };
    });
  };

  const handleFileInputChange = (e) => {
    if (e.target.files?.length) {
      handleImageFiles(e.target.files);
      e.target.value = ""; // reset so same file can be re-added
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files?.length) handleImageFiles(files);
  };

  const handleDragOver = (e) => e.preventDefault();

  const removeImage = (index) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, i) => i !== index);
      // If removed image was featured, set first remaining as featured
      const wasFeature = prev.images[index]?.isFeatured;
      if (wasFeature && updated.length > 0) {
        updated[0] = { ...updated[0], isFeatured: true };
      }
      // Revoke object URL to prevent memory leaks
      if (prev.images[index]?.file) {
        URL.revokeObjectURL(prev.images[index].preview);
      }
      return { ...prev, images: updated };
    });
  };

  const setFeaturedImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isFeatured: i === index,
      })),
    }));
  };

  const featuredImage = formData.images.find((img) => img.isFeatured);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              {id ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {id
                ? "Update product information"
                : "Create a new product in your catalog"}
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/products")}
            className="text-gray-600 cursor-pointer hover:text-red-600 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Basic Information
                </h2>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU *
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent w-full"
                    >
                      <option value="">All Categories</option>
                      {categoryTree.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Pricing
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Regular Price *",
                      name: "regularPrice",
                      required: true,
                    },
                    { label: "Sale Price", name: "salePrice" },
                    { label: "Cost", name: "cost" },
                  ].map(({ label, name, required }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          ৳
                        </span>
                        <input
                          type="number"
                          name={name}
                          value={formData[name]}
                          onChange={handleInputChange}
                          step="0.01"
                          required={required}
                          className="w-full pl-8 pr-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Inventory
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Low Stock Threshold
                    </label>
                    <input
                      type="number"
                      name="lowStockThreshold"
                      value={formData.lowStockThreshold}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Images Section ─────────────────────────────────────── */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    Images
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formData.images.length} image
                    {formData.images.length !== 1 ? "s" : ""} uploaded
                    {featuredImage ? " · 1 featured" : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-(--color-primary) hover:bg-(--color-primary-hover) rounded-lg transition-colors cursor-pointer"
                >
                  <ImagePlus size={16} />
                  Add Images
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-5">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileInputChange}
                />

                {/* Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all group"
                >
                  <Upload
                    size={32}
                    className="mx-auto text-gray-400 group-hover:text-gray-500 mb-3 transition-colors"
                  />
                  <p className="text-sm font-medium text-gray-700">
                    Drop images here or click to browse
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, WEBP supported · Multiple files allowed
                  </p>
                </div>

                {/* Image Grid */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {formData.images.map((img, index) => (
                      <div
                        key={index}
                        className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                          img.isFeatured
                            ? "border-yellow-400 shadow-md shadow-yellow-100"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {/* Image */}
                        <div className="aspect-square bg-gray-100">
                          <img
                            src={img.preview || img.url}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Featured Badge */}
                        {img.isFeatured && (
                          <div className="absolute top-1.5 left-1.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                            <Star size={9} fill="currentColor" />
                            Featured
                          </div>
                        )}

                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {/* Set Featured */}
                          {!img.isFeatured && (
                            <button
                              type="button"
                              onClick={() => setFeaturedImage(index)}
                              title="Set as featured"
                              className="p-1.5 bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-300 transition-colors cursor-pointer"
                            >
                              <Star size={14} />
                            </button>
                          )}
                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            title="Remove image"
                            className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Quick Add tile */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all group"
                    >
                      <ImagePlus
                        size={22}
                        className="text-gray-300 group-hover:text-gray-500 transition-colors"
                      />
                      <span className="text-[11px] text-gray-400 mt-1.5 group-hover:text-gray-500">
                        Add more
                      </span>
                    </div>
                  </div>
                )}

                {/* Helper text */}
                {formData.images.length > 0 && (
                  <p className="text-xs text-gray-400">
                    Hover over an image to set it as featured (
                    <Star size={10} className="inline" />) or remove it (
                    <Trash2 size={10} className="inline" />
                    ).
                  </p>
                )}
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  SEO
                </h2>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleInputChange}
                    maxLength="60"
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.metaTitle?.length || 0}/60 characters
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    rows="3"
                    maxLength="160"
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.metaDescription?.length || 0}/160 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Additional Information
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dimensions (LxWxH cm)
                    </label>
                    <input
                      type="text"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleInputChange}
                      placeholder="20x15x5"
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags.join(", ")}
                    onChange={handleArrayInput}
                    placeholder="headphones, wireless, audio"
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm p-4 sticky bottom-0 mt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="px-6 py-2 border cursor-pointer border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 cursor-pointer bg-(--color-primary) text-white rounded-lg hover:bg-(--color-primary-hover) transition-colors disabled:opacity-50 flex items-center justify-center gap-2 order-1 sm:order-2"
              >
                <Save size={18} />
                {loading
                  ? id
                    ? "Updating..."
                    : "Saving..."
                  : id
                    ? "Update Product"
                    : "Save Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditProduct;
