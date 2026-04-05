// AddEditUser.jsx - Add/Edit User Form
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, X, Shield, Eye, EyeOff, Lock } from "lucide-react";
const AddEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "viewer",
    status: "active",
    password: "",
    confirmPassword: "",
    permissions: {
      products: { view: false, edit: false, delete: false },
      orders: { view: false, edit: false, delete: false },
      customers: { view: false, edit: false, delete: false },
      reports: { view: false, edit: false, delete: false },
      settings: { view: false, edit: false, delete: false },
      users: { view: false, edit: false, delete: false },
    },
  });

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    setLoading(true);
    // Mock API call
    const mockUser = {
      name: "John Doe",
      email: "john.doe@example.com",
      role: "admin",
      status: "active",
      permissions: {
        products: { view: true, edit: true, delete: false },
        orders: { view: true, edit: true, delete: false },
        customers: { view: true, edit: false, delete: false },
        reports: { view: true, edit: false, delete: false },
        settings: { view: false, edit: false, delete: false },
        users: { view: false, edit: false, delete: false },
      },
    };
    setFormData((prev) => ({ ...prev, ...mockUser }));
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    console.log("Saving user:", formData);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    navigate("/admin/users");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (module, action) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module],
          [action]: !prev.permissions[module][action],
        },
      },
    }));
  };

  const getRolePermissions = (role) => {
    const rolePermissions = {
      super_admin: {
        products: { view: true, edit: true, delete: true },
        orders: { view: true, edit: true, delete: true },
        customers: { view: true, edit: true, delete: true },
        reports: { view: true, edit: true, delete: true },
        settings: { view: true, edit: true, delete: true },
        users: { view: true, edit: true, delete: true },
      },
      admin: {
        products: { view: true, edit: true, delete: false },
        orders: { view: true, edit: true, delete: false },
        customers: { view: true, edit: true, delete: false },
        reports: { view: true, edit: false, delete: false },
        settings: { view: false, edit: false, delete: false },
        users: { view: true, edit: false, delete: false },
      },
      editor: {
        products: { view: true, edit: true, delete: false },
        orders: { view: true, edit: false, delete: false },
        customers: { view: true, edit: false, delete: false },
        reports: { view: false, edit: false, delete: false },
        settings: { view: false, edit: false, delete: false },
        users: { view: false, edit: false, delete: false },
      },
      viewer: {
        products: { view: true, edit: false, delete: false },
        orders: { view: true, edit: false, delete: false },
        customers: { view: true, edit: false, delete: false },
        reports: { view: true, edit: false, delete: false },
        settings: { view: false, edit: false, delete: false },
        users: { view: false, edit: false, delete: false },
      },
    };
    return rolePermissions[role] || rolePermissions.viewer;
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
      permissions: getRolePermissions(role),
    }));
  };

  const modules = [
    { id: "products", label: "Products", icon: "📦" },
    { id: "orders", label: "Orders", icon: "🛒" },
    { id: "customers", label: "Customers", icon: "👥" },
    { id: "reports", label: "Reports", icon: "📊" },
    { id: "settings", label: "Settings", icon: "⚙️" },
    { id: "users", label: "Users", icon: "👤" },
  ];

  const roleOptions = [
    {
      value: "super_admin",
      label: "Super Admin",
      description: "Full system access",
      color: "purple",
    },
    {
      value: "admin",
      label: "Admin",
      description: "Manage most features",
      color: "blue",
    },
    {
      value: "editor",
      label: "Editor",
      description: "Create and edit content",
      color: "green",
    },
    {
      value: "viewer",
      label: "Viewer",
      description: "Read-only access",
      color: "gray",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                {id ? "Edit Admin User" : "Add New Admin User"}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                {id
                  ? "Update user information and permissions"
                  : "Create a new administrator account"}
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/users")}
              className="text-gray-600 cursor-pointer hover:text-red-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* User Information */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gradient-to-r from-(--color-primary) to-white px-4 sm:px-6 py-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-(--color-primary)" />
                  User Information
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Basic account details and role assignment
                </p>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border cursor-pointer text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border cursor-pointer text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                      placeholder="admin@example.com"
                    />
                  </div>
                  {!id && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border cursor-pointer text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent pr-10"
                            placeholder="Enter password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border cursor-pointer text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                          placeholder="Confirm password"
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                    >
                      {roleOptions.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label} - {role.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="status"
                          value="active"
                          checked={formData.status === "active"}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600"
                        />
                        <span className="text-gray-700">Active</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="status"
                          value="inactive"
                          checked={formData.status === "inactive"}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-red-600"
                        />
                        <span className="text-gray-700">Inactive</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions */}
            {formData.role !== "super_admin" && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-white px-4 sm:px-6 py-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-green-600" />
                    Granular Permissions
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Configure specific module permissions for this user
                  </p>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="space-y-6">
                    {modules.map((module) => (
                      <div
                        key={module.id}
                        className="border-b border-gray-100 pb-4 last:border-0"
                      >
                        <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <span className="text-xl">{module.icon}</span>
                          {module.label}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={
                                formData.permissions[module.id]?.view || false
                              }
                              onChange={() =>
                                handlePermissionChange(module.id, "view")
                              }
                              className="w-4 h-4 text-(--color-primary)"
                            />
                            <span className="text-sm text-black">View</span>
                          </label>
                          <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={
                                formData.permissions[module.id]?.edit || false
                              }
                              onChange={() =>
                                handlePermissionChange(module.id, "edit")
                              }
                              className="w-4 h-4 text-(--color-primary)"
                            />
                            <span className="text-sm text-black">
                              Edit/Create
                            </span>
                          </label>
                          <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={
                                formData.permissions[module.id]?.delete || false
                              }
                              onChange={() =>
                                handlePermissionChange(module.id, "delete")
                              }
                              className="w-4 h-4 text-red-600"
                            />
                            <span className="text-sm text-black">Delete</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {formData.role === "super_admin" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-(--color-primary)">
                  🔒 Super Admin has full access to all modules and permissions
                  by default.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 mt-6 bg-white rounded-lg shadow-sm p-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="px-6 py-2 border cursor-pointer border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-(--color-primary) cursor-pointer text-white rounded-lg hover:bg-(--color-primary-hover) transition-colors disabled:opacity-50 flex items-center justify-center gap-2 order-1 sm:order-2"
              >
                <Save size={18} />
                {loading ? "Saving..." : id ? "Update User" : "Create User"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditUser;
