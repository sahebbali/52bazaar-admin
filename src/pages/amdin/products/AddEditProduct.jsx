import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, X } from "lucide-react";

const AddEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    images: [],
    featuredImage: null,
    slug: "",
    metaTitle: "",
    metaDescription: "",
    weight: "",
    dimensions: "",
    tags: [],
  });

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    // Mock API call
    const mockProduct = {
      name: "Wireless Headphones",
      sku: "WH-001",
      category: "Electronics",
      description: "High-quality wireless headphones",
      regularPrice: 99.99,
      salePrice: 79.99,
      cost: 45.0,
      stockQuantity: 45,
      lowStockThreshold: 10,
      images: ["https://via.placeholder.com/400"],
      featuredImage: "https://via.placeholder.com/400",
      slug: "wireless-headphones",
      metaTitle: "Best Wireless Headphones",
      metaDescription: "Shop our premium wireless headphones",
      weight: "0.5",
      dimensions: "20x15x5",
      tags: ["headphones", "wireless", "audio"],
    };
    setFormData(mockProduct);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // API call to save
    console.log("Saving product:", formData);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    navigate("/admin/products");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInput = (e) => {
    const { name, value } = e.target;
    const tagsArray = value.split(",").map((tag) => tag.trim());
    setFormData((prev) => ({ ...prev, [name]: tagsArray }));
  };

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
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information Section */}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                    />
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Pricing
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Regular Price *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        name="regularPrice"
                        value={formData.regularPrice}
                        onChange={handleInputChange}
                        step="0.01"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sale Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        name="salePrice"
                        value={formData.salePrice}
                        onChange={handleInputChange}
                        step="0.01"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        name="cost"
                        value={formData.cost}
                        onChange={handleInputChange}
                        step="0.01"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Section */}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      required
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Images
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Featured Image URL
                    </label>
                    <input
                      type="text"
                      name="featuredImage"
                      value={formData.featuredImage || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Images (comma separated URLs)
                    </label>
                    <textarea
                      name="images"
                      value={formData.images.join(", ")}
                      onChange={(e) => {
                        const urls = e.target.value
                          .split(",")
                          .map((url) => url.trim());
                        setFormData((prev) => ({ ...prev, images: urls }));
                      }}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Section */}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                    maxLength="60"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                    maxLength="160"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.metaDescription?.length || 0}/160 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      placeholder="20x15x5"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                    placeholder="headphones, wireless, audio"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Sticky on mobile */}
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
                {loading ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditProduct;
