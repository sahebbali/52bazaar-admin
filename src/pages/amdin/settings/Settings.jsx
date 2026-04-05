// Settings.jsx
import React, { useState, useEffect } from "react";
import { Save, Globe, CreditCard, Mail, Bell, Upload, X } from "lucide-react";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const [formData, setFormData] = useState({
    // General Settings
    storeName: "",
    storeEmail: "",
    storePhone: "",
    storeAddress: "",
    storeLogo: null,
    storeLogoPreview: "",
    currency: "USD",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",

    // Payment Settings
    paymentGateway: "stripe",
    stripePublicKey: "",
    stripeSecretKey: "",
    paypalClientId: "",
    paypalSecret: "",
    paypalMode: "sandbox",
    razorpayKeyId: "",
    razorpayKeySecret: "",
    codEnabled: true,
    bankTransferEnabled: false,

    // Email Settings
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPassword: "",
    smtpEncryption: "tls",
    fromEmail: "",
    fromName: "",
    emailTemplate: "default",

    // Notification Settings
    orderNotifications: true,
    lowStockNotifications: true,
    lowStockThreshold: 10,
    customerQueryNotifications: true,
    adminEmail: "",
    alertEmail: "",
    dailyReport: true,
    weeklyReport: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    // Mock API call
    const mockSettings = {
      storeName: "ShopMaster",
      storeEmail: "contact@shopmaster.com",
      storePhone: "+1 (555) 123-4567",
      storeAddress: "123 Commerce St, New York, NY 10001",
      currency: "USD",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      paymentGateway: "stripe",
      codEnabled: true,
      orderNotifications: true,
      lowStockNotifications: true,
      lowStockThreshold: 10,
      adminEmail: "admin@shopmaster.com",
    };
    setFormData((prev) => ({ ...prev, ...mockSettings }));
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Saving settings:", formData);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    alert("Settings saved successfully!");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          storeLogo: file,
          storeLogoPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const sections = [
    {
      id: "general",
      label: "General Settings",
      icon: "🏪",
      description: "Basic store information and configuration",
    },
    {
      id: "payment",
      label: "Payment Settings",
      icon: "💳",
      description: "Configure payment gateways",
    },
    {
      id: "email",
      label: "Email Settings",
      icon: "📧",
      description: "SMTP and email templates",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: "🔔",
      description: "Admin alerts and notifications",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Settings
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Manage your store configuration and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section Navigation - Horizontal scroll on mobile */}
          <div className="mb-6 overflow-x-auto pb-2">
            <div className="flex gap-3 min-w-max">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`px-4 sm:px-6 py-3 rounded-lg text-left transition-all ${
                    activeSection === section.id
                      ? "bg-(--color-primary) text-white shadow-lg"
                      : "bg-white cursor-pointer text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{section.icon}</span>
                    <div>
                      <div className="font-medium text-sm sm:text-base">
                        {section.label}
                      </div>
                      <div
                        className={`text-xs hidden md:block ${
                          activeSection === section.id
                            ? "text-(--color-primary)"
                            : "text-gray-500"
                        }`}
                      >
                        {section.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Settings Content */}
          <div className="space-y-6">
            {/* General Settings */}
            {activeSection === "general" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-(--color-primary) to-white px-4 sm:px-6 py-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-(--color-primary)" />
                    General Settings
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Configure your store's basic information
                  </p>
                </div>

                <div className="p-4 sm:p-6 space-y-6">
                  {/* Store Logo */}
                  <div className="border-b border-gray-200 pb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Store Logo
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {formData.storeLogoPreview && (
                        <div className="relative">
                          <img
                            src={formData.storeLogoPreview}
                            alt="Store logo"
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                storeLogoPreview: null,
                                storeLogo: null,
                              }))
                            }
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                      <label className="cursor-pointer bg-(--color-primary) text-white px-4 py-2 rounded-lg hover:bg-(--color-primary-hover) transition inline-flex items-center gap-2">
                        <Upload size={18} />
                        Upload Logo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500">
                        Recommended size: 200x50px. Max size: 2MB
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Store Name *
                      </label>
                      <input
                        type="text"
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Store Email *
                      </label>
                      <input
                        type="email"
                        name="storeEmail"
                        value={formData.storeEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="storePhone"
                        value={formData.storePhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="INR">INR - Indian Rupee</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">
                          Pacific Time
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Format
                      </label>
                      <select
                        name="dateFormat"
                        value={formData.dateFormat}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Address
                    </label>
                    <textarea
                      name="storeAddress"
                      value={formData.storeAddress}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      placeholder="Enter your store address"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeSection === "payment" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-white px-4 sm:px-6 py-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    Payment Settings
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Configure payment gateways for your store
                  </p>
                </div>

                <div className="p-4 sm:p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Default Payment Gateway
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { id: "stripe", label: "Stripe", icon: "💳" },
                        { id: "paypal", label: "PayPal", icon: "💰" },
                        { id: "razorpay", label: "Razorpay", icon: "🏦" },
                      ].map((gateway) => (
                        <label
                          key={gateway.id}
                          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                            formData.paymentGateway === gateway.id
                              ? "border-(--color-primary) bg-(--color-primary)"
                              : "border-gray-200 hover:border-(--color-primary)"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentGateway"
                            value={gateway.id}
                            checked={formData.paymentGateway === gateway.id}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-(--color-primary)"
                          />
                          <span className="text-xl">{gateway.icon}</span>
                          <span className="font-medium text-black">
                            {gateway.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.paymentGateway === "stripe" && (
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900">
                        Stripe Configuration
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Publishable Key
                          </label>
                          <input
                            type="text"
                            name="stripePublicKey"
                            value={formData.stripePublicKey}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="pk_test_..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Secret Key
                          </label>
                          <input
                            type="password"
                            name="stripeSecretKey"
                            value={formData.stripeSecretKey}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="sk_test_..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentGateway === "paypal" && (
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900">
                        PayPal Configuration
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Client ID
                          </label>
                          <input
                            type="text"
                            name="paypalClientId"
                            value={formData.paypalClientId}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Secret
                          </label>
                          <input
                            type="password"
                            name="paypalSecret"
                            value={formData.paypalSecret}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mode
                        </label>
                        <select
                          name="paypalMode"
                          value={formData.paypalMode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="sandbox">Sandbox (Testing)</option>
                          <option value="live">Live</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Additional Payment Methods
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="codEnabled"
                          checked={formData.codEnabled}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-(--color-primary)"
                        />
                        <span className="text-gray-700">
                          Cash on Delivery (COD)
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="bankTransferEnabled"
                          checked={formData.bankTransferEnabled}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-(--color-primary)"
                        />
                        <span className="text-gray-700">
                          Bank Transfer / Wire Transfer
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeSection === "email" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white px-4 sm:px-6 py-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-purple-600" />
                    Email Settings
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Configure SMTP and email templates
                  </p>
                </div>

                <div className="p-4 sm:p-6 space-y-6">
                  <div className="bg-(--color-primary)50 border border-(--color-primary)200 rounded-lg p-4">
                    <p className="text-sm text-(--color-primary)">
                      💡 Configure SMTP settings to enable email functionality
                      for order confirmations, password resets, and
                      notifications.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        name="smtpHost"
                        value={formData.smtpHost}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg"
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Port
                      </label>
                      <input
                        type="number"
                        name="smtpPort"
                        value={formData.smtpPort}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="587"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Username
                      </label>
                      <input
                        type="text"
                        name="smtpUser"
                        value={formData.smtpUser}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Password
                      </label>
                      <input
                        type="password"
                        name="smtpPassword"
                        value={formData.smtpPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Encryption
                      </label>
                      <select
                        name="smtpEncryption"
                        value={formData.smtpEncryption}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg"
                      >
                        <option value="tls">TLS</option>
                        <option value="ssl">SSL</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Email
                      </label>
                      <input
                        type="email"
                        name="fromEmail"
                        value={formData.fromEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Name
                    </label>
                    <input
                      type="text"
                      name="fromName"
                      value={formData.fromName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg"
                      placeholder="Your Store Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Template
                    </label>
                    <select
                      name="emailTemplate"
                      value={formData.emailTemplate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg"
                    >
                      <option value="default">Default Template</option>
                      <option value="modern">Modern Template</option>
                      <option value="minimal">Minimal Template</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeSection === "notifications" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white px-4 sm:px-6 py-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-orange-600" />
                    Notification Settings
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Configure admin alerts and notifications
                  </p>
                </div>

                <div className="p-4 sm:p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">
                      Email Notifications
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <div>
                          <span className="font-medium text-gray-700">
                            Order Notifications
                          </span>
                          <p className="text-sm text-gray-500">
                            Receive email when new orders are placed
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          name="orderNotifications"
                          checked={formData.orderNotifications}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-(--color-primary)"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <div>
                          <span className="font-medium text-gray-700">
                            Low Stock Alerts
                          </span>
                          <p className="text-sm text-gray-500">
                            Get notified when products are low in stock
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          name="lowStockNotifications"
                          checked={formData.lowStockNotifications}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-(--color-primary)"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <div>
                          <span className="font-medium text-gray-700">
                            Customer Query Alerts
                          </span>
                          <p className="text-sm text-gray-500">
                            Receive notifications for customer inquiries
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          name="customerQueryNotifications"
                          checked={formData.customerQueryNotifications}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-(--color-primary)"
                        />
                      </label>
                    </div>
                  </div>

                  {formData.lowStockNotifications && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Low Stock Threshold
                      </label>
                      <input
                        type="number"
                        name="lowStockThreshold"
                        value={formData.lowStockThreshold}
                        onChange={handleInputChange}
                        className="w-full sm:w-64 px-3 py-2 border text-black border-gray-300 rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Get notified when stock quantity falls below this number
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-900 mb-4">
                      Admin Email Addresses
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Admin Email
                        </label>
                        <input
                          type="email"
                          name="adminEmail"
                          value={formData.adminEmail}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alert Email (Optional)
                        </label>
                        <input
                          type="email"
                          name="alertEmail"
                          value={formData.alertEmail}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-900 mb-4">
                      Report Schedule
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <div>
                          <span className="font-medium text-gray-700">
                            Daily Report
                          </span>
                          <p className="text-sm text-gray-500">
                            Receive daily sales and performance report
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          name="dailyReport"
                          checked={formData.dailyReport}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-(--color-primary)"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <div>
                          <span className="font-medium text-gray-700">
                            Weekly Report
                          </span>
                          <p className="text-sm text-gray-500">
                            Receive weekly summary report
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          name="weeklyReport"
                          checked={formData.weeklyReport}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-(--color-primary)"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 mt-6 bg-white rounded-lg shadow-sm p-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-6 py-2 border cursor-pointer border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors order-2 sm:order-1"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-(--color-primary) cursor-pointer text-white rounded-lg hover:bg-(--color-primary-hover) transition-colors disabled:opacity-50 flex items-center justify-center gap-2 order-1 sm:order-2"
              >
                <Save size={18} />
                {loading ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
