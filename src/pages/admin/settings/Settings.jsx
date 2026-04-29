import React, { useState, useEffect } from "react";
import { Save, Globe, CreditCard, Mail, Bell, Upload, X } from "lucide-react";
import {
  useDeleteNumberMutation,
  useGetSettingQuery,
  useSaveSettingMutation,
} from "../../../services/paymentApi";
import { Notification } from "../../../components/ToastNotification";

const Settings = () => {
  const initialFormData = {
    // General Settings
    storeName: "",
    storeEmail: "",
    storePhone: "",
    storeAddress: "",
    storeLogo: null,
    storeLogoPreview: "",
    currency: "BDT",
    timezone: "BST",
    dateFormat: "MM/DD/YYYY",

    // Bangladesh Payment Gateways
    bkashNumber: "",
    nagadNumber: "",
    rocketNumber: "",

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
  };

  const [formData, setFormData] = useState(initialFormData);

  // Reset function
  const resetFormData = () => {
    setFormData(initialFormData);
  };
  const [loading, setLoading] = useState(false);
  const [bkashNumbers, setBkashNumbers] = useState([]);
  const [nagadNumbers, setNagadNumbers] = useState([]);
  const [rocketNumbers, setRocketNumbers] = useState([]);
  const [activeSection, setActiveSection] = useState("general");

  const { data: settingsData } = useGetSettingQuery();

  console.log("Fetched settings data:", settingsData);
  console.log("bkashNumbers:", bkashNumbers);
  console.log("formData:", formData);

  // Helper function to clean form data
  const cleanFormData = (data) => {
    const cleaned = { ...data };
    const fieldsToRemove = ["bkashNumber", "rocketNumber", "nagadNumber"];
    fieldsToRemove.forEach((field) => delete cleaned[field]);
    return cleaned;
  };

  useEffect(() => {
    if (settingsData?.data) {
      setFormData((prev) => ({
        ...prev,
        // General Settings
        storeName: settingsData.data.storeName || prev.storeName,
        storeEmail: settingsData.data.storeEmail || prev.storeEmail,
        storePhone: settingsData.data.storePhone || prev.storePhone,
        storeAddress: settingsData.data.storeAddress || prev.storeAddress,
        storeLogo: settingsData.data.storeLogo || prev.storeLogo,
        storeLogoPreview:
          settingsData.data.storeLogoPreview || prev.storeLogoPreview,
        currency: settingsData.data.currency || prev.currency,
        timezone: settingsData.data.timezone || prev.timezone,
        dateFormat: settingsData.data.dateFormat || prev.dateFormat,

        // Email Settings
        smtpHost: settingsData.data.smtpHost || prev.smtpHost,
        smtpPort: settingsData.data.smtpPort || prev.smtpPort,
        smtpUser: settingsData.data.smtpUser || prev.smtpUser,
        smtpPassword: settingsData.data.smtpPassword || prev.smtpPassword,
        smtpEncryption: settingsData.data.smtpEncryption || prev.smtpEncryption,
        fromEmail: settingsData.data.fromEmail || prev.fromEmail,
        fromName: settingsData.data.fromName || prev.fromName,
        emailTemplate: settingsData.data.emailTemplate || prev.emailTemplate,

        // Notification Settings
        orderNotifications:
          settingsData.data.orderNotifications ?? prev.orderNotifications,
        lowStockNotifications:
          settingsData.data.lowStockNotifications ?? prev.lowStockNotifications,
        lowStockThreshold:
          settingsData.data.lowStockThreshold ?? prev.lowStockThreshold,
        customerQueryNotifications:
          settingsData.data.customerQueryNotifications ??
          prev.customerQueryNotifications,
        adminEmail: settingsData.data.adminEmail || prev.adminEmail,
        alertEmail: settingsData.data.alertEmail || prev.alertEmail,
        dailyReport: settingsData.data.dailyReport ?? prev.dailyReport,
        weeklyReport: settingsData.data.weeklyReport ?? prev.weeklyReport,
      }));

      setRocketNumbers(settingsData.data.rocketNumbers || []);
      setBkashNumbers(settingsData.data.bkashNumbers || []);
      setNagadNumbers(settingsData.data.nagadNumbers || []);
    }
  }, [settingsData?.data]);

  const [saveSettings, { data, isLoading: isSaving, isError, error }] =
    useSaveSettingMutation();
  useEffect(() => {
    if (data) {
      Notification(data.message || "Settings saved successfully!", "success");
      resetFormData();
      console.log("Settings saved successfully:", data);
    }
    if (error) {
      Notification(
        error.data?.message || "Failed to save settings. Please try again.",
        "error",
      );
      console.error("Failed to save settings:", error);
    }
  }, [data, error]);

  //delete number
  const [
    deleteNumber,
    {
      data: deleteData,
      isLoading: isDeleting,
      isError: deleteError,
      error: mutationError,
    },
  ] = useDeleteNumberMutation();
  useEffect(() => {
    if (deleteData) {
      Notification(
        deleteData.message || "Number deleted successfully!",
        "success",
      );
      console.log("Number deleted successfully:", deleteData);
    }
    if (mutationError) {
      Notification(
        mutationError.data?.message ||
          "Failed to delete number. Please try again.",
        "error",
      );
      console.error("Failed to delete number:", mutationError);
    }
  }, [deleteData, mutationError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();

    // Append all form fields to FormData
    // General Settings
    form.append("storeName", formData.storeName);
    form.append("storeEmail", formData.storeEmail);
    form.append("storePhone", formData.storePhone);
    form.append("storeAddress", formData.storeAddress);
    form.append("currency", formData.currency);
    form.append("timezone", formData.timezone);
    form.append("dateFormat", formData.dateFormat);

    // Image file
    if (formData.storeLogo instanceof File) {
      form.append("images", formData.storeLogo);
    }

    // Payment Settings (Multiple Numbers as JSON arrays)
    // If you're using multiple numbers, send as JSON
    if (formData.bkashNumbers) {
      form.append("bkashNumbers", JSON.stringify(formData.bkashNumbers));
    } else if (formData.bkashNumber) {
      // If using single number, convert to array
      form.append("bkashNumbers", JSON.stringify([formData.bkashNumber]));
    }

    if (formData.nagadNumbers) {
      form.append("nagadNumbers", JSON.stringify(formData.nagadNumbers));
    } else if (formData.nagadNumber) {
      form.append("nagadNumbers", JSON.stringify([formData.nagadNumber]));
    }

    if (formData.rocketNumbers) {
      form.append("rocketNumbers", JSON.stringify(formData.rocketNumbers));
    } else if (formData.rocketNumber) {
      form.append("rocketNumbers", JSON.stringify([formData.rocketNumber]));
    }

    // // Email Settings
    // form.append("smtpHost", formData.smtpHost);
    // form.append("smtpPort", formData.smtpPort);
    // form.append("smtpUser", formData.smtpUser);
    // form.append("smtpPassword", formData.smtpPassword);
    // form.append("smtpEncryption", formData.smtpEncryption);
    form.append("fromEmail", formData.fromEmail);
    form.append("fromName", formData.fromName);
    form.append("emailTemplate", formData.emailTemplate);

    // Notification Settings
    form.append("orderNotifications", formData.orderNotifications);
    form.append("lowStockNotifications", formData.lowStockNotifications);
    form.append("lowStockThreshold", formData.lowStockThreshold);
    form.append(
      "customerQueryNotifications",
      formData.customerQueryNotifications,
    );
    form.append("adminEmail", formData.adminEmail);
    form.append("alertEmail", formData.alertEmail);
    form.append("dailyReport", formData.dailyReport);
    form.append("weeklyReport", formData.weeklyReport);

    // Payment Gateway Selection (if you have this field)
    if (formData.paymentGateway) {
      form.append("paymentGateway", formData.paymentGateway);
    }

    // COD Enabled (if you have this field)
    if (formData.codEnabled !== undefined) {
      form.append("codEnabled", formData.codEnabled);
    }

    // Bank Transfer Enabled (if you have this field)
    if (formData.bankTransferEnabled !== undefined) {
      form.append("bankTransferEnabled", formData.bankTransferEnabled);
    }

    console.log("Saving settings form data:", Object.fromEntries(form));

    try {
      await saveSettings(form);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBkashNumber = async (number, gateway) => {
    await deleteNumber({ number, gateway });
    console.log(`Deleting ${gateway} number:`, number);
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
    // {
    //   id: "email",
    //   label: "Email Settings",
    //   icon: "📧",
    //   description: "SMTP and email templates",
    // },
    // {
    //   id: "notifications",
    //   label: "Notifications",
    //   icon: "🔔",
    //   description: "Admin alerts and notifications",
    // },
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
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
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
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
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
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
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
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      >
                        <option value="BDT">BDT - Bangladeshi Taka</option>
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
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      >
                        <option value="UTC">UTC</option>
                        <option value="BST">BST</option>
                        <option value="America/New_York">Eastern Time</option>

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
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
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
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      placeholder="Enter your store address"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
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
                        { id: "bkash", label: "bKash", icon: "📱" },
                        { id: "nagad", label: "Nagad", icon: "📲" },

                        { id: "rocket", label: "Rocket", icon: "🚀" },
                      ].map((gateway) => (
                        <label
                          key={gateway.id}
                          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                            formData.paymentGateway === gateway.id
                              ? "border-(--color-primary) bg-(--color-primary)/10"
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

                  {/* bKash Configuration */}
                  {formData.paymentGateway === "bkash" && (
                    <div className="space-y-4 bg-gradient-to-r from-pink-50 to-white p-4 rounded-lg border border-pink-200">
                      <h3 className="font-medium text-gray-900 flex items-center gap-2">
                        <span className="text-xl">📱</span> bKash Configuration
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            bKash Number
                          </label>
                          <input
                            type="tel"
                            name="bkashNumber"
                            value={formData.bkashNumber || ""}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg"
                            placeholder="01XXXXXXXXX"
                            maxLength={11}
                          />
                        </div>
                      </div>
                      {bkashNumbers?.length > 0 && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Saved bKash Numbers
                          </label>
                          <div className="space-y-2">
                            {bkashNumbers.map((number, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-green-600">✓</span>
                                  <span className="text-gray-700 font-mono">
                                    {number}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteBkashNumber(
                                      number,
                                      "bkashNumbers",
                                    )
                                  }
                                  // disabled={isDeleting}
                                  className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Nagad Configuration */}
                  {formData.paymentGateway === "nagad" && (
                    <div className="space-y-4 bg-gradient-to-r from-orange-50 to-white p-4 rounded-lg border border-orange-200">
                      <h3 className="font-medium text-gray-900 flex items-center gap-2">
                        <span className="text-xl">📲</span> Nagad Configuration
                      </h3>
                      <div className="grid grid-cos-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nagad Number
                          </label>
                          <input
                            type="tel"
                            name="nagadNumber"
                            value={formData.nagadNumber || ""}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg"
                            placeholder="01XXXXXXXXX"
                            maxLength={11}
                          />
                        </div>
                      </div>
                      {nagadNumbers?.length > 0 && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Saved Nagad Numbers
                          </label>
                          <div className="space-y-2">
                            {nagadNumbers.map((number, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-green-600">✓</span>
                                  <span className="text-gray-700 font-mono">
                                    {number}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteBkashNumber(
                                      number,
                                      "nagadNumbers",
                                    )
                                  }
                                  // disabled={isDeleting}
                                  className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rocket Configuration */}
                  {formData.paymentGateway === "rocket" && (
                    <div className="space-y-4 bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-200">
                      <h3 className="font-medium text-gray-900 flex items-center gap-2">
                        <span className="text-xl">🚀</span> Rocket Configuration
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rocket Number
                          </label>
                          <input
                            type="tel"
                            name="rocketNumber"
                            value={formData.rocketNumber || ""}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg"
                            placeholder="01XXXXXXXXX"
                            maxLength={11}
                          />
                        </div>
                      </div>
                      {rocketNumbers?.length > 0 && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Saved Rocket Numbers
                          </label>
                          <div className="space-y-2">
                            {rocketNumbers.map((number, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-green-600">✓</span>
                                  <span className="text-gray-700 font-mono">
                                    {number}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteBkashNumber(
                                      number,
                                      "rocketNumbers",
                                    )
                                  }
                                  // disabled={isDeleting}
                                  className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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
