// components/admin/CouponForm.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const CouponForm = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minPurchase: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code,
        description: initialData.description,
        discountType: initialData.discountType,
        discountValue: initialData.discountValue,
        minPurchase: initialData.minPurchase,
        maxDiscount: initialData.maxDiscount || "",
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        usageLimit: initialData.usageLimit,
        isActive: initialData.isActive,
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.code.trim()) newErrors.code = "Coupon code is required";
    if (!formData.discountValue)
      newErrors.discountValue = "Discount value is required";
    if (formData.discountValue <= 0)
      newErrors.discountValue = "Discount must be greater than 0";
    if (
      formData.discountType === "percentage" &&
      formData.discountValue > 100
    ) {
      newErrors.discountValue = "Percentage discount cannot exceed 100%";
    }
    if (!formData.minPurchase || formData.minPurchase < 0) {
      newErrors.minPurchase = "Valid minimum purchase amount is required";
    }
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate > formData.endDate
    ) {
      newErrors.endDate = "End date must be after start date";
    }
    if (!formData.usageLimit || formData.usageLimit <= 0) {
      newErrors.usageLimit = "Valid usage limit is required";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({
      ...formData,
      discountValue: parseFloat(formData.discountValue),
      minPurchase: parseFloat(formData.minPurchase),
      maxDiscount: formData.maxDiscount
        ? parseFloat(formData.maxDiscount)
        : undefined,
      usageLimit: parseInt(formData.usageLimit),
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "Edit Coupon" : "Create New Coupon"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 cursor-pointer hover:text-red-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Code *
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g., SAVE20, WELCOME10"
              className="w-full px-3 py-2 border text-black cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
              style={{ textTransform: "uppercase" }}
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              placeholder="Brief description of this coupon"
              className="w-full px-3 py-2 border text-black cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type *
              </label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (৳)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Value *
              </label>
              <div className="relative">
                {formData.discountType === "fixed" && (
                  <span className="absolute left-3 top-2 text-gray-500">৳</span>
                )}
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  step={formData.discountType === "percentage" ? 1 : 0.01}
                  min="0"
                  max={formData.discountType === "percentage" ? 100 : undefined}
                  className={`w-full px-3 py-2 border text-black cursor-pointer rounded-lg focus:ring-2 focus:ring-(--color-primary) ${
                    formData.discountType === "fixed" ? "pl-7" : ""
                  }`}
                />
              </div>
              {errors.discountValue && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.discountValue}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Purchase Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">৳</span>
                <input
                  type="number"
                  name="minPurchase"
                  value={formData.minPurchase}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full pl-7 px-3 py-2 border text-black cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary)"
                />
              </div>
              {errors.minPurchase && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.minPurchase}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Discount (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">৳</span>
                <input
                  type="number"
                  name="maxDiscount"
                  value={formData.maxDiscount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full pl-7 px-3 py-2 border text-black cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary)"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Only applies to percentage discounts
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary)"
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary)"
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usage Limit *
            </label>
            <input
              type="number"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border text-black cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary)"
            />
            <p className="mt-1 text-xs text-gray-500">
              Maximum number of times this coupon can be used
            </p>
            {errors.usageLimit && (
              <p className="mt-1 text-sm text-red-600">{errors.usageLimit}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-(--color-primary) focus:ring-(--color-primary) border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Active (coupon can be used immediately)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 cursor-pointer bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 cursor-pointer text-white bg-(--color-primary) rounded-lg hover:bg-(--color-primary-hover) transition-colors"
            >
              {initialData ? "Update Coupon" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponForm;
