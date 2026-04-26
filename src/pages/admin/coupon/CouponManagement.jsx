// components/admin/CouponManagement.jsx
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Copy, Check } from "lucide-react";
import CouponForm from "./components/CouponForm";

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // Load coupons from localStorage/API
  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = () => {
    const savedCoupons = localStorage.getItem("coupons");
    if (savedCoupons) {
      setCoupons(JSON.parse(savedCoupons));
    } else {
      // Sample data
      const sampleCoupons = [
        {
          id: "1",
          code: "WELCOME20",
          description: "Welcome discount for new customers",
          discountType: "percentage",
          discountValue: 20,
          minPurchase: 500,
          maxDiscount: 1000,
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          usageLimit: 100,
          usedCount: 45,
          isActive: true,
        },
        {
          id: "2",
          code: "SAVE100",
          description: "Save $100 on orders over $500",
          discountType: "fixed",
          discountValue: 100,
          minPurchase: 500,
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          usageLimit: 50,
          usedCount: 23,
          isActive: true,
        },
      ];
      setCoupons(sampleCoupons);
      localStorage.setItem("coupons", JSON.stringify(sampleCoupons));
    }
  };

  const saveCoupons = (updatedCoupons) => {
    setCoupons(updatedCoupons);
    localStorage.setItem("coupons", JSON.stringify(updatedCoupons));
  };

  const handleCreateCoupon = (couponData) => {
    const newCoupon = {
      ...couponData,
      id: Date.now().toString(),
      usedCount: 0,
    };
    console.log("Creating coupon:", newCoupon);
    saveCoupons([...coupons, newCoupon]);
    setShowForm(false);
  };

  const handleUpdateCoupon = (updatedData) => {
    const updatedCoupons = coupons.map((coupon) =>
      coupon.id === editingCoupon.id
        ? { ...updatedData, id: coupon.id, usedCount: coupon.usedCount }
        : coupon,
    );
    saveCoupons(updatedCoupons);
    setEditingCoupon(null);
    setShowForm(false);
  };

  const handleDeleteCoupon = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      const updatedCoupons = coupons.filter((coupon) => coupon.id !== id);
      saveCoupons(updatedCoupons);
    }
  };

  const handleToggleStatus = (id) => {
    const updatedCoupons = coupons.map((coupon) =>
      coupon.id === id ? { ...coupon, isActive: !coupon.isActive } : coupon,
    );
    saveCoupons(updatedCoupons);
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
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

      {showForm && (
        <CouponForm
          onSubmit={editingCoupon ? handleUpdateCoupon : handleCreateCoupon}
          onClose={() => {
            setShowForm(false);
            setEditingCoupon(null);
          }}
          initialData={editingCoupon}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`bg-white rounded-lg shadow-md border-l-4 overflow-hidden transition-all ${
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
                    onClick={() => handleDeleteCoupon(coupon.id)}
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
                      ? `${coupon.discountValue}% OFF`
                      : `$${coupon.discountValue} OFF`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Minimum Purchase:</span>
                  <span className="font-semibold text-gray-800">
                    ${coupon.minPurchase}
                  </span>
                </div>
                {coupon.maxDiscount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Max Discount:</span>
                    <span className="font-semibold text-gray-800">
                      ${coupon.maxDiscount}
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
    </div>
  );
};

export default CouponManagement;
